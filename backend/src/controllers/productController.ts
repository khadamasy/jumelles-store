import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { memoryStore, Product, ProductVariant, ProductImage } from '../config/db';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, type, shoeSize, color, search, featured, minPrice, maxPrice } = req.query;

    let products = [...memoryStore.products].filter((p) => p.isActive);

    // Filtre par Univers / Type (SAC ou CHAUSSURE)
    if (type) {
      const allowedCategories = memoryStore.categories
        .filter((c) => c.type === (type as string).toUpperCase())
        .map((c) => c.id);
      products = products.filter((p) => allowedCategories.includes(p.categoryId));
    }

    // Filtre par catégorie (slug ou id)
    if (category) {
      const foundCategory = memoryStore.categories.find(
        (c) => c.slug === category || c.id === category
      );
      if (foundCategory) {
        products = products.filter((p) => p.categoryId === foundCategory.id);
      }
    }

    // Filtre par Pointure de chaussure (ex: 37, 38)
    if (shoeSize) {
      products = products.filter((p) =>
        p.variants.some((v) => v.sizeOrShoeSize === shoeSize && v.stockQuantity > 0)
      );
    }

    // Filtre par Couleur
    if (color) {
      const colorQuery = (color as string).toLowerCase();
      products = products.filter((p) =>
        p.variants.some((v) => v.color.toLowerCase().includes(colorQuery))
      );
    }

    // Filtre par mot clé de recherche
    if (search) {
      const query = (search as string).toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Filtre Produits mis en avant
    if (featured === 'true') {
      products = products.filter((p) => p.isFeatured);
    }

    // Filtre par fourchette de prix
    if (minPrice) {
      const min = parseFloat(minPrice as string);
      products = products.filter((p) => p.basePrice >= min);
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice as string);
      products = products.filter((p) => p.basePrice <= max);
    }

    res.json({
      success: true,
      total: products.length,
      data: products,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductByIdOrSlug = async (req: Request, res: Response) => {
  try {
    const { idOrSlug } = req.params;
    const product = memoryStore.products.find(
      (p) => p.id === idOrSlug || p.slug === idOrSlug
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Produit introuvable.' });
    }

    // Ajout des informations de la catégorie parente
    const category = memoryStore.categories.find((c) => c.id === product.categoryId);

    res.json({
      success: true,
      data: {
        ...product,
        category,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAvailableShoeSizes = async (req: Request, res: Response) => {
  try {
    const shoeCategories = memoryStore.categories
      .filter((c) => c.type === 'CHAUSSURE')
      .map((c) => c.id);

    const shoeProducts = memoryStore.products.filter((p) =>
      shoeCategories.includes(p.categoryId)
    );

    const sizesSet = new Set<string>();
    shoeProducts.forEach((p) => {
      p.variants.forEach((v) => {
        if (/^\d+$/.test(v.sizeOrShoeSize)) {
          sizesSet.add(v.sizeOrShoeSize);
        }
      });
    });

    const sortedSizes = Array.from(sizesSet).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

    res.json({
      success: true,
      data: sortedSizes,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, categoryId, description, basePrice, isFeatured, variants, images } = req.body;

    if (!name || !categoryId || !description || basePrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Champs requis manquants (name, categoryId, description, basePrice).',
      });
    }

    const productId = `prod-${uuidv4().substring(0, 8)}`;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newVariants: ProductVariant[] = (variants || []).map((v: any, index: number) => ({
      id: `var-${uuidv4().substring(0, 8)}`,
      productId,
      sizeOrShoeSize: v.sizeOrShoeSize || 'Standard',
      color: v.color || 'Unique',
      sku: v.sku || `SKU-${slug.toUpperCase()}-${index + 1}`,
      stockQuantity: v.stockQuantity !== undefined ? parseInt(v.stockQuantity, 10) : 10,
      priceAdjustment: v.priceAdjustment ? parseFloat(v.priceAdjustment) : 0,
    }));

    const newImages: ProductImage[] = (images || []).map((img: any, index: number) => ({
      id: `img-${uuidv4().substring(0, 8)}`,
      productId,
      minioUrl: img.minioUrl || img.url,
      altText: img.altText || name,
      isPrimary: index === 0,
    }));

    const newProduct: Product = {
      id: productId,
      categoryId,
      name,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      description,
      basePrice: parseFloat(basePrice),
      isActive: true,
      isFeatured: !!isFeatured,
      variants: newVariants,
      images: newImages,
    };

    memoryStore.products.unshift(newProduct);

    res.status(201).json({
      success: true,
      message: 'Article ajouté avec succès à la boutique Jumelles Store.',
      data: newProduct,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const index = memoryStore.products.findIndex((p) => p.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Produit introuvable.' });
    }

    const existing = memoryStore.products[index];
    const updated: Product = {
      ...existing,
      ...req.body,
      variants: req.body.variants ? req.body.variants : existing.variants,
      images: req.body.images ? req.body.images : existing.images,
    };

    memoryStore.products[index] = updated;

    res.json({
      success: true,
      message: 'Produit mis à jour avec succès.',
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Renouveler / Réapprovisionner le stock d'une variante
 */
export const replenishStock = async (req: Request, res: Response) => {
  try {
    const { productId, variantId, quantityToAdd, newStockQuantity } = req.body;

    if (!productId || !variantId) {
      return res.status(400).json({
        success: false,
        message: 'productId et variantId sont requis.',
      });
    }

    const product = memoryStore.products.find((p) => p.id === productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produit introuvable.' });
    }

    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant) {
      return res.status(404).json({ success: false, message: 'Variante introuvable.' });
    }

    if (quantityToAdd !== undefined) {
      variant.stockQuantity += parseInt(quantityToAdd, 10);
    } else if (newStockQuantity !== undefined) {
      variant.stockQuantity = Math.max(0, parseInt(newStockQuantity, 10));
    }

    res.json({
      success: true,
      message: `Stock renouvelé avec succès pour ${product.name} (${variant.color} / ${variant.sizeOrShoeSize}). Nouveau stock : ${variant.stockQuantity}`,
      data: {
        productId: product.id,
        variantId: variant.id,
        variantName: `${variant.color} / ${variant.sizeOrShoeSize}`,
        newStockQuantity: variant.stockQuantity,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Ajouter une nouvelle variante (ex: nouvelle pointure ou couleur) à un produit existant
 */
export const addVariantToProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { sizeOrShoeSize, color, stockQuantity, priceAdjustment } = req.body;

    const product = memoryStore.products.find((p) => p.id === productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produit introuvable.' });
    }

    const newVariant: ProductVariant = {
      id: `var-${uuidv4().substring(0, 8)}`,
      productId,
      sizeOrShoeSize: sizeOrShoeSize || 'Standard',
      color: color || 'Noir',
      sku: `SKU-${product.slug.toUpperCase()}-${sizeOrShoeSize || 'STD'}-${Date.now().toString().slice(-4)}`,
      stockQuantity: stockQuantity !== undefined ? parseInt(stockQuantity, 10) : 10,
      priceAdjustment: priceAdjustment ? parseFloat(priceAdjustment) : 0,
    };

    product.variants.push(newVariant);

    res.status(201).json({
      success: true,
      message: 'Nouvelle variante ajoutée au produit.',
      data: newVariant,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const index = memoryStore.products.findIndex((p) => p.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Produit introuvable.' });
    }

    memoryStore.products.splice(index, 1);
    res.json({ success: true, message: 'Article supprimé du catalogue.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

