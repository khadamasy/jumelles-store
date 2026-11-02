import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://jumelles_admin:jumelles_secure_password_2026@localhost:5432/jumelles_db?schema=public',
});

// Mock in-memory data store for testing and when PostgreSQL is offline
export interface Category {
  id: string;
  name: string;
  slug: string;
  type: 'SAC' | 'CHAUSSURE';
  description: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sizeOrShoeSize: string; // Ex: '37', '38', '39' ou 'Unique'
  color: string;
  sku: string;
  stockQuantity: number;
  priceAdjustment: number;
}

export interface ProductImage {
  id: string;
  productId: string;
  minioUrl: string;
  altText: string;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  isActive: boolean;
  isFeatured: boolean;
  variants: ProductVariant[];
  images: ProductImage[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productVariantId: string;
  productName: string;
  variantDetails: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  items: OrderItem[];
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  provider: 'WAVE' | 'ORANGE_MONEY';
  transactionReference: string;
  operatorTransactionId?: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'REFUNDED';
  paymentUrl: string;
  createdAt: string;
}

// Jeu de données initial complet pour Jumelles Store
export const memoryStore = {
  categories: [
    {
      id: 'cat-sac-1',
      name: 'Sacs à Main & Cabas',
      slug: 'sacs-a-main',
      type: 'SAC' as const,
      description: 'Sacs à main en cuir de luxe, élégants et polyvalents pour le quotidien et les grandes occasions.'
    },
    {
      id: 'cat-sac-2',
      name: 'Pochettes & Bandoulières',
      slug: 'pochettes-bandoulieres',
      type: 'SAC' as const,
      description: 'Pochettes de soirée scintillantes et sacs bandoulière compacts et raffinés.'
    },
    {
      id: 'cat-shoe-1',
      name: 'Escarpins & Talons Hauts',
      slug: 'escarpins-talons',
      type: 'CHAUSSURE' as const,
      description: 'Escarpins glamour, talons aiguilles et carrés pour sublimer votre démarche.'
    },
    {
      id: 'cat-shoe-2',
      name: 'Sandales & Mules d\'Été',
      slug: 'sandales-mules',
      type: 'CHAUSSURE' as const,
      description: 'Sandales légères dorées, argentées et mules chics au confort exceptionnel.'
    },
    {
      id: 'cat-shoe-3',
      name: 'Baskets & Sneakers Chic',
      slug: 'sneakers-femme',
      type: 'CHAUSSURE' as const,
      description: 'Sneakers tendances blanches et métallisées alliant streetwear et élégance.'
    }
  ] as Category[],

  products: [
    {
      id: 'prod-sac-1',
      categoryId: 'cat-sac-1',
      name: 'Sac Cabas Royal Croco « Jumelles Élégance »',
      slug: 'sac-cabas-royal-croco',
      description: 'Confectionné dans un cuir grainé effet crocodile premium. Spacieux, finitions dorées luxueuses et bandoulière amovible.',
      basePrice: 45000,
      isActive: true,
      isFeatured: true,
      variants: [
        { id: 'var-1', productId: 'prod-sac-1', sizeOrShoeSize: 'Taille Standard', color: 'Noir Onyx', sku: 'SAC-CROCO-BLK', stockQuantity: 12, priceAdjustment: 0 },
        { id: 'var-2', productId: 'prod-sac-1', sizeOrShoeSize: 'Taille Standard', color: 'Marron Havane', sku: 'SAC-CROCO-BRN', stockQuantity: 8, priceAdjustment: 0 },
        { id: 'var-3', productId: 'prod-sac-1', sizeOrShoeSize: 'Taille Standard', color: 'Bordeaux Impérial', sku: 'SAC-CROCO-BUR', stockQuantity: 5, priceAdjustment: 2000 }
      ],
      images: [
        { id: 'img-1', productId: 'prod-sac-1', minioUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80', altText: 'Sac cabas croco noir Jumelles Store', isPrimary: true },
        { id: 'img-2', productId: 'prod-sac-1', minioUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80', altText: 'Détail finitions dorées sac Jumelles', isPrimary: false }
      ]
    },
    {
      id: 'prod-sac-2',
      categoryId: 'cat-sac-2',
      name: 'Pochette de Soirée « Diamant Doré »',
      slug: 'pochette-soiree-diamant-dore',
      description: 'L\'accessoire idéal pour vos mariages, galas et soirées de fête. Fermoir bijou et chaînette dorée.',
      basePrice: 28000,
      isActive: true,
      isFeatured: true,
      variants: [
        { id: 'var-4', productId: 'prod-sac-2', sizeOrShoeSize: 'Format Soirée', color: 'Or Scintillant', sku: 'POCH-GLD-01', stockQuantity: 15, priceAdjustment: 0 },
        { id: 'var-5', productId: 'prod-sac-2', sizeOrShoeSize: 'Format Soirée', color: 'Argent Miroir', sku: 'POCH-SLV-02', stockQuantity: 9, priceAdjustment: 0 }
      ],
      images: [
        { id: 'img-3', productId: 'prod-sac-2', minioUrl: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80', altText: 'Pochette dorée étincelante', isPrimary: true }
      ]
    },
    {
      id: 'prod-shoe-1',
      categoryId: 'cat-shoe-1',
      name: 'Escarpins Stiletto « Reine de Saba »',
      slug: 'escarpins-stiletto-reine-de-saba',
      description: 'Escarpins vertigineux talon 10 cm, cambrure parfaite et semelle rembourrée grand confort.',
      basePrice: 38000,
      isActive: true,
      isFeatured: true,
      variants: [
        { id: 'var-6', productId: 'prod-shoe-1', sizeOrShoeSize: '37', color: 'Noir Verni', sku: 'STIL-BLK-37', stockQuantity: 4, priceAdjustment: 0 },
        { id: 'var-7', productId: 'prod-shoe-1', sizeOrShoeSize: '38', color: 'Noir Verni', sku: 'STIL-BLK-38', stockQuantity: 6, priceAdjustment: 0 },
        { id: 'var-8', productId: 'prod-shoe-1', sizeOrShoeSize: '39', color: 'Noir Verni', sku: 'STIL-BLK-39', stockQuantity: 5, priceAdjustment: 0 },
        { id: 'var-9', productId: 'prod-shoe-1', sizeOrShoeSize: '40', color: 'Noir Verni', sku: 'STIL-BLK-40', stockQuantity: 3, priceAdjustment: 0 },
        { id: 'var-10', productId: 'prod-shoe-1', sizeOrShoeSize: '38', color: 'Rouge Passion', sku: 'STIL-RED-38', stockQuantity: 4, priceAdjustment: 1500 },
        { id: 'var-11', productId: 'prod-shoe-1', sizeOrShoeSize: '39', color: 'Rouge Passion', sku: 'STIL-RED-39', stockQuantity: 2, priceAdjustment: 1500 }
      ],
      images: [
        { id: 'img-4', productId: 'prod-shoe-1', minioUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80', altText: 'Escarpins stiletto noir verni', isPrimary: true }
      ]
    },
    {
      id: 'prod-shoe-2',
      categoryId: 'cat-shoe-2',
      name: 'Sandales Bijou Nu-Pieds « Cléopâtre »',
      slug: 'sandales-bijou-cleopatre',
      description: 'Sandales plates artisanales avec ornementation dorée, lanières en cuir souple épousant la cheville.',
      basePrice: 22000,
      isActive: true,
      isFeatured: false,
      variants: [
        { id: 'var-12', productId: 'prod-shoe-2', sizeOrShoeSize: '41', color: 'Doré Antique', sku: 'SAND-GLD-41', stockQuantity: 4, priceAdjustment: 0 },
        { id: 'var-13', productId: 'prod-shoe-2', sizeOrShoeSize: '37', color: 'Doré Antique', sku: 'SAND-GLD-37', stockQuantity: 8, priceAdjustment: 0 },
        { id: 'var-14', productId: 'prod-shoe-2', sizeOrShoeSize: '38', color: 'Doré Antique', sku: 'SAND-GLD-38', stockQuantity: 10, priceAdjustment: 0 },
        { id: 'var-15', productId: 'prod-shoe-2', sizeOrShoeSize: '39', color: 'Doré Antique', sku: 'SAND-GLD-39', stockQuantity: 7, priceAdjustment: 0 },
        { id: 'var-16', productId: 'prod-shoe-2', sizeOrShoeSize: '40', color: 'Doré Antique', sku: 'SAND-GLD-40', stockQuantity: 3, priceAdjustment: 0 },
        { id: 'var-16b', productId: 'prod-shoe-2', sizeOrShoeSize: '42', color: 'Doré Antique', sku: 'SAND-GLD-42', stockQuantity: 5, priceAdjustment: 0 }
      ],
      images: [
        { id: 'img-5', productId: 'prod-shoe-2', minioUrl: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80', altText: 'Sandales dorées Jumelles Store', isPrimary: true }
      ]
    },
    {
      id: 'prod-shoe-3',
      categoryId: 'cat-shoe-3',
      name: 'Baskets Urbaines Chic « Urban Glow »',
      slug: 'baskets-urban-glow',
      description: 'Sneakers modernes blanches avec empiècements métallisés or rose, semelle plateforme ultra légère.',
      basePrice: 32000,
      isActive: true,
      isFeatured: true,
      variants: [
        { id: 'var-17', productId: 'prod-shoe-3', sizeOrShoeSize: '37', color: 'Blanc & Or Rose', sku: 'SNEAK-WHT-37', stockQuantity: 5, priceAdjustment: 0 },
        { id: 'var-18', productId: 'prod-shoe-3', sizeOrShoeSize: '38', color: 'Blanc & Or Rose', sku: 'SNEAK-WHT-38', stockQuantity: 7, priceAdjustment: 0 },
        { id: 'var-19', productId: 'prod-shoe-3', sizeOrShoeSize: '39', color: 'Blanc & Or Rose', sku: 'SNEAK-WHT-39', stockQuantity: 6, priceAdjustment: 0 },
        { id: 'var-20', productId: 'prod-shoe-3', sizeOrShoeSize: '41', color: 'Blanc & Or Rose', sku: 'SNEAK-WHT-41', stockQuantity: 2, priceAdjustment: 0 }
      ],
      images: [
        { id: 'img-6', productId: 'prod-shoe-3', minioUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80', altText: 'Baskets tendances blanches Jumelles', isPrimary: true }
      ]
    }
  ] as Product[],

  orders: [
    {
      id: 'ord-1001',
      orderNumber: 'JUM-2026-0001',
      customerName: 'Fatou Ndiaye',
      customerEmail: 'fatou.ndiaye@example.com',
      customerPhone: '+221 77 123 45 67',
      shippingAddress: 'Almadies, Villa 42 en face pharmacie',
      shippingCity: 'Dakar',
      totalAmount: 45000,
      status: 'PAID',
      items: [
        {
          id: 'item-1',
          orderId: 'ord-1001',
          productVariantId: 'var-1',
          productName: 'Sac Cabas Royal Croco « Jumelles Élégance »',
          variantDetails: 'Noir Onyx / Taille Standard',
          quantity: 1,
          unitPrice: 45000,
          totalPrice: 45000
        }
      ],
      createdAt: new Date().toISOString()
    }
  ] as Order[],

  transactions: [
    {
      id: 'txn-1',
      orderId: 'ord-1001',
      provider: 'WAVE',
      transactionReference: 'WAVE-REF-JUM-9841',
      operatorTransactionId: 'WV_TXN_88492048',
      amount: 45000,
      currency: 'XOF',
      status: 'SUCCESSFUL',
      paymentUrl: 'https://pay.wave.com/c/mock-jumelles-001',
      createdAt: new Date().toISOString()
    }
  ] as PaymentTransaction[]
};

