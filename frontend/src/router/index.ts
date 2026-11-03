import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CatalogView from '../views/CatalogView.vue';
import ProductDetailView from '../views/ProductDetailView.vue';
import CheckoutView from '../views/CheckoutView.vue';
import OrderSuccessView from '../views/OrderSuccessView.vue';
import OrdersView from '../views/OrdersView.vue';
import AdminView from '../views/AdminView.vue';
import FaqDeliveryView from '../views/FaqDeliveryView.vue';
import LegalView from '../views/LegalView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/catalog', name: 'catalog', component: CatalogView },
    { path: '/product/:slug', name: 'product-detail', component: ProductDetailView },
    { path: '/checkout', name: 'checkout', component: CheckoutView },
    { path: '/order-success', name: 'order-success', component: OrderSuccessView },
    { path: '/orders', name: 'orders', component: OrdersView },
    { path: '/faq-livraison', name: 'faq-livraison', component: FaqDeliveryView },
    { path: '/conditions-utilisation', name: 'terms', component: LegalView },
    { path: '/politique-confidentialite', name: 'privacy', component: LegalView },
    { path: '/admin', name: 'admin', component: AdminView },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;

