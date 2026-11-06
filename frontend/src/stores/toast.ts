import { defineStore } from 'pinia';

export type ToastTone = 'default' | 'success' | 'warning' | 'danger';

export interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

let nextId = 0;

/** Messages courts et éphémères affichés en bas de l'écran (« Ajouté au panier », « Enregistré »…) */
export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: [] as Toast[],
  }),
  actions: {
    show(message: string, tone: ToastTone = 'default', duration = 2600) {
      const id = ++nextId;
      this.toasts.push({ id, message, tone });
      // Trois messages au maximum à l'écran
      if (this.toasts.length > 3) this.toasts.shift();
      setTimeout(() => this.dismiss(id), duration);
      return id;
    },
    dismiss(id: number) {
      this.toasts = this.toasts.filter((t) => t.id !== id);
    },
  },
});
