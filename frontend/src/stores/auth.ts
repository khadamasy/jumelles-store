import { defineStore } from 'pinia';
import Keycloak from 'keycloak-js';
import { apiClient } from '../services/api';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

/** Lit la date d'expiration d'un JWT (sans le faire confiance : le serveur reste seul juge) */
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return !payload.exp || payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

/** Restaure la session stockée uniquement si elle est encore valide (purge des anciens jetons « démo ») */
const restoreSession = () => {
  const token = localStorage.getItem('jumelles_token') || '';
  if (!token || token.startsWith('demo-token') || isTokenExpired(token)) {
    localStorage.removeItem('jumelles_token');
    localStorage.removeItem('jumelles_user');
    return { token: '', user: null as UserProfile | null };
  }
  let user: UserProfile | null = null;
  try {
    user = JSON.parse(localStorage.getItem('jumelles_user') || 'null');
  } catch {
    user = null;
  }
  return { token, user };
};

const initial = restoreSession();

export const useAuthStore = defineStore('auth', {
  state: () => ({
    keycloakInstance: null as Keycloak | null,
    isAuthenticated: !!initial.token,
    token: initial.token,
    user: initial.user,
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
      const kcUrl = import.meta.env.VITE_KEYCLOAK_URL;
      if (!kcUrl) return; // Keycloak non configuré : connexion gérance par mot de passe

      try {
        const kc = new Keycloak({
          url: kcUrl,
          realm: 'jumelles-store',
          clientId: 'jumelles-frontend',
        });

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
        console.info('[Keycloak SSO] Indisponible :', err);
      }
    },

    loginKeycloak() {
      this.keycloakInstance?.login({ redirectUri: window.location.origin });
    },

    /** Connexion de la gérance : le mot de passe est vérifié uniquement côté serveur */
    async loginAdmin(password: string) {
      this.isLoading = true;
      try {
        const res = await apiClient.post('/auth/admin/login', { password });
        const { token, user } = res.data.data;
        this.setSession(token, user);
      } finally {
        this.isLoading = false;
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

    setSession(token: string, user: UserProfile) {
      this.token = token;
      this.user = user;
      this.isAuthenticated = true;
      localStorage.setItem('jumelles_token', token);
      localStorage.setItem('jumelles_user', JSON.stringify(user));
    },
  },
});
