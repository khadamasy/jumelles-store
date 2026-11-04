import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { memoryStore, Product, ProductVariant, ProductImage, persistStore } from '../config/db';
import { cleanText, isSafeImageUrl } from '../middlewares/security';

const isValidPrice = (n: number) => Number.isFinite(n) && n >= 0 && n <= 10_000_000;
const toStock = (v: unknown, fallback: number) => {
  const n = Number(v);
  return Number.isInteger(n) && n >= 0 && n <= 100_000 ? n : fallback;
};

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
    console.error('[product]', error);
    res.status(500).json({ success: false, message: 'Erreur interne.' });
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
    console.error('[product]', error);
    res.status(500).json({ success: false, message: 'Erreur interne.' });
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
    console.error('[product]', error);
    res.status(500).json({ success: false, message: 'Erreur interne.' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const body = req.body || {};
    const name = cleanText(body.name, 150);
    const description = cleanText(body.description, 2000);
    const categoryId = body.categoryId;
    const basePrice = Number(body.basePrice);
    const variants = Array.isArray(body.variants) ? body.variants.slice(0, 50) : [];
    const images = Array.isArray(body.images) ? body.images.slice(0, 10) : [];

    if (name.length < 2 || !description || !isValidPrice(basePrice)) {
      return res.status(400).json({
        success: false,
        message: 'Champs requis manquants ou invalides (nom, description, prix).',
      });
    }
    if (!memoryStore.categories.some((c) => c.id === categoryId)) {
      return res.status(400).json({ success: false, message: 'Catégorie inconnue.' });
    }
    if (images.some((img: any) => !isSafeImageUrl(img?.minioUrl || img?.url))) {
      return res.status(400).json({ success: false, message: 'URL d\'image non autorisée.' });
    }

    const productId = `prod-${uuidv4().substring(0, 8)}`;
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
      .slice(0, 80);

    const newVariants: ProductVariant[] = variants.map((v: any, index: number) => ({
      id: `var-${uuidv4().substring(0, 8)}`,
      productId,
      sizeOrShoeSize: cleanText(v?.sizeOrShoeSize, 30) || 'Standard',
      color: cleanText(v?.color, 50) || 'Unique',
      sku: cleanText(v?.sku, 80) || `SKU-${slug.toUpperCase()}-${index + 1}`,
      stockQuantity: toStock(v?.stockQuantity, 10),
      priceAdjustment: isValidPrice(Number(v?.priceAdjustment)) ? Number(v.priceAdjustment) : 0,
    }));

    const newImages: ProductImage[] = images.map((img: any, index: number) => ({
      id: `img-${uuidv4().substring(0, 8)}`,
      productId,
      minioUrl: img.minioUrl || img.url,
      altText: cleanText(img.altText, 150) || name,
      isPrimary: index === 0,
    }));

    const originalPrice = Number(body.originalPrice);

    const newProduct: Product = {
      id: productId,
      categoryId,
      name,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      description,
      basePrice,
      ...(isValidPrice(originalPrice) && originalPrice > basePrice ? { originalPrice } : {}),
      isActive: true,
      isFeatured: !!body.isFeatured,
      variants: newVariants,
      images: newImages,
    };

    memoryStore.products.unshift(newProduct);
    await persistStore();

    res.status(201).json({
      success: true,
      message: 'Article ajouté avec succès à la boutique Jumelles Store.',
      data: newProduct,
    });
  } catch (error: any) {
    console.error('[createProduct]', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la création de l\'article.' });
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
    const body = req.body || {};
    const updated: Product = { ...existing };

    // Liste blanche stricte des champs modifiables (anti mass-assignment)
    if (body.name !== undefined) {
      const name = cleanText(body.name, 150);
      if (name.length < 2) return res.status(400).json({ success: false, message: 'Nom invalide.' });
      updated.name = name;
    }
    if (body.description !== undefined) {
      updated.description = cleanText(body.description, 2000);
    }
    if (body.categoryId !== undefined) {
      if (!memoryStore.categories.some((c) => c.id === body.categoryId)) {
        return res.status(400).json({ success: false, message: 'Catégorie inconnue.' });
      }
      updated.categoryId = body.categoryId;
    }
    if (body.basePrice !== undefined) {
      const price = Number(body.basePrice);
      if (!isValidPrice(price)) return res.status(400).json({ success: false, message: 'Prix invalide.' });
      updated.basePrice = price;
    }
    if (body.originalPrice !== undefined) {
      if (body.originalPrice === null || body.originalPrice === '') {
        delete updated.originalPrice;
      } else {
        const op = Number(body.originalPrice);
        if (!isValidPrice(op)) return res.status(400).json({ success: false, message: 'Prix barré invalide.' });
        updated.originalPrice = op;
      }
    }
    if (body.isFeatured !== undefined) updated.isFeatured = !!body.isFeatured;
    if (body.isActive !== undefined) updated.isActive = !!body.isActive;
    if (body.images !== undefined) {
      if (!Array.isArray(body.images) || body.images.length > 10) {
        return res.status(400).json({ success: false, message: 'Images invalides.' });
      }
      const images: ProductImage[] = [];
      for (const [i, img] of body.images.entries()) {
        const url = img?.minioUrl || img?.url;
        if (!isSafeImageUrl(url)) return res.status(400).json({ success: false, message: 'URL d\'image non autorisée.' });
        images.push({
          id: `img-${uuidv4().substring(0, 8)}`,
          productId: existing.id,
          minioUrl: url,
          altText: cleanText(img?.altText, 150) || updated.name,
          isPrimary: i === 0,
        });
      }
      updated.images = images;
    }

    memoryStore.products[index] = updated;
    await persistStore();

    res.json({
      success: true,
      message: 'Produit mis à jour avec succès.',
      data: updated,
    });
  } catch (error: any) {
    console.error('[product]', error);
    res.status(500).json({ success: false, message: 'Erreur interne.' });
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
      const add = Number(quantityToAdd);
      if (!Number.isInteger(add) || add < 1 || add > 10_000) {
        return res.status(400).json({ success: false, message: 'Quantité à ajouter invalide (1 à 10 000).' });
      }
      variant.stockQuantity = Math.min(100_000, variant.stockQuantity + add);
    } else if (newStockQuantity !== undefined) {
      const n = Number(newStockQuantity);
      if (!Number.isInteger(n) || n < 0 || n > 100_000) {
        return res.status(400).json({ success: false, message: 'Stock invalide.' });
      }
      variant.stockQuantity = n;
    }

    await persistStore();

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
    console.error('[product]', error);
    res.status(500).json({ success: false, message: 'Erreur interne.' });
  }
};

/**
 * Ajouter une nouvelle variante (ex: nouvelle pointure ou couleur) à un produit existant
 */
export const addVariantToProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { sizeOrShoeSize, color, stockQuantity, priceAdjustment } = req.body || {};

    const product = memoryStore.products.find((p) => p.id === productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produit introuvable.' });
    }
    if (product.variants.length >= 100) {
      return res.status(400).json({ success: false, message: 'Nombre maximal de variantes atteint.' });
    }

    const size = cleanText(sizeOrShoeSize, 30) || 'Standard';
    const newVariant: ProductVariant = {
      id: `var-${uuidv4().substring(0, 8)}`,
      productId,
      sizeOrShoeSize: size,
      color: cleanText(color, 50) || 'Noir',
      sku: `SKU-${product.slug.toUpperCase()}-${size.replace(/[^A-Za-z0-9]/g, '')}-${Date.now().toString().slice(-4)}`,
      stockQuantity: toStock(stockQuantity, 10),
      priceAdjustment: isValidPrice(Number(priceAdjustment)) ? Number(priceAdjustment) : 0,
    };

    product.variants.push(newVariant);
    await persistStore();

    res.status(201).json({
      success: true,
      message: 'Nouvelle variante ajoutée au produit.',
      data: newVariant,
    });
  } catch (error: any) {
    console.error('[product]', error);
    res.status(500).json({ success: false, message: 'Erreur interne.' });
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
    await persistStore();
    res.json({ success: true, message: 'Article supprimé du catalogue.' });
  } catch (error: any) {
    console.error('[product]', error);
    res.status(500).json({ success: false, message: 'Erreur interne.' });
  }
};

