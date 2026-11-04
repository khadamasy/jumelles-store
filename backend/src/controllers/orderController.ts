import { Request, Response } from 'express';
import crypto from 'crypto';
import { randomUUID as uuidv4 } from 'crypto';
import { memoryStore, Order, OrderItem, persistStore } from '../config/db';
import { cleanText, isValidPhone } from '../middlewares/security';
import { notifyAdmin, formatNewOrderMessage } from '../services/notifier';

const MAX_ITEMS_PER_ORDER = 20;
const MAX_QTY_PER_LINE = 10;

const digitsOnly = (v: string) => v.replace(/\D/g, '');

/** Compare les 9 derniers chiffres (format local sénégalais) en temps constant */
const phonesMatch = (a: string, b: string) => {
  const x = Buffer.from(digitsOnly(a).slice(-9).padStart(9, '0'));
  const y = Buffer.from(digitsOnly(b).slice(-9).padStart(9, '0'));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

/** Numéro de commande non devinable (ex: JUM-2026-7KQ9X2MD) */
const generateOrderNumber = () => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(8);
  let code = '';
  for (const b of bytes) code += alphabet[b % alphabet.length];
  return `JUM-${new Date().getFullYear()}-${code}`;
};

/** Vue publique d'une commande : uniquement ce dont la cliente a besoin pour le suivi */
const toPublicOrder = (o: Order) => ({
  orderNumber: o.orderNumber,
  status: o.status,
  totalAmount: o.totalAmount,
  shippingCity: o.shippingCity,
  createdAt: o.createdAt,
  items: o.items.map((i) => ({
    id: i.id,
    productName: i.productName,
    variantDetails: i.variantDetails,
    quantity: i.quantity,
    unitPrice: i.unitPrice,
    totalPrice: i.totalPrice,
  })),
});

export const createOrder = async (req: Request, res: Response) => {
  try {
    const body = req.body || {};
    const customerName = cleanText(body.customerName, 100);
    const shippingAddress = cleanText(body.shippingAddress, 300);
    const shippingCity = cleanText(body.shippingCity, 60);
    const items = body.items;

    if (!customerName || customerName.length < 2) {
      return res.status(400).json({ success: false, message: 'Veuillez renseigner votre nom complet.' });
    }
    if (!isValidPhone(body.customerPhone)) {
      return res.status(400).json({ success: false, message: 'Numéro de téléphone invalide (ex: 77 123 45 67).' });
    }
    if (!shippingAddress || !shippingCity) {
      return res.status(400).json({ success: false, message: 'Adresse de livraison incomplète.' });
    }
    if (!Array.isArray(items) || items.length === 0 || items.length > MAX_ITEMS_PER_ORDER) {
      return res.status(400).json({ success: false, message: 'Panier vide ou trop volumineux.' });
    }

    const customerPhone = cleanText(body.customerPhone, 25);
    const customerEmail =
      typeof body.customerEmail === 'string' && /^[^\s@<>]{1,64}@[^\s@<>]{1,190}$/.test(body.customerEmail.trim())
        ? body.customerEmail.trim().toLowerCase()
        : `${digitsOnly(customerPhone)}@client.jumelles.sn`;

    // Phase 1 : validation complète AVANT toute modification de stock (pas de décrément partiel)
    const lines: { variant: any; product: any; qty: number }[] = [];
    const requestedPerVariant = new Map<string, number>();

    for (const item of items) {
      if (!item || typeof item.productVariantId !== 'string' || item.productVariantId.length > 100) {
        return res.status(400).json({ success: false, message: 'Article invalide dans le panier.' });
      }

      let foundVariant: any = null;
      let parentProduct: any = null;
      for (const p of memoryStore.products) {
        if (!p.isActive) continue;
        const v = p.variants.find((variant) => variant.id === item.productVariantId);
        if (v) {
          foundVariant = v;
          parentProduct = p;
          break;
        }
      }

      if (!foundVariant || !parentProduct) {
        return res.status(400).json({ success: false, message: 'Un article de votre panier n\'est plus disponible.' });
      }

      const qty = Number(item.quantity);
      if (!Number.isInteger(qty) || qty <= 0 || qty > MAX_QTY_PER_LINE) {
        return res.status(400).json({
          success: false,
          message: `Quantité invalide pour ${parentProduct.name} (1 à ${MAX_QTY_PER_LINE}).`,
        });
      }

      const cumulative = (requestedPerVariant.get(foundVariant.id) || 0) + qty;
      if (foundVariant.stockQuantity < cumulative) {
        return res.status(400).json({
          success: false,
          message: `Stock insuffisant pour ${parentProduct.name} (${foundVariant.color} / ${foundVariant.sizeOrShoeSize}).`,
        });
      }
      requestedPerVariant.set(foundVariant.id, cumulative);
      lines.push({ variant: foundVariant, product: parentProduct, qty });
    }

    // Phase 2 : création de la commande (prix toujours recalculés côté serveur)
    const orderId = `ord-${uuidv4()}`;
    const orderNumber = generateOrderNumber();
    const orderItems: OrderItem[] = [];
    let calculatedTotal = 0;

    for (const { variant, product, qty } of lines) {
      const unitPrice = product.basePrice + (variant.priceAdjustment || 0);
      const lineTotal = unitPrice * qty;
      calculatedTotal += lineTotal;
      variant.stockQuantity -= qty;

      orderItems.push({
        id: `item-${uuidv4().substring(0, 8)}`,
        orderId,
        productVariantId: variant.id,
        productName: product.name,
        variantDetails: `${variant.color} / ${variant.sizeOrShoeSize}`,
        quantity: qty,
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
    await persistStore();
    void notifyAdmin(formatNewOrderMessage(newOrder));

    res.status(201).json({
      success: true,
      message: 'Commande enregistrée. Confirmation sur WhatsApp.',
      data: toPublicOrder(newOrder),
    });
  } catch (error) {
    console.error('[createOrder]', error);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'enregistrement de la commande.' });
  }
};

/**
 * Suivi de commande pour les clientes : exige le numéro de téléphone utilisé lors de la commande
 * (protection contre la consultation des commandes d'autrui / IDOR).
 */
export const trackOrders = async (req: Request, res: Response) => {
  try {
    const phone = typeof req.query.phone === 'string' ? req.query.phone : '';
    const orderNumber = typeof req.query.orderNumber === 'string' ? req.query.orderNumber.trim().toUpperCase() : '';

    if (!isValidPhone(phone)) {
      return res.status(400).json({ success: false, message: 'Veuillez saisir le numéro de téléphone utilisé lors de la commande.' });
    }
    if (!/^JUM-\d{4}-[A-Z0-9]{4,12}$/.test(orderNumber)) {
      return res.status(400).json({ success: false, message: 'Veuillez saisir un numéro de commande valide (ex: JUM-2026-XXXXXXXX).' });
    }

    const order = memoryStore.orders.find((o) => o.orderNumber === orderNumber && phonesMatch(o.customerPhone, phone));

    // Réponse identique que la commande existe ou non (anti-énumération)
    if (!order) {
      return res.json({ success: true, count: 0, data: [] });
    }

    const phoneOrders = memoryStore.orders.filter((o) => phonesMatch(o.customerPhone, phone));
    res.json({ success: true, count: phoneOrders.length, data: phoneOrders.map(toPublicOrder) });
  } catch (error) {
    console.error('[trackOrders]', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la recherche.' });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  res.json({
    success: true,
    count: memoryStore.orders.length,
    data: memoryStore.orders,
  });
};

/** Remet en stock les articles d'une commande annulée (une seule fois) */
export const restoreOrderStock = (order: Order) => {
  if (order.stockRestored) return;
  for (const item of order.items) {
    for (const p of memoryStore.products) {
      const v = p.variants.find((variant) => variant.id === item.productVariantId);
      if (v) {
        v.stockQuantity += item.quantity;
        break;
      }
    }
  }
  order.stockRestored = true;
};

const ALLOWED_STATUS_TRANSITIONS: Record<Order['status'], Order['status'][]> = {
  PENDING: ['PAID', 'PREPARING', 'SHIPPED', 'CANCELLED'],
  PAID: ['PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
  PREPARING: ['SHIPPED', 'DELIVERED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    const allowed: Order['status'][] = ['PENDING', 'PAID', 'PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (typeof status !== 'string' || !allowed.includes(status as Order['status'])) {
      return res.status(400).json({ success: false, message: 'Statut invalide.' });
    }

    const order = memoryStore.orders.find((o) => o.id === id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Commande introuvable.' });
    }

    const targetStatus = status as Order['status'];
    if (order.status === targetStatus) {
      return res.json({
        success: true,
        message: `Statut inchangé : ${targetStatus}`,
        data: order,
      });
    }

    const validNextStatuses = ALLOWED_STATUS_TRANSITIONS[order.status] || [];
    if (!validNextStatuses.includes(targetStatus)) {
      return res.status(400).json({
        success: false,
        message: `Transition de statut non autorisée (${order.status} -> ${targetStatus}).`,
      });
    }

    // Remise en stock unique lors de l'annulation avant expédition
    if (targetStatus === 'CANCELLED') {
      restoreOrderStock(order);
      order.cancelReason = 'Annulée par la gérance';
    }

    order.status = targetStatus;
    await persistStore();

    res.json({
      success: true,
      message: `Statut de la commande ${order.orderNumber} mis à jour : ${targetStatus}`,
      data: order,
    });
  } catch (error) {
    console.error('[updateOrderStatus]', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour.' });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  const totalOrders = memoryStore.orders.length;

  // Chiffre d'affaires : inclut toutes les commandes réglées / en préparation / expédiées / livrées
  const revenueStatuses: Order['status'][] = ['PAID', 'PREPARING', 'SHIPPED', 'DELIVERED'];
  const totalRevenue = memoryStore.orders
    .filter((o) => revenueStatuses.includes(o.status))
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // Commandes à traiter (en attente de confirmation ou en préparation d'expédition)
  const pendingOrders = memoryStore.orders.filter(
    (o) => o.status === 'PENDING' || o.status === 'PREPARING'
  ).length;
  const totalProducts = memoryStore.products.length;

  // Variantes à stock faible (<= 5 unités, cohérent avec le filtre du tableau de bord)
  const lowStockVariants: any[] = [];
  memoryStore.products.forEach((p) => {
    p.variants.forEach((v) => {
      if (v.stockQuantity <= 5) {
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
};

/**
 * Annule automatiquement les commandes restées « En attente » plus de PENDING_ORDER_TTL_HOURS heures
 * (48 h par défaut ; 0 pour désactiver) et remet leur stock en rayon. Empêche qu'une cliente qui
 * ne confirme jamais, ou de fausses commandes, bloquent le stock indéfiniment.
 */
export const expireStalePendingOrders = async (): Promise<number> => {
  const ttlHours = Number(process.env.PENDING_ORDER_TTL_HOURS ?? 48);
  if (!Number.isFinite(ttlHours) || ttlHours <= 0) return 0;
  const cutoff = Date.now() - ttlHours * 60 * 60 * 1000;

  const expired = memoryStore.orders.filter(
    (o) => o.status === 'PENDING' && new Date(o.createdAt).getTime() < cutoff
  );
  if (expired.length === 0) return 0;

  for (const order of expired) {
    restoreOrderStock(order);
    order.status = 'CANCELLED';
    order.cancelReason = `Annulée automatiquement : non confirmée sous ${ttlHours} h`;
  }
  await persistStore();
  console.info(`[Commandes] ${expired.length} commande(s) non confirmée(s) annulée(s), stock remis en rayon.`);
  void notifyAdmin(
    `⏱️ ${expired.length} commande(s) non confirmée(s) depuis ${ttlHours} h annulée(s) automatiquement, stock remis en rayon :\n` +
      expired.map((o) => `• ${o.orderNumber} — ${o.customerName} (${o.customerPhone})`).join('\n')
  );
  return expired.length;
};
