import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool(
  process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL } : {}
);

// Sans ce gestionnaire, une connexion inactive coupée (redémarrage ou panne de PostgreSQL)
// émet un événement 'error' non géré qui arrête tout le serveur Node.js.
pool.on('error', (err) => {
  console.error(`[PostgreSQL] Connexion perdue : ${err.message}`);
});

/** PostgreSQL n'est utilisé que si DATABASE_URL est défini */
let pgEnabled = Boolean(process.env.DATABASE_URL);
const DATA_DIR = path.resolve(__dirname, '../../data');
const SNAPSHOT_FILE = path.join(DATA_DIR, 'store.json');
/**
 * Marqueur « PostgreSQL en retard » : présent tant que des écritures du snapshot disque
 * n'ont pas encore été recopiées dans PostgreSQL (panne, redémarrage...).
 * Au démarrage, s'il existe, le snapshot disque est la source la plus récente.
 */
const PG_PENDING_FILE = path.join(DATA_DIR, 'pg-pending');
const PG_RETRY_INTERVAL_MS = 30_000;
const INIT_SQL_FILE = path.resolve(__dirname, '../../prisma/init.sql');

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
  sizeOrShoeSize: string; // '37', '38', '39', '40', '41', '42' ou 'Standard'
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
  originalPrice?: number; // Prix avant réduction (barré pour affichage promotion)
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
  /** Stock déjà remis en rayon après annulation (évite une double remise) */
  stockRestored?: boolean;
  /** Motif d'annulation (ex: annulation automatique faute de confirmation) */
  cancelReason?: string;
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

export interface PhoneCallbackRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  productInterest?: string;
  notes?: string;
  status: 'PENDING' | 'CALLED';
  createdAt: string;
}

// Données réelles Jumelles Store basées sur vos articles
export const memoryStore = {
  categories: [
    {
      id: 'cat-sac-1',
      name: 'Sacs à Main & Cabas',
      slug: 'sacs-a-main',
      type: 'SAC' as const,
      description: 'Sacs à main en cuir de luxe, sacs Birkin et cabas monogrammes pour sublimer vos tenues.'
    },
    {
      id: 'cat-sac-2',
      name: 'Pochettes & Sacs Matelassés',
      slug: 'pochettes-matelassees',
      type: 'SAC' as const,
      description: 'Sacs à rabat matelassé avec chaînes dorées et pochettes de soirée étincelantes.'
    },
    {
      id: 'cat-shoe-1',
      name: 'Mules & Escarpins à Talons',
      slug: 'mules-escarpins',
      type: 'CHAUSSURE' as const,
      description: 'Mules stiletto bijou à talons aiguilles et talons bobines confortables (pointures 37 à 42).'
    },
    {
      id: 'cat-shoe-2',
      name: 'Sandales Plates & Tongs de Luxe',
      slug: 'sandales-plates',
      type: 'CHAUSSURE' as const,
      description: 'Nu-pieds en cuir verni croisé et tongs bijou à médaillon doré (pointures 37 à 42).'
    }
  ] as Category[],

  products: [
    // 1. SAC BIRKIN PRESTIGE
    {
      id: 'prod-sac-1',
      categoryId: 'cat-sac-1',
      name: 'Sac à Main Prestige Cuir Epsom & Cadenas Métallique',
      slug: 'sac-prestige-cuir-epsom-cadenas',
      description: 'Confectionné en cuir Epsom texturé avec piqures sellier blanches et serrure métallique à cadenas tournant argenté. Format élégant porté main, finitions de haute maroquinerie.',
      basePrice: 15000,
      isActive: true,
      isFeatured: true,
      variants: [
        { id: 'var-birk-1', productId: 'prod-sac-1', sizeOrShoeSize: 'Format Médium (30cm)', color: 'Camel Caramel', sku: 'BIRK-CAMEL-30', stockQuantity: 8, priceAdjustment: 0 },
        { id: 'var-birk-2', productId: 'prod-sac-1', sizeOrShoeSize: 'Format Médium (30cm)', color: 'Chocolat Ébène', sku: 'BIRK-CHOC-30', stockQuantity: 6, priceAdjustment: 0 },
        { id: 'var-birk-3', productId: 'prod-sac-1', sizeOrShoeSize: 'Format Médium (30cm)', color: 'Orange H', sku: 'BIRK-ORANGE-30', stockQuantity: 5, priceAdjustment: 0 },
        { id: 'var-birk-4', productId: 'prod-sac-1', sizeOrShoeSize: 'Format Médium (30cm)', color: 'Rose Poudré', sku: 'BIRK-ROSE-30', stockQuantity: 7, priceAdjustment: 0 }
      ],
      images: [
        { id: 'img-birk-1', productId: 'prod-sac-1', minioUrl: '/products/sac-birkin-camel.jpg', altText: 'Sac prestige camel Jumelles Store', isPrimary: true },
        { id: 'img-birk-2', productId: 'prod-sac-1', minioUrl: '/products/sac-birkin-rose-poudre.jpg', altText: 'Sac prestige rose poudré', isPrimary: false },
        { id: 'img-birk-3', productId: 'prod-sac-1', minioUrl: '/products/sac-birkin-chocolat.jpg', altText: 'Sac prestige chocolat', isPrimary: false },
        { id: 'img-birk-4', productId: 'prod-sac-1', minioUrl: '/products/sac-birkin-orange.jpg', altText: 'Sac prestige orange', isPrimary: false }
      ]
    },

    // 2. SAC MATELASSÉ RABAT CHAÎNE
    {
      id: 'prod-sac-2',
      categoryId: 'cat-sac-2',
      name: 'Sac Matelassé Rabat « Iconique Jumelles » Chaîne Dorée',
      slug: 'sac-matelasse-rabat-iconique-chaine',
      description: 'L\'incontournable sac à rabat matelassé en losanges avec fermoir pivotant et bandoulière chaîne dorée entrelacée de cuir. Disponible dans une palette de coloris somptueux.',
      basePrice: 15000,
      isActive: true,
      isFeatured: true,
      variants: [
        { id: 'var-mat-1', productId: 'prod-sac-2', sizeOrShoeSize: 'Format Classique', color: 'Noir Onyx', sku: 'MAT-BLK-01', stockQuantity: 12, priceAdjustment: 0 },
        { id: 'var-mat-2', productId: 'prod-sac-2', sizeOrShoeSize: 'Format Classique', color: 'Doré Métallisé', sku: 'MAT-GLD-02', stockQuantity: 9, priceAdjustment: 0 },
        { id: 'var-mat-3', productId: 'prod-sac-2', sizeOrShoeSize: 'Format Classique', color: 'Argent Miroir', sku: 'MAT-SLV-03', stockQuantity: 6, priceAdjustment: 0 },
        { id: 'var-mat-4', productId: 'prod-sac-2', sizeOrShoeSize: 'Format Classique', color: 'Blanc Pur', sku: 'MAT-WHT-04', stockQuantity: 8, priceAdjustment: 0 },
        { id: 'var-mat-5', productId: 'prod-sac-2', sizeOrShoeSize: 'Format Classique', color: 'Bordeaux Cerise', sku: 'MAT-BUR-05', stockQuantity: 7, priceAdjustment: 0 },
        { id: 'var-mat-6', productId: 'prod-sac-2', sizeOrShoeSize: 'Format Classique', color: 'Camel Havane', sku: 'MAT-CAM-06', stockQuantity: 10, priceAdjustment: 0 }
      ],
      images: [
        { id: 'img-mat-1', productId: 'prod-sac-2', minioUrl: '/products/sac-matelasse-chaine-collection.jpg', altText: 'Collection sacs matelassés rabat chaîne', isPrimary: true }
      ]
    },

    // 3. SAC CABAS CUIR PERFORÉ
    {
      id: 'prod-sac-3',
      categoryId: 'cat-sac-1',
      name: 'Sac Cabas Cuir Perforé Losanges & Chaîne Gourmette (34x27)',
      slug: 'sac-cabas-cuir-perfore-chaine-gourmette',
      description: 'Grand sac seau/cabas en cuir souple finement perforé façon dentelle de cuir. Chaîne dorée d\'épaule, cordon de serrage avec médaillon siglé. Dimensions spacieuses : 34 x 27 cm.',
      basePrice: 15000,
      isActive: true,
      isFeatured: true,
      variants: [
        { id: 'var-perf-1', productId: 'prod-sac-3', sizeOrShoeSize: '34 x 27 cm', color: 'Bordeaux Royal', sku: 'PERF-BUR-34', stockQuantity: 8, priceAdjustment: 0 },
        { id: 'var-perf-2', productId: 'prod-sac-3', sizeOrShoeSize: '34 x 27 cm', color: 'Rose Pastel', sku: 'PERF-PNK-34', stockQuantity: 6, priceAdjustment: 0 }
      ],
      images: [
        { id: 'img-perf-1', productId: 'prod-sac-3', minioUrl: '/products/sac-perfore-chaine-bordeaux-fauteuil.jpg', altText: 'Sac perforé chaîne bordeaux', isPrimary: true },
        { id: 'img-perf-2', productId: 'prod-sac-3', minioUrl: '/products/sac-perfore-chaine-rose.jpg', altText: 'Sac perforé rose poudré', isPrimary: false },
        { id: 'img-perf-3', productId: 'prod-sac-3', minioUrl: '/products/sac-perfore-chaine-bordeaux-face.jpg', altText: 'Détail médaillon chaîne dorée', isPrimary: false }
      ]
    },

    // 4. SAC CABAS MONOGRAMME DE LUXE
    {
      id: 'prod-sac-4',
      categoryId: 'cat-sac-1',
      name: 'Sac Cabas Monogramme Prestige & Bandoulière Cuir',
      slug: 'sac-cabas-monogramme-prestige-bandouliere',
      description: 'Toile enduite monogrammée ultra-robuste avec garnitures en cuir naturel surpiqué, double anse rigide et bandoulière amovible. L\'incontournable de la garde-robe d\'affaires et de cérémonie.',
      basePrice: 15000,
      isActive: true,
      isFeatured: false,
      variants: [
        { id: 'var-mono-1', productId: 'prod-sac-4', sizeOrShoeSize: 'Grand Format Cabas', color: 'Monogramme Havane', sku: 'MONO-CAB-01', stockQuantity: 7, priceAdjustment: 0 },
        { id: 'var-mono-2', productId: 'prod-sac-4', sizeOrShoeSize: 'Format Dôme Alma BB', color: 'Damier Ébène', sku: 'DAM-ALMA-02', stockQuantity: 5, priceAdjustment: 0 }
      ],
      images: [
        { id: 'img-mono-1', productId: 'prod-sac-4', minioUrl: '/products/sac-cabas-monogramme-luxe.jpg', altText: 'Sac cabas monogramme luxe', isPrimary: true },
        { id: 'img-mono-2', productId: 'prod-sac-4', minioUrl: '/products/sac-cabas-monogramme-portemodele.jpg', altText: 'Sac cabas porté épaule', isPrimary: false },
        { id: 'img-mono-3', productId: 'prod-sac-4', minioUrl: '/products/sac-alma-damier-ebene.jpg', altText: 'Sac dôme damier ébène', isPrimary: false },
        { id: 'img-mono-4', productId: 'prod-sac-4', minioUrl: '/products/sac-alma-damier-ebene-portemodele.jpg', altText: 'Sac dôme damier ébène porté mannequin', isPrimary: false },
        { id: 'img-mono-5', productId: 'prod-sac-4', minioUrl: '/products/sac-alma-damier-ebene-lifestyle.jpg', altText: 'Sac dôme damier ébène style chic', isPrimary: false }
      ]
    },

    // 5. MULES TALONS AIGUILLES COEUR STRASS (Chaussures)
    {
      id: 'prod-shoe-1',
      categoryId: 'cat-shoe-1',
      name: 'Mules Stiletto à Brides & Cœur Diamant Strass',
      slug: 'mules-stiletto-brides-coeur-diamant-strass',
      description: 'Mules vertigineuses à talon évasé 9 cm grand confort, bout carré contemporain et fines brides tubulaires sublimées par un cœur bijou étincelant en cristaux strass.',
      basePrice: 12000,
      isActive: true,
      isFeatured: true,
      variants: [
        { id: 'var-str-37', productId: 'prod-shoe-1', sizeOrShoeSize: '37', color: 'Noir Profond', sku: 'STR-BLK-37', stockQuantity: 5, priceAdjustment: 0 },
        { id: 'var-str-38', productId: 'prod-shoe-1', sizeOrShoeSize: '38', color: 'Noir Profond', sku: 'STR-BLK-38', stockQuantity: 7, priceAdjustment: 0 },
        { id: 'var-str-39', productId: 'prod-shoe-1', sizeOrShoeSize: '39', color: 'Noir Profond', sku: 'STR-BLK-39', stockQuantity: 6, priceAdjustment: 0 },
        { id: 'var-str-40', productId: 'prod-shoe-1', sizeOrShoeSize: '40', color: 'Noir Profond', sku: 'STR-BLK-40', stockQuantity: 4, priceAdjustment: 0 },
        { id: 'var-str-41', productId: 'prod-shoe-1', sizeOrShoeSize: '41', color: 'Noir Profond', sku: 'STR-BLK-41', stockQuantity: 4, priceAdjustment: 0 },
        { id: 'var-str-42', productId: 'prod-shoe-1', sizeOrShoeSize: '42', color: 'Noir Profond', sku: 'STR-BLK-42', stockQuantity: 3, priceAdjustment: 0 },
        { id: 'var-str-slv-37', productId: 'prod-shoe-1', sizeOrShoeSize: '37', color: 'Argent Miroir', sku: 'STR-SLV-37', stockQuantity: 4, priceAdjustment: 0 },
        { id: 'var-str-slv-38', productId: 'prod-shoe-1', sizeOrShoeSize: '38', color: 'Argent Miroir', sku: 'STR-SLV-38', stockQuantity: 6, priceAdjustment: 0 },
        { id: 'var-str-slv-39', productId: 'prod-shoe-1', sizeOrShoeSize: '39', color: 'Argent Miroir', sku: 'STR-SLV-39', stockQuantity: 5, priceAdjustment: 0 },
        { id: 'var-str-slv-40', productId: 'prod-shoe-1', sizeOrShoeSize: '40', color: 'Argent Miroir', sku: 'STR-SLV-40', stockQuantity: 3, priceAdjustment: 0 },
        { id: 'var-str-slv-41', productId: 'prod-shoe-1', sizeOrShoeSize: '41', color: 'Argent Miroir', sku: 'STR-SLV-41', stockQuantity: 3, priceAdjustment: 0 },
        { id: 'var-str-slv-42', productId: 'prod-shoe-1', sizeOrShoeSize: '42', color: 'Argent Miroir', sku: 'STR-SLV-42', stockQuantity: 2, priceAdjustment: 0 }
      ],
      images: [
        { id: 'img-str-1', productId: 'prod-shoe-1', minioUrl: '/products/mules-talon-coeur-noir.jpg', altText: 'Mules talon coeur strass noir', isPrimary: true },
        { id: 'img-str-2', productId: 'prod-shoe-1', minioUrl: '/products/mules-talon-coeur-argent.jpg', altText: 'Mules talon coeur argent', isPrimary: false }
      ]
    },

    // 6. MULES TALON BOBINE 290-1
    {
      id: 'prod-shoe-2',
      categoryId: 'cat-shoe-1',
      name: 'Mules à Petit Talon Bobine Confort « Modèle 290-1 »',
      slug: 'mules-talon-bobine-confort-290-1',
      description: 'Mules élégantes à bout ouvert avec talon bobine 6 cm ultra-stable. Semelle intérieure rembourrée avec coussinet confort pour marcher toute la journée en toute sérénité.',
      basePrice: 12000,
      isActive: true,
      isFeatured: true,
      variants: [
        { id: 'var-m290-37', productId: 'prod-shoe-2', sizeOrShoeSize: '37', color: 'Noir Verni', sku: 'M290-BLK-37', stockQuantity: 6, priceAdjustment: 0 },
        { id: 'var-m290-38', productId: 'prod-shoe-2', sizeOrShoeSize: '38', color: 'Noir Verni', sku: 'M290-BLK-38', stockQuantity: 8, priceAdjustment: 0 },
        { id: 'var-m290-39', productId: 'prod-shoe-2', sizeOrShoeSize: '39', color: 'Noir Verni', sku: 'M290-BLK-39', stockQuantity: 7, priceAdjustment: 0 },
        { id: 'var-m290-40', productId: 'prod-shoe-2', sizeOrShoeSize: '40', color: 'Noir Verni', sku: 'M290-BLK-40', stockQuantity: 5, priceAdjustment: 0 },
        { id: 'var-m290-41', productId: 'prod-shoe-2', sizeOrShoeSize: '41', color: 'Noir Verni', sku: 'M290-BLK-41', stockQuantity: 4, priceAdjustment: 0 },
        { id: 'var-m290-42', productId: 'prod-shoe-2', sizeOrShoeSize: '42', color: 'Noir Verni', sku: 'M290-BLK-42', stockQuantity: 3, priceAdjustment: 0 },
        { id: 'var-m290-wn-38', productId: 'prod-shoe-2', sizeOrShoeSize: '38', color: 'Wine (Bordeaux)', sku: 'M290-WIN-38', stockQuantity: 5, priceAdjustment: 0 },
        { id: 'var-m290-wn-39', productId: 'prod-shoe-2', sizeOrShoeSize: '39', color: 'Wine (Bordeaux)', sku: 'M290-WIN-39', stockQuantity: 6, priceAdjustment: 0 },
        { id: 'var-m290-cf-38', productId: 'prod-shoe-2', sizeOrShoeSize: '38', color: 'Coffee (Marron)', sku: 'M290-COF-38', stockQuantity: 6, priceAdjustment: 0 },
        { id: 'var-m290-gd-38', productId: 'prod-shoe-2', sizeOrShoeSize: '38', color: 'Doré Lumineux', sku: 'M290-GLD-38', stockQuantity: 5, priceAdjustment: 0 }
      ],
      images: [
        { id: 'img-m290-1', productId: 'prod-shoe-2', minioUrl: '/products/mules-talon-290-collection.jpg', altText: 'Collection mules talon confort 290-1', isPrimary: true }
      ]
    },

    // 7. SANDALES PLATES CUIR VERNI CROISÉ
    {
      id: 'prod-shoe-3',
      categoryId: 'cat-shoe-2',
      name: 'Sandales Plates Nu-Pieds en Cuir Verni Croisé',
      slug: 'sandales-plates-cuir-verni-croise',
      description: 'Sandales estivales plates confectionnées en cuir verni premium avec empiècements à brides croisées sur le cou-de-pied. Semelle avec surpiqûre dorée et boîte griffée.',
      basePrice: 12000,
      isActive: true,
      isFeatured: false,
      variants: [
        { id: 'var-pl-37', productId: 'prod-shoe-3', sizeOrShoeSize: '37', color: 'Bordeaux Verni', sku: 'PLAT-BUR-37', stockQuantity: 7, priceAdjustment: 0 },
        { id: 'var-pl-38', productId: 'prod-shoe-3', sizeOrShoeSize: '38', color: 'Bordeaux Verni', sku: 'PLAT-BUR-38', stockQuantity: 10, priceAdjustment: 0 },
        { id: 'var-pl-39', productId: 'prod-shoe-3', sizeOrShoeSize: '39', color: 'Bordeaux Verni', sku: 'PLAT-BUR-39', stockQuantity: 8, priceAdjustment: 0 },
        { id: 'var-pl-40', productId: 'prod-shoe-3', sizeOrShoeSize: '40', color: 'Bordeaux Verni', sku: 'PLAT-BUR-40', stockQuantity: 6, priceAdjustment: 0 },
        { id: 'var-pl-41', productId: 'prod-shoe-3', sizeOrShoeSize: '41', color: 'Bordeaux Verni', sku: 'PLAT-BUR-41', stockQuantity: 5, priceAdjustment: 0 },
        { id: 'var-pl-42', productId: 'prod-shoe-3', sizeOrShoeSize: '42', color: 'Bordeaux Verni', sku: 'PLAT-BUR-42', stockQuantity: 4, priceAdjustment: 0 },
        { id: 'var-pl-cog-38', productId: 'prod-shoe-3', sizeOrShoeSize: '38', color: 'Cognac / Camel', sku: 'PLAT-COG-38', stockQuantity: 9, priceAdjustment: 0 },
        { id: 'var-pl-cog-39', productId: 'prod-shoe-3', sizeOrShoeSize: '39', color: 'Cognac / Camel', sku: 'PLAT-COG-39', stockQuantity: 7, priceAdjustment: 0 },
        { id: 'var-pl-wht-38', productId: 'prod-shoe-3', sizeOrShoeSize: '38', color: 'Blanc Épuré', sku: 'PLAT-WHT-38', stockQuantity: 8, priceAdjustment: 0 },
        { id: 'var-pl-blk-38', productId: 'prod-shoe-3', sizeOrShoeSize: '38', color: 'Noir Intense', sku: 'PLAT-BLK-38', stockQuantity: 8, priceAdjustment: 0 }
      ],
      images: [
        { id: 'img-pl-zara', productId: 'prod-shoe-3', minioUrl: '/products/sandales-plates-verni-zara-collection.jpg', altText: 'Collection sandales plates cuir verni croisé avec boîtes', isPrimary: true },
        { id: 'img-pl-1', productId: 'prod-shoe-3', minioUrl: '/products/sandales-plates-croisees-collection.jpg', altText: 'Sandales plates croisées collection', isPrimary: false },
        { id: 'img-pl-2', productId: 'prod-shoe-3', minioUrl: '/products/sandales-plates-bordeaux-detail.jpg', altText: 'Détail sandales bordeaux', isPrimary: false }
      ]
    },

    // 8. TONGS CHICS EN CUIR & MÉDAILLON LOGO DORÉ
    {
      id: 'prod-shoe-4',
      categoryId: 'cat-shoe-2',
      name: 'Tongs Chics en Cuir & Médaillon Logo Doré',
      slug: 'tongs-chics-cuir-medaillon-logo-dore',
      description: 'L\'élégance décontractée à son zénith. Entredoigt en cuir véritable souple orné d\'un médaillon bijou doré poli. Semelle gravée, livrée dans son coffret luxe avec ruban de soie.',
      basePrice: 12000,
      isActive: true,
      isFeatured: true,
      variants: [
        { id: 'var-tng-37', productId: 'prod-shoe-4', sizeOrShoeSize: '37', color: 'Doré Miroir', sku: 'TNG-GLD-37', stockQuantity: 6, priceAdjustment: 0 },
        { id: 'var-tng-38', productId: 'prod-shoe-4', sizeOrShoeSize: '38', color: 'Doré Miroir', sku: 'TNG-GLD-38', stockQuantity: 9, priceAdjustment: 0 },
        { id: 'var-tng-39', productId: 'prod-shoe-4', sizeOrShoeSize: '39', color: 'Doré Miroir', sku: 'TNG-GLD-39', stockQuantity: 8, priceAdjustment: 0 },
        { id: 'var-tng-40', productId: 'prod-shoe-4', sizeOrShoeSize: '40', color: 'Doré Miroir', sku: 'TNG-GLD-40', stockQuantity: 5, priceAdjustment: 0 },
        { id: 'var-tng-41', productId: 'prod-shoe-4', sizeOrShoeSize: '41', color: 'Doré Miroir', sku: 'TNG-GLD-41', stockQuantity: 4, priceAdjustment: 0 },
        { id: 'var-tng-42', productId: 'prod-shoe-4', sizeOrShoeSize: '42', color: 'Doré Miroir', sku: 'TNG-GLD-42', stockQuantity: 3, priceAdjustment: 0 },
        { id: 'var-tng-blk-38', productId: 'prod-shoe-4', sizeOrShoeSize: '38', color: 'Noir Intense', sku: 'TNG-BLK-38', stockQuantity: 8, priceAdjustment: 0 },
        { id: 'var-tng-bur-38', productId: 'prod-shoe-4', sizeOrShoeSize: '38', color: 'Bordeaux Framboise', sku: 'TNG-BUR-38', stockQuantity: 7, priceAdjustment: 0 }
      ],
      images: [
        { id: 'img-tng-1', productId: 'prod-shoe-4', minioUrl: '/products/tongs-cuir-bijou-dore.jpg', altText: 'Tongs cuir doré bijou', isPrimary: true },
        { id: 'img-tng-2', productId: 'prod-shoe-4', minioUrl: '/products/tongs-cuir-bijou-noir.jpg', altText: 'Tongs cuir noir boîte luxe', isPrimary: false },
        { id: 'img-tng-3', productId: 'prod-shoe-4', minioUrl: '/products/tongs-cuir-bijou-bordeaux.jpg', altText: 'Tongs cuir bordeaux', isPrimary: false },
        { id: 'img-tng-4', productId: 'prod-shoe-4', minioUrl: '/products/claquettes-noeud-bijou-collection.jpg', altText: 'Claquettes noeud bijou', isPrimary: false }
      ]
    },

    // 9. SAC BOWLER « PRESTIGE WEB & DOUBLE G »
    {
      id: 'prod-sac-5',
      categoryId: 'cat-sac-1',
      name: 'Sac Bowler « Prestige Web & Double G »',
      slug: 'sac-bowler-prestige-web-double-g',
      description: 'Sublime sac Boston / Bowler à double anse rigide et bandoulière en cuir amovible. Finitions exclusives avec bande web bicolore rouge et verte, médaillon double G doré et fermeture zippée double curseur.',
      basePrice: 15000,
      isActive: true,
      isFeatured: true,
      variants: [
        { id: 'var-bwl-1', productId: 'prod-sac-5', sizeOrShoeSize: 'Format Médium (28cm)', color: 'Monogramme Suprême GG', sku: 'BWL-MONO-28', stockQuantity: 9, priceAdjustment: 0 },
        { id: 'var-bwl-2', productId: 'prod-sac-5', sizeOrShoeSize: 'Format Médium (28cm)', color: 'Cuir Noir Embossé GG', sku: 'BWL-BLK-28', stockQuantity: 7, priceAdjustment: 0 }
      ],
      images: [
        { id: 'img-bwl-1', productId: 'prod-sac-5', minioUrl: '/products/sac-bowler-monogramme-bande-web.jpg', altText: 'Sac bowler monogramme bande web avec boîte luxe', isPrimary: true },
        { id: 'img-bwl-2', productId: 'prod-sac-5', minioUrl: '/products/sac-bowler-bande-web-noir.jpg', altText: 'Sac bowler cuir noir embossé bande web', isPrimary: false }
      ]
    },

    // 10. GRAND CABAS TRAPÈZE CUIR GRAINÉ & POCHETTE
    {
      id: 'prod-sac-6',
      categoryId: 'cat-sac-1',
      name: 'Grand Cabas Trapèze Cuir Grainé & Pochette Zippée',
      slug: 'grand-cabas-trapeze-cuir-graine-pochette',
      description: 'Cabas trapèze sculptural inspiré de la haute maroquinerie parisienne. Confectionné en cuir de veau pleine fleur grainé, double anse épaule et pochette intérieure amovible coordonnée avec mousqueton.',
      basePrice: 15000,
      isActive: true,
      isFeatured: true,
      variants: [
        { id: 'var-cbt-1', productId: 'prod-sac-6', sizeOrShoeSize: 'Grand Format Cabas', color: 'Terracotta / Brique', sku: 'CBT-TERRA-01', stockQuantity: 8, priceAdjustment: 0 },
        { id: 'var-cbt-2', productId: 'prod-sac-6', sizeOrShoeSize: 'Grand Format Cabas', color: 'Bordeaux Impérial', sku: 'CBT-BUR-02', stockQuantity: 6, priceAdjustment: 0 },
        { id: 'var-cbt-3', productId: 'prod-sac-6', sizeOrShoeSize: 'Grand Format Cabas', color: 'Camel Caramel', sku: 'CBT-CAM-03', stockQuantity: 9, priceAdjustment: 0 },
        { id: 'var-cbt-4', productId: 'prod-sac-6', sizeOrShoeSize: 'Grand Format Cabas', color: 'Taupe Éléphant', sku: 'CBT-TAU-04', stockQuantity: 7, priceAdjustment: 0 },
        { id: 'var-cbt-5', productId: 'prod-sac-6', sizeOrShoeSize: 'Grand Format Cabas', color: 'Noir Onyx', sku: 'CBT-BLK-05', stockQuantity: 10, priceAdjustment: 0 }
      ],
      images: [
        { id: 'img-cbt-1', productId: 'prod-sac-6', minioUrl: '/products/sac-cabas-cuir-graine-terracotta.jpg', altText: 'Grand cabas trapèze cuir grainé terracotta', isPrimary: true },
        { id: 'img-cbt-2', productId: 'prod-sac-6', minioUrl: '/products/sac-cabas-cuir-graine-camel.jpg', altText: 'Grand cabas trapèze cuir camel caramel', isPrimary: false },
        { id: 'img-cbt-3', productId: 'prod-sac-6', minioUrl: '/products/sac-cabas-cuir-graine-taupe.jpg', altText: 'Grand cabas trapèze cuir taupe éléphant', isPrimary: false },
        { id: 'img-cbt-4', productId: 'prod-sac-6', minioUrl: '/products/sac-cabas-cuir-graine-noir.jpg', altText: 'Grand cabas trapèze cuir noir onyx', isPrimary: false },
        { id: 'img-cbt-5', productId: 'prod-sac-6', minioUrl: '/products/sac-cabas-cuir-graine-bordeaux.jpg', altText: 'Grand cabas trapèze cuir bordeaux', isPrimary: false }
      ]
    },

    // 11. MINI SAC RABAT CHEVRON « HAUTE COUTURE » POIGNÉE RIGIDE
    {
      id: 'prod-sac-7',
      categoryId: 'cat-sac-2',
      name: 'Mini Sac Rabat Chevron « Haute Couture » Poignée Rigide',
      slug: 'mini-sac-rabat-chevron-haute-couture-poignee-rigide',
      description: 'L\'élégance miniature par excellence. Cuir d\'agneau matelassé en chevrons avec poignée rigide supérieure, fermoir tourniquet bijou doré et bandoulière chaîne entrelacée. Livré dans son coffret avec certificat.',
      basePrice: 15000,
      isActive: true,
      isFeatured: true,
      variants: [
        { id: 'var-chv-1', productId: 'prod-sac-7', sizeOrShoeSize: 'Format Mini (20cm)', color: 'Noir Onyx', sku: 'CHV-BLK-20', stockQuantity: 8, priceAdjustment: 0 },
        { id: 'var-chv-2', productId: 'prod-sac-7', sizeOrShoeSize: 'Format Mini (20cm)', color: 'Bordeaux Cerise', sku: 'CHV-BUR-20', stockQuantity: 7, priceAdjustment: 0 },
        { id: 'var-chv-3', productId: 'prod-sac-7', sizeOrShoeSize: 'Format Mini (20cm)', color: 'Blanc Albâtre', sku: 'CHV-WHT-20', stockQuantity: 8, priceAdjustment: 0 },
        { id: 'var-chv-4', productId: 'prod-sac-7', sizeOrShoeSize: 'Format Mini (20cm)', color: 'Rose Poudré', sku: 'CHV-PNK-20', stockQuantity: 6, priceAdjustment: 0 },
        { id: 'var-chv-5', productId: 'prod-sac-7', sizeOrShoeSize: 'Format Mini (20cm)', color: 'Bleu Pastel Ciel', sku: 'CHV-BLU-20', stockQuantity: 5, priceAdjustment: 0 },
        { id: 'var-chv-6', productId: 'prod-sac-7', sizeOrShoeSize: 'Format Mini (20cm)', color: 'Doré Métallisé', sku: 'CHV-GLD-20', stockQuantity: 6, priceAdjustment: 0 },
        { id: 'var-chv-7', productId: 'prod-sac-7', sizeOrShoeSize: 'Format Mini (20cm)', color: 'Argent Miroir', sku: 'CHV-SLV-20', stockQuantity: 5, priceAdjustment: 0 }
      ],
      images: [
        { id: 'img-chv-1', productId: 'prod-sac-7', minioUrl: '/products/sac-mini-chevron-poignee-collection.jpg', altText: 'Collection mini sacs rabat chevron poignée rigide', isPrimary: true }
      ]
    },

    // 12. BESACE TRAPÈZE BI-MATIÈRE CUIR SUÉDÉ & GRAINÉ
    {
      id: 'prod-sac-8',
      categoryId: 'cat-sac-1',
      name: 'Besace Trapèze Bi-Matière Cuir Suédé & Grainé',
      slug: 'besace-trapeze-bi-matiere-cuir-suede-graine',
      description: 'Allure chic décontractée et ultra moderne. Rabat asymétrique en velours de daim suédé doux au toucher associé à un cuir grainé texturé, poignée supérieure sellier et bandoulière réglable.',
      basePrice: 15000,
      isActive: true,
      isFeatured: false,
      variants: [
        { id: 'var-bsc-1', productId: 'prod-sac-8', sizeOrShoeSize: 'Format Standard (26cm)', color: 'Chocolat Profond', sku: 'BSC-CHOC-26', stockQuantity: 8, priceAdjustment: 0 },
        { id: 'var-bsc-2', productId: 'prod-sac-8', sizeOrShoeSize: 'Format Standard (26cm)', color: 'Cognac Caramel', sku: 'BSC-COG-26', stockQuantity: 7, priceAdjustment: 0 }
      ],
      images: [
        { id: 'img-bsc-1', productId: 'prod-sac-8', minioUrl: '/products/sac-besace-daim-suede-cognac-chocolat.jpg', altText: 'Besace trapèze cuir suédé et cuir grainé chocolat et cognac', isPrimary: true }
      ]
    },

    // 13. MULES NU-PIEDS H JACQUARD & SEMELLE CUIR COFFRET PRESTIGE
    {
      id: 'prod-shoe-5',
      categoryId: 'cat-shoe-2',
      name: 'Mules Nu-Pieds H Jacquard Brodé & Semelle Cuir Coffret',
      slug: 'mules-nu-pieds-h-jacquard-brode-coffret',
      description: 'Mules plates d\'exception en découpe H signature habillées d\'un velours jacquard brodé de motifs floraux ton sur ton. Semelle cousue en cuir naturel, livrées dans leur coffret orange de luxe avec pochons et certificat. Déclinées en 5 coloris irrésistibles : Bordeaux, Rose Poudré, Blanc Craie, Bronze Caramel et Noir Ébène.',
      basePrice: 12000,
      isActive: true,
      isFeatured: true,
      variants: [
        // Bordeaux
        { id: 'var-oran-bur-37', productId: 'prod-shoe-5', sizeOrShoeSize: '37', color: 'Bordeaux Jacquard', sku: 'ORAN-BUR-37', stockQuantity: 6, priceAdjustment: 0 },
        { id: 'var-oran-bur-38', productId: 'prod-shoe-5', sizeOrShoeSize: '38', color: 'Bordeaux Jacquard', sku: 'ORAN-BUR-38', stockQuantity: 8, priceAdjustment: 0 },
        { id: 'var-oran-bur-39', productId: 'prod-shoe-5', sizeOrShoeSize: '39', color: 'Bordeaux Jacquard', sku: 'ORAN-BUR-39', stockQuantity: 7, priceAdjustment: 0 },
        { id: 'var-oran-bur-40', productId: 'prod-shoe-5', sizeOrShoeSize: '40', color: 'Bordeaux Jacquard', sku: 'ORAN-BUR-40', stockQuantity: 5, priceAdjustment: 0 },
        { id: 'var-oran-bur-41', productId: 'prod-shoe-5', sizeOrShoeSize: '41', color: 'Bordeaux Jacquard', sku: 'ORAN-BUR-41', stockQuantity: 4, priceAdjustment: 0 },
        { id: 'var-oran-bur-42', productId: 'prod-shoe-5', sizeOrShoeSize: '42', color: 'Bordeaux Jacquard', sku: 'ORAN-BUR-42', stockQuantity: 3, priceAdjustment: 0 },
        // Rose Poudré
        { id: 'var-oran-pnk-37', productId: 'prod-shoe-5', sizeOrShoeSize: '37', color: 'Rose Poudré Jacquard', sku: 'ORAN-PNK-37', stockQuantity: 5, priceAdjustment: 0 },
        { id: 'var-oran-pnk-38', productId: 'prod-shoe-5', sizeOrShoeSize: '38', color: 'Rose Poudré Jacquard', sku: 'ORAN-PNK-38', stockQuantity: 8, priceAdjustment: 0 },
        { id: 'var-oran-pnk-39', productId: 'prod-shoe-5', sizeOrShoeSize: '39', color: 'Rose Poudré Jacquard', sku: 'ORAN-PNK-39', stockQuantity: 6, priceAdjustment: 0 },
        { id: 'var-oran-pnk-40', productId: 'prod-shoe-5', sizeOrShoeSize: '40', color: 'Rose Poudré Jacquard', sku: 'ORAN-PNK-40', stockQuantity: 4, priceAdjustment: 0 },
        { id: 'var-oran-pnk-41', productId: 'prod-shoe-5', sizeOrShoeSize: '41', color: 'Rose Poudré Jacquard', sku: 'ORAN-PNK-41', stockQuantity: 4, priceAdjustment: 0 },
        { id: 'var-oran-pnk-42', productId: 'prod-shoe-5', sizeOrShoeSize: '42', color: 'Rose Poudré Jacquard', sku: 'ORAN-PNK-42', stockQuantity: 3, priceAdjustment: 0 },
        // Blanc Craie
        { id: 'var-oran-wht-37', productId: 'prod-shoe-5', sizeOrShoeSize: '37', color: 'Blanc Craie Jacquard', sku: 'ORAN-WHT-37', stockQuantity: 6, priceAdjustment: 0 },
        { id: 'var-oran-wht-38', productId: 'prod-shoe-5', sizeOrShoeSize: '38', color: 'Blanc Craie Jacquard', sku: 'ORAN-WHT-38', stockQuantity: 9, priceAdjustment: 0 },
        { id: 'var-oran-wht-39', productId: 'prod-shoe-5', sizeOrShoeSize: '39', color: 'Blanc Craie Jacquard', sku: 'ORAN-WHT-39', stockQuantity: 7, priceAdjustment: 0 },
        { id: 'var-oran-wht-40', productId: 'prod-shoe-5', sizeOrShoeSize: '40', color: 'Blanc Craie Jacquard', sku: 'ORAN-WHT-40', stockQuantity: 5, priceAdjustment: 0 },
        { id: 'var-oran-wht-41', productId: 'prod-shoe-5', sizeOrShoeSize: '41', color: 'Blanc Craie Jacquard', sku: 'ORAN-WHT-41', stockQuantity: 4, priceAdjustment: 0 },
        { id: 'var-oran-wht-42', productId: 'prod-shoe-5', sizeOrShoeSize: '42', color: 'Blanc Craie Jacquard', sku: 'ORAN-WHT-42', stockQuantity: 3, priceAdjustment: 0 },
        // Bronze Caramel
        { id: 'var-oran-brz-37', productId: 'prod-shoe-5', sizeOrShoeSize: '37', color: 'Bronze Caramel Jacquard', sku: 'ORAN-BRZ-37', stockQuantity: 5, priceAdjustment: 0 },
        { id: 'var-oran-brz-38', productId: 'prod-shoe-5', sizeOrShoeSize: '38', color: 'Bronze Caramel Jacquard', sku: 'ORAN-BRZ-38', stockQuantity: 8, priceAdjustment: 0 },
        { id: 'var-oran-brz-39', productId: 'prod-shoe-5', sizeOrShoeSize: '39', color: 'Bronze Caramel Jacquard', sku: 'ORAN-BRZ-39', stockQuantity: 6, priceAdjustment: 0 },
        { id: 'var-oran-brz-40', productId: 'prod-shoe-5', sizeOrShoeSize: '40', color: 'Bronze Caramel Jacquard', sku: 'ORAN-BRZ-40', stockQuantity: 5, priceAdjustment: 0 },
        { id: 'var-oran-brz-41', productId: 'prod-shoe-5', sizeOrShoeSize: '41', color: 'Bronze Caramel Jacquard', sku: 'ORAN-BRZ-41', stockQuantity: 3, priceAdjustment: 0 },
        { id: 'var-oran-brz-42', productId: 'prod-shoe-5', sizeOrShoeSize: '42', color: 'Bronze Caramel Jacquard', sku: 'ORAN-BRZ-42', stockQuantity: 3, priceAdjustment: 0 },
        // Noir Ébène
        { id: 'var-oran-blk-37', productId: 'prod-shoe-5', sizeOrShoeSize: '37', color: 'Noir Ébène Jacquard', sku: 'ORAN-BLK-37', stockQuantity: 6, priceAdjustment: 0 },
        { id: 'var-oran-blk-38', productId: 'prod-shoe-5', sizeOrShoeSize: '38', color: 'Noir Ébène Jacquard', sku: 'ORAN-BLK-38', stockQuantity: 9, priceAdjustment: 0 },
        { id: 'var-oran-blk-39', productId: 'prod-shoe-5', sizeOrShoeSize: '39', color: 'Noir Ébène Jacquard', sku: 'ORAN-BLK-39', stockQuantity: 7, priceAdjustment: 0 },
        { id: 'var-oran-blk-40', productId: 'prod-shoe-5', sizeOrShoeSize: '40', color: 'Noir Ébène Jacquard', sku: 'ORAN-BLK-40', stockQuantity: 5, priceAdjustment: 0 },
        { id: 'var-oran-blk-41', productId: 'prod-shoe-5', sizeOrShoeSize: '41', color: 'Noir Ébène Jacquard', sku: 'ORAN-BLK-41', stockQuantity: 4, priceAdjustment: 0 },
        { id: 'var-oran-blk-42', productId: 'prod-shoe-5', sizeOrShoeSize: '42', color: 'Noir Ébène Jacquard', sku: 'ORAN-BLK-42', stockQuantity: 3, priceAdjustment: 0 }
      ],
      images: [
        { id: 'img-oran-1', productId: 'prod-shoe-5', minioUrl: '/products/mules-h-jacquard-bordeaux-coffret.jpg', altText: 'Mules H jacquard bordeaux dans leur boîte prestige', isPrimary: true },
        { id: 'img-oran-2', productId: 'prod-shoe-5', minioUrl: '/products/mules-h-jacquard-rose-coffret.jpg', altText: 'Mules H jacquard rose poudré dans leur boîte prestige', isPrimary: false },
        { id: 'img-oran-3', productId: 'prod-shoe-5', minioUrl: '/products/mules-h-jacquard-blanc-coffret.jpg', altText: 'Mules H jacquard blanc craie dans leur boîte prestige', isPrimary: false },
        { id: 'img-oran-4', productId: 'prod-shoe-5', minioUrl: '/products/mules-h-jacquard-bronze-coffret.jpg', altText: 'Mules H jacquard bronze caramel dans leur boîte prestige', isPrimary: false },
        { id: 'img-oran-5', productId: 'prod-shoe-5', minioUrl: '/products/mules-h-jacquard-noir-coffret.jpg', altText: 'Mules H jacquard noir ébène dans leur boîte prestige', isPrimary: false }
      ]
    }
  ] as Product[],

  orders: [] as Order[],

  transactions: [] as PaymentTransaction[],

  phoneCallbacks: [] as PhoneCallbackRequest[],
};

/** Sauvegarde atomique sur disque local (secours si PostgreSQL n'est pas démarré) */
const saveSnapshotToDisk = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const payload = JSON.stringify(
      {
        categories: memoryStore.categories,
        products: memoryStore.products,
        orders: memoryStore.orders,
        phoneCallbacks: memoryStore.phoneCallbacks,
      },
      null,
      2
    );
    const tmp = `${SNAPSHOT_FILE}.tmp`;
    fs.writeFileSync(tmp, payload, 'utf8');
    fs.renameSync(tmp, SNAPSHOT_FILE);
  } catch (err: any) {
    console.warn(`[Persistance Disque] Impossible d'écrire ${SNAPSHOT_FILE} : ${err.message}`);
  }
};

/** Charge l'état depuis PostgreSQL vers memoryStore */
const loadFromPostgres = async (): Promise<boolean> => {
  if (!pool) return false;
  const client = await pool.connect();
  try {
    if (fs.existsSync(INIT_SQL_FILE)) {
      const ddl = fs.readFileSync(INIT_SQL_FILE, 'utf8');
      await client.query(ddl);
    }

    const { rows: catRows } = await client.query('SELECT * FROM categories ORDER BY created_at ASC');
    const { rows: prodRows } = await client.query('SELECT * FROM products ORDER BY created_at DESC');

    if (catRows.length === 0 && prodRows.length === 0) {
      return false; // Base vide : on va y injecter les données initiales
    }

    const { rows: varRows } = await client.query('SELECT * FROM product_variants ORDER BY created_at ASC');
    const { rows: imgRows } = await client.query('SELECT * FROM product_images ORDER BY display_order ASC');
    const { rows: ordRows } = await client.query('SELECT * FROM orders ORDER BY created_at DESC');
    const { rows: itemRows } = await client.query('SELECT * FROM order_items');
    const { rows: callRows } = await client.query('SELECT * FROM phone_callbacks ORDER BY created_at DESC');

    memoryStore.categories = catRows.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      type: c.type,
      description: c.description || '',
    }));

    memoryStore.products = prodRows.map((p) => ({
      id: p.id,
      categoryId: p.category_id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      basePrice: Number(p.base_price),
      ...(p.original_price !== null && p.original_price !== undefined
        ? { originalPrice: Number(p.original_price) }
        : {}),
      isActive: Boolean(p.is_active),
      isFeatured: Boolean(p.is_featured),
      variants: varRows
        .filter((v) => v.product_id === p.id)
        .map((v) => ({
          id: v.id,
          productId: v.product_id,
          sizeOrShoeSize: v.size_or_shoe_size,
          color: v.color,
          sku: v.sku,
          stockQuantity: Number(v.stock_quantity),
          priceAdjustment: Number(v.price_adjustment || 0),
        })),
      images: imgRows
        .filter((img) => img.product_id === p.id)
        .map((img) => ({
          id: img.id,
          productId: img.product_id,
          minioUrl: img.minio_url,
          altText: img.alt_text || p.name,
          isPrimary: Boolean(img.is_primary),
        })),
    }));

    memoryStore.orders = ordRows.map((o) => ({
      id: o.id,
      orderNumber: o.order_number,
      customerName: o.customer_name,
      customerEmail: o.customer_email,
      customerPhone: o.customer_phone,
      shippingAddress: o.shipping_address,
      shippingCity: o.shipping_city,
      totalAmount: Number(o.total_amount),
      status: o.status,
      stockRestored: Boolean(o.stock_restored),
      ...(o.cancel_reason ? { cancelReason: o.cancel_reason } : {}),
      createdAt: o.created_at instanceof Date ? o.created_at.toISOString() : String(o.created_at),
      items: itemRows
        .filter((i) => i.order_id === o.id)
        .map((i) => ({
          id: i.id,
          orderId: i.order_id,
          productVariantId: i.product_variant_id || '',
          productName: i.product_name,
          variantDetails: i.variant_details,
          quantity: Number(i.quantity),
          unitPrice: Number(i.unit_price),
          totalPrice: Number(i.total_price),
        })),
    }));

    memoryStore.phoneCallbacks = callRows.map((c) => ({
      id: c.id,
      customerName: c.customer_name,
      customerPhone: c.customer_phone,
      productInterest: c.product_interest || '',
      notes: c.notes || '',
      status: c.status,
      createdAt: c.created_at instanceof Date ? c.created_at.toISOString() : String(c.created_at),
    }));

    return true;
  } finally {
    client.release();
  }
};

/** Synchronise l'état courant vers PostgreSQL dans une transaction atomique */
const syncToPostgres = async (): Promise<boolean> => {
  if (!pgEnabled) return false;
  let client: any = null;
  try {
    if (typeof pool.connect === 'function') {
      client = await pool.connect();
    }
    const runner = client && typeof client.query === 'function' ? client : pool;
    if (typeof runner.query !== 'function') return false;

    await runner.query('BEGIN');

    for (const c of memoryStore.categories) {
      await runner.query(
        `INSERT INTO categories (id, name, slug, type, description)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, type = EXCLUDED.type, description = EXCLUDED.description`,
        [c.id, c.name, c.slug, c.type, c.description]
      );
    }

    // Supprimer les produits retirés du catalogue
    const productIds = memoryStore.products.map((p) => p.id);
    if (productIds.length > 0) {
      await runner.query('DELETE FROM products WHERE NOT (id = ANY($1::varchar[]))', [productIds]);
    } else {
      await runner.query('DELETE FROM products');
    }

    for (const p of memoryStore.products) {
      await runner.query(
        `INSERT INTO products (id, category_id, name, slug, description, base_price, original_price, is_active, is_featured, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
         ON CONFLICT (id) DO UPDATE SET
           category_id = EXCLUDED.category_id,
           name = EXCLUDED.name,
           slug = EXCLUDED.slug,
           description = EXCLUDED.description,
           base_price = EXCLUDED.base_price,
           original_price = EXCLUDED.original_price,
           is_active = EXCLUDED.is_active,
           is_featured = EXCLUDED.is_featured,
           updated_at = CURRENT_TIMESTAMP`,
        [
          p.id,
          p.categoryId,
          p.name,
          p.slug,
          p.description,
          p.basePrice,
          p.originalPrice ?? null,
          p.isActive,
          p.isFeatured,
        ]
      );

      for (const v of p.variants) {
        // Verrouillage de ligne sur le stock avant mise à jour (anti-survente concurrente)
        await runner.query('SELECT id, stock_quantity FROM product_variants WHERE id = $1 FOR UPDATE', [v.id]);
        await runner.query(
          `INSERT INTO product_variants (id, product_id, size_or_shoe_size, color, sku, stock_quantity, price_adjustment)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO UPDATE SET
             size_or_shoe_size = EXCLUDED.size_or_shoe_size,
             color = EXCLUDED.color,
             sku = EXCLUDED.sku,
             stock_quantity = EXCLUDED.stock_quantity,
             price_adjustment = EXCLUDED.price_adjustment`,
          [v.id, p.id, v.sizeOrShoeSize, v.color, v.sku, v.stockQuantity, v.priceAdjustment || 0]
        );
      }

      await runner.query('DELETE FROM product_images WHERE product_id = $1', [p.id]);
      for (const [idx, img] of p.images.entries()) {
        await runner.query(
          `INSERT INTO product_images (id, product_id, minio_url, alt_text, is_primary, display_order)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [img.id, p.id, img.minioUrl, img.altText || p.name, Boolean(img.isPrimary), idx]
        );
      }
    }

    for (const o of memoryStore.orders) {
      await runner.query(
        `INSERT INTO orders (id, order_number, customer_name, customer_email, customer_phone, shipping_address, shipping_city, total_amount, status, created_at, stock_restored, cancel_reason, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP)
         ON CONFLICT (id) DO UPDATE SET
           status = EXCLUDED.status,
           stock_restored = EXCLUDED.stock_restored,
           cancel_reason = EXCLUDED.cancel_reason,
           updated_at = CURRENT_TIMESTAMP
         WHERE orders.status IS DISTINCT FROM EXCLUDED.status
            OR orders.stock_restored IS DISTINCT FROM EXCLUDED.stock_restored
            OR orders.cancel_reason IS DISTINCT FROM EXCLUDED.cancel_reason`,
        [
          o.id,
          o.orderNumber,
          o.customerName,
          o.customerEmail,
          o.customerPhone,
          o.shippingAddress,
          o.shippingCity,
          o.totalAmount,
          o.status,
          o.createdAt,
          Boolean(o.stockRestored),
          o.cancelReason ?? null,
        ]
      );

      for (const item of o.items) {
        await runner.query(
          `INSERT INTO order_items (id, order_id, product_variant_id, product_name, variant_details, quantity, unit_price, total_price)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO NOTHING`,
          [
            item.id,
            o.id,
            item.productVariantId || null,
            item.productName,
            item.variantDetails,
            item.quantity,
            item.unitPrice,
            item.totalPrice,
          ]
        );
      }
    }

    for (const call of memoryStore.phoneCallbacks) {
      await runner.query(
        `INSERT INTO phone_callbacks (id, customer_name, customer_phone, product_interest, notes, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status`,
        [
          call.id,
          call.customerName,
          call.customerPhone,
          call.productInterest,
          call.notes,
          call.status,
          call.createdAt,
        ]
      );
    }

    await runner.query('COMMIT');
    return true;
  } catch (err: any) {
    console.error(`[PostgreSQL] Échec de synchronisation (nouvel essai automatique) : ${err.message}`);
    try {
      if (client && typeof client.query === 'function') await client.query('ROLLBACK');
    } catch {
      // ignore rollback error when connection failed
    }
    return false;
  } finally {
    if (client && typeof client.release === 'function') {
      client.release();
    }
  }
};

const markPgPending = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(PG_PENDING_FILE, new Date().toISOString(), 'utf8');
  } catch (err: any) {
    console.warn(`[Persistance] Impossible d'écrire ${PG_PENDING_FILE} : ${err.message}`);
  }
};

const clearPgPending = () => {
  try {
    if (fs.existsSync(PG_PENDING_FILE)) fs.unlinkSync(PG_PENDING_FILE);
  } catch {
    // ignore
  }
};

let pgRetryTimer: NodeJS.Timeout | null = null;

/** Relance périodiquement la synchronisation tant que PostgreSQL est en retard sur le disque */
const schedulePgRetry = () => {
  if (pgRetryTimer || !pgEnabled) return;
  pgRetryTimer = setInterval(() => {
    if (!fs.existsSync(PG_PENDING_FILE)) {
      clearInterval(pgRetryTimer!);
      pgRetryTimer = null;
      return;
    }
    void persistStore();
  }, PG_RETRY_INTERVAL_MS);
  pgRetryTimer.unref();
};

/** File d'attente : une seule synchronisation à la fois (pas de transactions concurrentes) */
let persistQueue: Promise<void> = Promise.resolve();

/**
 * Persiste toutes les modifications (commandes, stocks, articles, rappels) :
 * 1. Sur disque local (backend/data/store.json) immédiatement
 * 2. Sur PostgreSQL dans une transaction ; en cas d'échec, le marqueur pg-pending est conservé
 *    et la synchronisation est relancée automatiquement jusqu'à réussite
 */
export const persistStore = (): Promise<void> => {
  const run = async () => {
    saveSnapshotToDisk();
    if (!pgEnabled) return;
    markPgPending();
    if (await syncToPostgres()) {
      clearPgPending();
    } else {
      schedulePgRetry();
    }
  };
  persistQueue = persistQueue.then(run, run);
  return persistQueue;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Initialise la persistance au démarrage du serveur :
 * - Lit le snapshot disque local s'il existe
 * - Si DATABASE_URL est défini : charge PostgreSQL (avec plusieurs tentatives), sauf si le
 *   snapshot disque est plus récent (marqueur pg-pending), auquel cas c'est lui qui est
 *   recopié dans PostgreSQL. Jamais de catalogue de démonstration écrasant une vraie base.
 */
export const initDatabase = async (): Promise<void> => {
  let snapshot: any = null;
  if (fs.existsSync(SNAPSHOT_FILE)) {
    try {
      snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_FILE, 'utf8'));
    } catch (err: any) {
      console.warn(`[Persistance] Lecture de ${SNAPSHOT_FILE} ignorée : ${err.message}`);
    }
  }

  const applySnapshot = () => {
    if (!snapshot) return;
    if (Array.isArray(snapshot.categories) && snapshot.categories.length > 0) memoryStore.categories = snapshot.categories;
    if (Array.isArray(snapshot.products) && snapshot.products.length > 0) memoryStore.products = snapshot.products;
    if (Array.isArray(snapshot.orders)) memoryStore.orders = snapshot.orders;
    if (Array.isArray(snapshot.phoneCallbacks)) memoryStore.phoneCallbacks = snapshot.phoneCallbacks;
    console.log(`[Persistance] État restauré depuis ${SNAPSHOT_FILE} (${memoryStore.products.length} articles, ${memoryStore.orders.length} commandes).`);
  };

  if (!pgEnabled) {
    applySnapshot();
    saveSnapshotToDisk();
    console.info(`[Persistance] Sauvegarde automatique sur disque active (${SNAPSHOT_FILE}).`);
    return;
  }

  const snapshotIsNewer = Boolean(snapshot) && fs.existsSync(PG_PENDING_FILE);

  let hadData = false;
  let lastError: any = null;
  for (let attempt = 1; attempt <= 10; attempt++) {
    try {
      hadData = await loadFromPostgres();
      lastError = null;
      break;
    } catch (err: any) {
      lastError = err;
      console.warn(`[PostgreSQL] Tentative ${attempt}/10 échouée : ${err.message}`);
      await wait(3000);
    }
  }

  if (!lastError) {
    if (snapshotIsNewer) {
      applySnapshot();
      console.log('[PostgreSQL] Le snapshot disque est plus récent : rattrapage de PostgreSQL.');
      await persistStore();
    } else if (!hadData) {
      applySnapshot();
      await persistStore();
      console.log('[PostgreSQL] Base initialisée avec le catalogue Jumelles Store.');
    } else {
      console.log(`[PostgreSQL] Données chargées depuis PostgreSQL (${memoryStore.products.length} articles, ${memoryStore.orders.length} commandes).`);
      saveSnapshotToDisk();
    }
    return;
  }

  // PostgreSQL injoignable au démarrage
  if (snapshot) {
    applySnapshot();
    markPgPending();
    schedulePgRetry();
    console.warn(`[PostgreSQL] Non joignable (${lastError.message}). Démarrage sur ${SNAPSHOT_FILE}, synchronisation dès le retour de la base.`);
    return;
  }

  // Ni base ni snapshot : on refuse de démarrer sur le catalogue de démonstration en production,
  // car il écraserait la vraie base au retour de PostgreSQL.
  if (process.env.NODE_ENV === 'production') {
    console.error(`[PostgreSQL] Non joignable (${lastError.message}) et aucun snapshot disque. Arrêt du serveur.`);
    process.exit(1);
  }
  pgEnabled = false;
  saveSnapshotToDisk();
  console.warn(`[PostgreSQL] Non joignable (${lastError.message}). Mode développement : PostgreSQL désactivé, persistance disque uniquement.`);
};
