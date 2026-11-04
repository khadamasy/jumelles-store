import { defineStore } from 'pinia';
import { apiClient } from '../services/api';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

const ALLOWED_LOCAL_STORAGE_KEYS = new Set(['jumelles_cart', 'jumelles_currency']);
const ALLOWED_SESSION_STORAGE_KEYS = new Set(['jumelles_last_order']);

/**
 * Nettoie strictement localStorage et sessionStorage pour supprimer tout ancien jeton
 * (token, user, kc-callback-*, jumelles_token, etc.) ou toute valeur ressemblant à un JWT (eyJ...)
 */
export function purgeSensitiveBrowserStorage() {
  if (typeof window === 'undefined') return;
  try {
    const localKeys = Object.keys(window.localStorage);
    for (const key of localKeys) {
      const val = window.localStorage.getItem(key) || '';
      if (!ALLOWED_LOCAL_STORAGE_KEYS.has(key) || val.startsWith('eyJ')) {
        window.localStorage.removeItem(key);
      }
    }

    const sessionKeys = Object.keys(window.sessionStorage);
    for (const key of sessionKeys) {
      const val = window.sessionStorage.getItem(key) || '';
      if (!ALLOWED_SESSION_STORAGE_KEYS.has(key) || val.startsWith('eyJ')) {
        window.sessionStorage.removeItem(key);
      }
    }
  } catch {
    // ignore
  }
}

purgeSensitiveBrowserStorage();

/**
 * Store d'authentification sans aucun jeton exposé côté client :
 * la session est portée par un cookie HttpOnly géré par le serveur.
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null as UserProfile | null,
    isLoading: false,
    sessionChecked: false,
  }),

  getters: {
    isAdmin: (state) => state.user?.roles?.includes('ROLE_ADMIN') || false,
    isClient: (state) => state.user?.roles?.includes('ROLE_CLIENT') || false,
    userName: (state) => state.user?.name || state.user?.email || 'Visiteur',
  },

  actions: {
    /** Vérifie auprès du serveur si un cookie HttpOnly de session valide est présent */
    async initKeycloak() {
      await this.checkSession();
    },

    async checkSession() {
      purgeSensitiveBrowserStorage();
      try {
        const res = await apiClient.get('/auth/me');
        const user = res.data?.data?.user;
        if (user) {
          this.user = user;
          this.isAuthenticated = true;
        }
      } catch {
        this.user = null;
        this.isAuthenticated = false;
      } finally {
        this.sessionChecked = true;
      }
    },

    /** Connexion de la gérance : le serveur pose un cookie HttpOnly (aucun token dans le navigateur) */
    async loginAdmin(password: string) {
      purgeSensitiveBrowserStorage();
      this.isLoading = true;
      try {
        const res = await apiClient.post('/auth/admin/login', { password });
        const { user } = res.data.data;
        this.user = user;
        this.isAuthenticated = true;
      } finally {
        this.isLoading = false;
      }
    },

    /** Déconnexion : supprime le cookie HttpOnly côté serveur et vide l'état mémoire */
    async logout() {
      purgeSensitiveBrowserStorage();
      try {
        await apiClient.post('/auth/logout');
      } catch {
        // ignore
      }
      this.isAuthenticated = false;
      this.user = null;
    },
  },
});
