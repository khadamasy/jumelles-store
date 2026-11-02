import { defineStore } from 'pinia';

export type Currency = 'XOF' | 'EUR';

export const useCurrencyStore = defineStore('currency', {
  state: () => ({
    current: (localStorage.getItem('jumelles_currency') as Currency) || 'XOF',
    // Taux officiel fixe : 1 EUR = 655.957 FCFA (Banque Centrale)
    rateEurToXof: 655.957,
  }),

  getters: {
    isEur: (state) => state.current === 'EUR',
    isXof: (state) => state.current === 'XOF',
  },

  actions: {
    setCurrency(curr: Currency) {
      this.current = curr;
      localStorage.setItem('jumelles_currency', curr);
    },

    toggle() {
      this.setCurrency(this.current === 'XOF' ? 'EUR' : 'XOF');
    },

    /**
     * Formate un prix en FCFA avec sa conversion automatique en Euros
     * Ex: "15 000 FCFA (~22,87 €)" ou "22,87 € (15 000 FCFA)"
     */
    formatPrice(amountInXof: number): string {
      if (!amountInXof && amountInXof !== 0) return '0 FCFA';

      const xofFormatted = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        maximumFractionDigits: 0,
      }).format(amountInXof);

      const eurAmount = amountInXof / this.rateEurToXof;
      const eurFormatted = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(eurAmount);

      if (this.current === 'EUR') {
        return `${eurFormatted} (${xofFormatted})`;
      }

      return `${xofFormatted} (~${eurFormatted})`;
    },

    /**
     * Affiche uniquement le montant converti en Euro
     * Ex: "22,87 €"
     */
    toEurOnly(amountInXof: number): string {
      const eur = amountInXof / this.rateEurToXof;
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(eur);
    },

    /**
     * Affiche uniquement le montant en FCFA
     * Ex: "15 000 FCFA"
     */
    toXofOnly(amountInXof: number): string {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        maximumFractionDigits: 0,
      }).format(amountInXof);
    },
  },
});
