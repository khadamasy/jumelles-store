import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { memoryStore, Order, OrderItem } from '../config/db';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      shippingCity,
      items,
    } = req.body;

    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !shippingAddress ||
      !shippingCity ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Informations de commande incomplètes (coordonnées ou panier vide).',
      });
    }

    let calculatedTotal = 0;
    const orderItems: OrderItem[] = [];
    const orderId = `ord-${Date.now()}`;
    const orderNumber = `JUM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    for (const item of items) {
      // Rechercher la variante
      let foundVariant: any = null;
      let parentProduct: any = null;

      for (const p of memoryStore.products) {
        const v = p.variants.find((variant) => variant.id === item.productVariantId);
        if (v) {
          foundVariant = v;
          parentProduct = p;
          break;
        }
      }

      if (!foundVariant || !parentProduct) {
        return res.status(400).json({
          success: false,
          message: `Article/variante introuvable pour l'identifiant ${item.productVariantId}.`,
        });
      }

      const requestedQty = parseInt(item.quantity, 10) || 1;

      // Contrôle des stocks
      if (foundVariant.stockQuantity < requestedQty) {
        return res.status(400).json({
          success: false,
          message: `Stock insuffisant pour ${parentProduct.name} (${foundVariant.color} / ${foundVariant.sizeOrShoeSize}). Stock restant : ${foundVariant.stockQuantity}.`,
        });
      }

      const unitPrice = parentProduct.basePrice + (foundVariant.priceAdjustment || 0);
      const lineTotal = unitPrice * requestedQty;
      calculatedTotal += lineTotal;

      // Décrémenter le stock
      foundVariant.stockQuantity -= requestedQty;

      orderItems.push({
        id: `item-${uuidv4().substring(0, 8)}`,
        orderId,
        productVariantId: foundVariant.id,
        productName: parentProduct.name,
        variantDetails: `${foundVariant.color} / ${foundVariant.sizeOrShoeSize}`,
        quantity: requestedQty,
        unitPrice,
        totalPrice: lineTotal,
      });
    }

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      shippingCity,
      totalAmount: calculatedTotal,
      status: 'PENDING',
      items: orderItems,
      createdAt: new Date().toISOString(),
    };

    memoryStore.orders.unshift(newOrder);

    res.status(201).json({
      success: true,
      message: 'Commande enregistrée avec succès. En attente de paiement.',
      data: newOrder,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderByIdOrNumber = async (req: Request, res: Response) => {
  try {
    const { idOrNumber } = req.params;
    const order = memoryStore.orders.find(
      (o) => o.id === idOrNumber || o.orderNumber === idOrNumber
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Commande introuvable.' });
    }

    const transaction = memoryStore.transactions.find((t) => t.orderId === order.id);

    res.json({
      success: true,
      data: {
        ...order,
        transaction: transaction || null,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const email = req.user?.email || (req.query.email as string);

    if (!email) {
      return res.status(400).json({ success: false, message: 'Adresse e-mail requise.' });
    }

    const clientOrders = memoryStore.orders.filter(
      (o) => o.customerEmail.toLowerCase() === email.toLowerCase()
    );

    res.json({
      success: true,
      count: clientOrders.length,
      data: clientOrders,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      count: memoryStore.orders.length,
      data: memoryStore.orders,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['PENDING', 'PAID', 'PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Statut invalide. Statuts autorisés : ${allowed.join(', ')}`,
      });
    }

    const order = memoryStore.orders.find((o) => o.id === id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Commande introuvable.' });
    }

    order.status = status;

    res.json({
      success: true,
      message: `Statut de la commande ${order.orderNumber} mis à jour : ${status}`,
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalOrders = memoryStore.orders.length;
    const totalRevenue = memoryStore.orders
      .filter((o) => o.status === 'PAID' || o.status === 'DELIVERED' || o.status === 'SHIPPED')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingOrders = memoryStore.orders.filter((o) => o.status === 'PENDING').length;
    const totalProducts = memoryStore.products.length;

    // Produits à stock faible (< 5 unités)
    const lowStockVariants: any[] = [];
    memoryStore.products.forEach((p) => {
      p.variants.forEach((v) => {
        if (v.stockQuantity <= 4) {
          lowStockVariants.push({
            productName: p.name,
            sku: v.sku,
            variant: `${v.color} / ${v.sizeOrShoeSize}`,
            stockQuantity: v.stockQuantity,
          });
        }
      });
    });

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        totalProducts,
        lowStockCount: lowStockVariants.length,
        lowStockItems: lowStockVariants,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
