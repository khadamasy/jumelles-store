import { defineStore } from 'pinia';

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

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('jumelles_cart') || '[]') as CartItem[],
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
      const existing = this.items.find((i) => i.variantId === item.variantId);
      if (existing) {
        const newQty = existing.quantity + item.quantity;
        existing.quantity = Math.min(newQty, item.maxStock);
      } else {
        this.items.push(item);
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
      localStorage.setItem('jumelles_cart', JSON.stringify(this.items));
    },
  },
});

