import { defineStore } from 'pinia';
import { apiClient } from '../services/api';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

// Purge définitive de tout ancien jeton stocké dans le navigateur par les versions précédentes
if (typeof window !== 'undefined') {
  try {
    window.localStorage.removeItem('jumelles_token');
    window.localStorage.removeItem('jumelles_user');
    window.sessionStorage.removeItem('jumelles_token');
    window.sessionStorage.removeItem('jumelles_user');
  } catch {
    // ignore
  }
}

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
