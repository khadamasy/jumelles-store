import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { purgeSensitiveBrowserStorage } from '../stores/auth';
import { applySeo } from '../utils/seo';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Jumelles Store Dakar — Sacs de Luxe & Chaussures Femme' },
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: () => import('../views/CatalogView.vue'),
      meta: { title: 'Catalogue Maroquinerie & Chaussures — Jumelles Store Dakar', description: 'Tous nos sacs à main, cabas, pochettes, mules et sandales pour femme. Filtrez par pointure, couleur et prix. Livraison à Dakar et en régions.' },
    },
    {
      path: '/product/:slug',
      name: 'product-detail',
      component: () => import('../views/ProductDetailView.vue'),
      meta: { title: 'Détail Article — Jumelles Store Dakar' },
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue'),
      meta: { title: 'Finaliser ma Commande WhatsApp — Jumelles Store', noindex: true },
    },
    {
      path: '/order-success',
      name: 'order-success',
      component: () => import('../views/OrderSuccessView.vue'),
      meta: { title: 'Commande Confirmée — Jumelles Store', noindex: true },
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/OrdersView.vue'),
      meta: { title: 'Suivi de Commande — Jumelles Store Dakar', noindex: true },
    },
    {
      path: '/faq-livraison',
      name: 'faq-livraison',
      component: () => import('../views/FaqDeliveryView.vue'),
      meta: { title: 'Livraison 24h Dakar & FAQ — Jumelles Store', description: 'Délais et zones de livraison à Dakar, en banlieue et en régions, paiement à la livraison, échange de pointure : toutes les réponses à vos questions.' },
    },
    {
      path: '/conditions-utilisation',
      name: 'terms',
      component: () => import('../views/LegalView.vue'),
      meta: { title: 'Conditions Générales de Vente — Jumelles Store', description: 'Conditions générales de vente de Jumelles Store : commandes, prix, livraison, échanges.' },
    },
    {
      path: '/politique-confidentialite',
      name: 'privacy',
      component: () => import('../views/LegalView.vue'),
      meta: { title: 'Politique de Confidentialité — Jumelles Store', description: 'Politique de confidentialité de Jumelles Store : données collectées, utilisation et vos droits.' },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      meta: { title: 'Administration — Jumelles Store', requiresAdmin: true, noindex: true },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to) => {
  purgeSensitiveBrowserStorage();
  return true;
});

// Titre, description, canonical et Open Graph propres à chaque page
// (les fiches produit les complètent avec le nom et la photo de l'article une fois chargé).
router.afterEach((to) => {
  applySeo({
    title: (to.meta?.title as string) || 'Jumelles Store Dakar',
    description: to.meta?.description as string | undefined,
    path: to.path,
    noindex: Boolean(to.meta?.noindex),
  });
});

export default router;

