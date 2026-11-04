import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { purgeSensitiveBrowserStorage } from '../stores/auth';

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
      meta: { title: 'Catalogue Maroquinerie & Chaussures — Jumelles Store Dakar' },
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
      meta: { title: 'Finaliser ma Commande WhatsApp — Jumelles Store' },
    },
    {
      path: '/order-success',
      name: 'order-success',
      component: () => import('../views/OrderSuccessView.vue'),
      meta: { title: 'Commande Confirmée — Jumelles Store' },
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/OrdersView.vue'),
      meta: { title: 'Suivi de Commande — Jumelles Store Dakar' },
    },
    {
      path: '/faq-livraison',
      name: 'faq-livraison',
      component: () => import('../views/FaqDeliveryView.vue'),
      meta: { title: 'Livraison 24h Dakar & FAQ — Jumelles Store' },
    },
    {
      path: '/conditions-utilisation',
      name: 'terms',
      component: () => import('../views/LegalView.vue'),
      meta: { title: 'Conditions Générales de Vente — Jumelles Store' },
    },
    {
      path: '/politique-confidentialite',
      name: 'privacy',
      component: () => import('../views/LegalView.vue'),
      meta: { title: 'Politique de Confidentialité — Jumelles Store' },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      meta: { title: 'Administration — Jumelles Store', requiresAdmin: true },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to) => {
  purgeSensitiveBrowserStorage();
  if (typeof document !== 'undefined') {
    document.title = (to.meta?.title as string) || 'Jumelles Store Dakar';
  }
  return true;
});

export default router;

