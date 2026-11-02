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
    // Initialisation OIDC Keycloak sécurisée et non-bloquante
    async initKeycloak() {
      try {
        const kcUrl = import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080';
        
        // Vérifier si Keycloak est accessible avant d'initialiser pour éviter toute redirection
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);

        try {
          await fetch(`${kcUrl}/realms/jumelles-store`, {
            method: 'HEAD',
            signal: controller.signal,
            mode: 'no-cors'
          });
        } catch (pingErr) {
          console.info('[Keycloak] Serveur Keycloak (port 8080) non actif localement. Mode démo actif.');
          return;
        } finally {
          clearTimeout(timeoutId);
        }

        const kc = new Keycloak({
          url: kcUrl,
          realm: 'jumelles-store',
          clientId: 'jumelles-frontend',
        });

        // Ne JAMAIS utiliser 'check-sso' sans iframe pour éviter les redirections forcées intempestives
        const authenticated = await kc.init({
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
        console.info('[Keycloak SSO] Keycloak en attente de démarrage :', err);
      }
    },

    loginKeycloak() {
      if (this.keycloakInstance) {
        this.keycloakInstance.login({ redirectUri: window.location.origin });
      } else {
        alert('Le serveur Keycloak (port 8080) n\'est pas encore démarré.\n\nVous pouvez utiliser la connexion rapide démo en 1 clic dans le menu ("Démo Client" ou "Démo Admin") pour tester toute la boutique immédiatement !');
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

