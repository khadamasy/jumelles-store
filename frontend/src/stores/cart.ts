import { defineStore } from 'pinia';
import { ProductService } from '../services/api';

export interface CartItem {
  variantId: string;
  productId: string;
  productName: string;
  imageUrl: string;
  color: string;
  sizeOrShoeSize: string;
  price: number;
  quantity: number;
  maxStock: number;
}

const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem('jumelles_cart');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        typeof item.variantId === 'string' &&
        typeof item.productName === 'string' &&
        typeof item.price === 'number' &&
        Number.isFinite(item.price) &&
        typeof item.quantity === 'number' &&
        item.quantity > 0
    );
  } catch {
    window.localStorage.removeItem('jumelles_cart');
    return [];
  }
};

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: loadCartFromStorage(),
    isDrawerOpen: false,
  }),

  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    formattedSubtotal(): string {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        maximumFractionDigits: 0,
      }).format(this.subtotal);
    },
  },

  actions: {
    addItem(item: CartItem) {
      if (item.maxStock <= 0 || item.quantity <= 0) return;
      const existing = this.items.find((i) => i.variantId === item.variantId);
      if (existing) {
        // Stock et prix les plus récents (ceux de la fiche qui vient d'être consultée)
        existing.maxStock = item.maxStock;
        existing.price = item.price;
        existing.quantity = Math.min(existing.quantity + item.quantity, item.maxStock);
      } else {
        // Jamais plus que le stock disponible (sinon la commande serait refusée par le serveur)
        this.items.push({ ...item, quantity: Math.min(item.quantity, item.maxStock) });
      }
      this.saveToStorage();
      this.isDrawerOpen = true;
    },

    updateQuantity(variantId: string, quantity: number) {
      const item = this.items.find((i) => i.variantId === variantId);
      if (item) {
        if (quantity <= 0) {
          this.removeItem(variantId);
        } else {
          item.quantity = Math.min(quantity, item.maxStock);
          this.saveToStorage();
        }
      }
    },

    removeItem(variantId: string) {
      this.items = this.items.filter((i) => i.variantId !== variantId);
      this.saveToStorage();
    },

    clearCart() {
      this.items = [];
      this.saveToStorage();
    },

    toggleDrawer(open?: boolean) {
      this.isDrawerOpen = open !== undefined ? open : !this.isDrawerOpen;
    },

    saveToStorage() {
      try {
        localStorage.setItem('jumelles_cart', JSON.stringify(this.items));
      } catch {
        // Navigation privée / stockage plein : le panier reste valable pour la session en cours
      }
    },

    /**
     * Met le panier (conservé dans le navigateur, parfois depuis plusieurs jours) en accord avec
     * le catalogue actuel : prix, stock, articles retirés. Retourne la liste des ajustements
     * effectués pour en informer la cliente avant qu'elle ne valide sa commande.
     */
    async syncWithServer(): Promise<string[]> {
      const notices: string[] = [];
      const productIds = [...new Set(this.items.map((i) => i.productId).filter(Boolean))];
      if (productIds.length === 0) return notices;

      const products = new Map<string, any | null>();
      await Promise.all(
        productIds.map(async (id) => {
          try {
            const res = await ProductService.getByIdOrSlug(id);
            products.set(id, res.data?.data || null);
          } catch (err: any) {
            // 404 : article retiré du catalogue ; autre erreur (réseau) : on ne touche à rien
            if (err?.response?.status === 404) products.set(id, null);
          }
        })
      );

      const kept: CartItem[] = [];
      for (const item of this.items) {
        if (!products.has(item.productId)) {
          kept.push(item);
          continue;
        }
        const product = products.get(item.productId);
        const variant = product?.variants?.find((v: any) => v.id === item.variantId);
        if (!product || !variant || variant.stockQuantity <= 0) {
          notices.push(
            `« ${item.productName} » (${item.color} / ${item.sizeOrShoeSize}) n'est plus disponible et a été retiré du panier.`
          );
          continue;
        }
        const price = (Number(product.basePrice) || 0) + (Number(variant.priceAdjustment) || 0);
        if (price !== item.price) {
          notices.push(`Le prix de « ${item.productName} » a été mis à jour.`);
        }
        const quantity = Math.min(item.quantity, variant.stockQuantity);
        if (quantity !== item.quantity) {
          notices.push(`Quantité de « ${item.productName} » ajustée au stock disponible (${quantity}).`);
        }
        kept.push({ ...item, price, quantity, maxStock: variant.stockQuantity });
      }

      this.items = kept;
      this.saveToStorage();
      return notices;
    },
  },
});

