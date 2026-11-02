import { defineStore } from 'pinia';
import Keycloak from 'keycloak-js';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    keycloakInstance: null as Keycloak | null,
    isAuthenticated: !!localStorage.getItem('jumelles_token'),
    token: localStorage.getItem('jumelles_token') || '',
    user: JSON.parse(localStorage.getItem('jumelles_user') || 'null') as UserProfile | null,
    isLoading: false,
  }),

  getters: {
    isAdmin: (state) => state.user?.roles?.includes('ROLE_ADMIN') || false,
    isClient: (state) => state.user?.roles?.includes('ROLE_CLIENT') || false,
    userName: (state) => state.user?.name || state.user?.email || 'Visiteur',
  },

  actions: {
    // Initialisation OIDC Keycloak
    async initKeycloak() {
      try {
        const kc = new Keycloak({
          url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
          realm: 'jumelles-store',
          clientId: 'jumelles-frontend',
        });

        const authenticated = await kc.init({
          onLoad: 'check-sso',
          checkLoginIframe: false,
          pkceMethod: 'S256',
        });

        this.keycloakInstance = kc;

        if (authenticated && kc.token) {
          this.setSession(kc.token, {
            id: kc.tokenParsed?.sub || 'user-id',
            email: kc.tokenParsed?.email || '',
            name: kc.tokenParsed?.name || kc.tokenParsed?.preferred_username || 'Utilisateur',
            roles: kc.tokenParsed?.realm_access?.roles || ['ROLE_CLIENT'],
          });
        }
      } catch (err) {
        console.warn('[Keycloak SSO] Keycloak n\'est pas encore joignable ou initialisé :', err);
      }
    },

    loginKeycloak() {
      if (this.keycloakInstance) {
        this.keycloakInstance.login({ redirectUri: window.location.origin });
      } else {
        alert('Keycloak démarre... Vous pouvez aussi utiliser les boutons de connexion rapide ci-dessous !');
      }
    },

    // Déconnexion
    logout() {
      this.isAuthenticated = false;
      this.token = '';
      this.user = null;
      localStorage.removeItem('jumelles_token');
      localStorage.removeItem('jumelles_user');

      if (this.keycloakInstance?.authenticated) {
        this.keycloakInstance.logout({ redirectUri: window.location.origin });
      }
    },

    // Connexions rapides de démonstration (pour tester instantanément l'application)
    loginAsDemoAdmin() {
      this.setSession('demo-token-admin', {
        id: 'admin-001',
        email: 'admin@jumelles.com',
        name: 'Directrice Jumelles (Admin)',
        roles: ['ROLE_ADMIN', 'ROLE_CLIENT'],
      });
    },

    loginAsDemoClient() {
      this.setSession('demo-token-client', {
        id: 'client-002',
        email: 'client@jumelles.com',
        name: 'Awa Diop (Cliente)',
        roles: ['ROLE_CLIENT'],
      });
    },

    setSession(token: string, user: UserProfile) {
      this.token = token;
      this.user = user;
      this.isAuthenticated = true;
      localStorage.setItem('jumelles_token', token);
      localStorage.setItem('jumelles_user', JSON.stringify(user));
    },
  },
});
