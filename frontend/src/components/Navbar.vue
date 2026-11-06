<template>
  <!-- Bandeau d'engagements (défile avec la page) -->
  <div class="promo" role="note">
    <div class="wrap promo-in">
      <span><Truck aria-hidden="true" />Livraison 24 h à Dakar</span>
      <span class="sep hide-xs" aria-hidden="true"></span>
      <span class="hide-xs"><Banknote aria-hidden="true" />Paiement à la livraison</span>
      <span class="sep hide-xs" aria-hidden="true"></span>
      <span class="hide-sm"><Repeat aria-hidden="true" />Échange de pointure 48 h</span>
    </div>
  </div>

  <header class="hdr" :class="{ scrolled }">
    <div class="wrap hdr-in">
      <button
        class="ib burger"
        aria-label="Ouvrir le menu"
        :aria-expanded="mobileMenuOpen"
        aria-haspopup="dialog"
        @click="openMenu"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h10M4 17h16" /></svg>
      </button>

      <router-link to="/" class="logo" aria-label="Jumelles Store, accueil">
        <span class="logo-m">Jumelles</span>
        <span class="logo-s">Sacs &amp; chaussures · Dakar</span>
      </router-link>

      <nav class="nav" aria-label="Navigation principale">
        <router-link
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          class="nav-a"
          :class="{ on: isActive(l) }"
          :aria-current="isActive(l) ? 'page' : undefined"
        >
          {{ l.label }}
        </router-link>
      </nav>

      <div class="acts">
        <router-link to="/catalog" class="ib act-search" aria-label="Rechercher un article">
          <Search aria-hidden="true" />
        </router-link>
        <button type="button" class="ib act-phone" aria-label="Nous appeler ou écrire" @click="phoneStore.openModal()">
          <Phone aria-hidden="true" />
        </button>
        <button
          class="ib cart"
          :aria-label="`Voir le panier, ${cartStore.totalItems} article${cartStore.totalItems > 1 ? 's' : ''}`"
          @click="cartStore.toggleDrawer(true)"
        >
          <ShoppingBag aria-hidden="true" />
          <Transition name="badge">
            <span v-if="cartStore.totalItems > 0" :key="cartStore.totalItems" class="badge tnum" aria-hidden="true">
              {{ cartStore.totalItems }}
            </span>
          </Transition>
        </button>
      </div>
    </div>
  </header>

  <!-- Menu téléphone -->
  <UiModal :open="mobileMenuOpen" variant="side" tone="dark" label="Menu" flush @close="closeMenu">
    <div class="menu">
      <div class="menu-logo">
        <span class="logo-m">Jumelles</span>
        <span class="logo-s">Sacs &amp; chaussures · Dakar</span>
      </div>

      <nav class="menu-nav" aria-label="Navigation principale">
        <router-link to="/" @click="closeMenu">Accueil</router-link>
        <router-link to="/catalog?type=SAC" @click="closeMenu">Sacs</router-link>
        <router-link to="/catalog?type=CHAUSSURE" @click="closeMenu">Chaussures</router-link>
        <router-link to="/catalog" @click="closeMenu">Toute la collection</router-link>
      </nav>

      <div class="menu-sec">
        <router-link to="/orders" @click="closeMenu"><Package aria-hidden="true" />Suivre ma commande</router-link>
        <router-link to="/faq-livraison" @click="closeMenu"><Truck aria-hidden="true" />Livraison et échanges</router-link>
      </div>

      <div class="menu-contact">
        <p>Une question ? Nous répondons 7j/7, de 8 h à 22 h.</p>
        <a class="btn wa block" :href="waUrl" target="_blank" rel="noopener noreferrer" @click="closeMenu">
          <IconWhatsApp className="w-5 h-5" />
          Écrire sur WhatsApp
        </a>
        <a class="menu-tel" href="tel:+221772087820"><Phone aria-hidden="true" />+221 77 208 78 20</a>
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { ShoppingBag, Search, Phone, Truck, Banknote, Repeat, Package } from 'lucide-vue-next';
import UiModal from './ui/UiModal.vue';
import IconWhatsApp from './icons/IconWhatsApp.vue';
import { useCartStore } from '../stores/cart';
import { usePhoneStore, buildWhatsAppSendUrl } from '../stores/phone';

const route = useRoute();
const cartStore = useCartStore();
const phoneStore = usePhoneStore();

const mobileMenuOpen = ref(false);
const scrolled = ref(false);

const waUrl = buildWhatsAppSendUrl('Bonjour Jumelles Store, je souhaite avoir des informations.');

const links = [
  { to: '/catalog?type=SAC', label: 'Sacs', type: 'SAC' },
  { to: '/catalog?type=CHAUSSURE', label: 'Chaussures', type: 'CHAUSSURE' },
  { to: '/catalog', label: 'Collection', type: '' },
  { to: '/faq-livraison', label: 'Livraison', type: null },
  { to: '/orders', label: 'Suivi de commande', type: null },
];

const isActive = (l: (typeof links)[number]) => {
  if (l.type === null) return route.path === l.to;
  if (route.path !== '/catalog') return false;
  const t = typeof route.query.type === 'string' ? route.query.type.toUpperCase() : '';
  return l.type === '' ? !t : t === l.type;
};

const openMenu = () => {
  mobileMenuOpen.value = true;
};
const closeMenu = () => {
  mobileMenuOpen.value = false;
};

const onScroll = () => {
  scrolled.value = window.scrollY > 8;
};

onMounted(() => {
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
});
onUnmounted(() => window.removeEventListener('scroll', onScroll));
</script>

<style scoped>
/* ----- Bandeau ----- */
.promo {
  background: var(--ink);
  color: var(--on-ink);
  font-size: var(--fs-xs);
  font-weight: 500;
  letter-spacing: 0.02em;
}
.promo-in {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--s-3);
  height: 34px;
}
.promo span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}
.promo svg {
  width: 14px;
  height: 14px;
  color: var(--accent-on-ink);
}
.promo .sep {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--on-ink-muted);
}
.hide-xs,
.hide-sm {
  display: none !important;
}

/* ----- En-tête ----- */
.hdr {
  position: sticky;
  top: 0;
  z-index: var(--z-header);
  background: rgb(var(--c-sand-50) / 0.86);
  backdrop-filter: saturate(1.4) blur(14px);
  -webkit-backdrop-filter: saturate(1.4) blur(14px);
  border-bottom: 1px solid transparent;
  transition: border-color var(--dur-3) var(--ease-out), box-shadow var(--dur-3) var(--ease-out);
}
.hdr.scrolled {
  border-bottom-color: var(--border);
  box-shadow: 0 6px 20px -14px rgb(var(--c-sand-900) / 0.3);
}
.hdr-in {
  display: flex;
  align-items: center;
  gap: var(--s-2);
  height: var(--header-h);
}

.logo {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1;
  color: var(--text);
}
.logo-m {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  margin-right: -0.22em;
}
.logo-s {
  margin-top: 5px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--accent-text);
}

.nav {
  display: none;
}

.acts {
  display: flex;
  align-items: center;
}
.act-search,
.act-phone {
  display: none;
}
.acts :deep(svg) {
  width: 22px;
  height: 22px;
  stroke-width: 1.6;
}

.badge {
  position: absolute;
  top: 4px;
  right: 2px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: var(--ink);
  color: var(--on-ink);
  font: 700 10.5px/18px var(--font-sans);
  text-align: center;
  box-shadow: 0 0 0 2px var(--bg);
}
.badge-enter-active {
  transition: transform var(--dur-3) var(--ease-spring);
}
.badge-enter-from {
  transform: scale(0.4);
}
.badge-leave-active {
  display: none;
}

/* ----- Menu téléphone ----- */
.menu {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: var(--s-6) var(--s-6) var(--s-8);
}
.menu-logo {
  display: flex;
  flex-direction: column;
  line-height: 1;
  color: var(--on-ink);
  padding-right: 48px;
}
.menu-logo .logo-s {
  color: var(--accent-on-ink);
}
.menu-nav {
  display: grid;
  margin-top: var(--s-8);
}
.menu-nav a {
  font-family: var(--font-display);
  font-size: 30px;
  font-weight: 400;
  line-height: 1.15;
  padding: 12px 0;
  border-bottom: 1px solid rgb(255 255 255 / 0.08);
  color: var(--on-ink);
  animation: menu-in var(--dur-4) var(--ease-out) both;
  transition: color var(--dur-2), padding-left var(--dur-2) var(--ease-out);
}
.menu-nav a:hover,
.menu-nav a.router-link-exact-active {
  color: var(--accent-on-ink);
  padding-left: 6px;
}
.menu-nav a:nth-child(2) { animation-delay: 50ms; }
.menu-nav a:nth-child(3) { animation-delay: 100ms; }
.menu-nav a:nth-child(4) { animation-delay: 150ms; }

.menu-sec {
  display: grid;
  gap: 2px;
  margin-top: var(--s-6);
  animation: menu-in var(--dur-4) var(--ease-out) 200ms both;
}
.menu-sec a {
  display: flex;
  align-items: center;
  gap: var(--s-3);
  min-height: var(--tap);
  color: var(--on-ink-muted);
  font-weight: 500;
  transition: color var(--dur-2);
}
.menu-sec a:hover {
  color: var(--on-ink);
}
.menu-sec svg {
  width: 18px;
  height: 18px;
  color: var(--accent-on-ink);
}

.menu-contact {
  margin-top: auto;
  padding-top: var(--s-8);
  display: grid;
  gap: var(--s-3);
  animation: menu-in var(--dur-4) var(--ease-out) 250ms both;
}
.menu-contact p {
  margin: 0;
  color: var(--on-ink-muted);
  font-size: var(--fs-sm);
}
.menu-tel {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--s-2);
  min-height: var(--tap);
  color: var(--on-ink);
  font-weight: 600;
}
.menu-tel svg {
  width: 16px;
  height: 16px;
}

@keyframes menu-in {
  from {
    opacity: 0;
    transform: translateX(-14px);
  }
}

/* ----- Téléphone large ----- */
@media (min-width: 480px) {
  .hide-xs {
    display: inline-flex !important;
  }
}

/* ----- Tablette ----- */
@media (min-width: 720px) {
  .hide-sm {
    display: inline-flex !important;
  }
  .promo-in {
    gap: var(--s-5);
  }
  .act-phone {
    display: inline-grid;
  }
}

/* ----- Ordinateur : navigation visible, plus de menu ----- */
@media (min-width: 1024px) {
  .burger {
    display: none;
  }
  .hdr-in {
    gap: var(--s-6);
  }
  .logo {
    flex: none;
    align-items: flex-start;
  }
  .logo-m {
    font-size: 24px;
    margin-right: 0;
  }
  .nav {
    flex: 1;
    display: flex;
    justify-content: center;
    gap: var(--s-1);
  }
  .nav-a {
    position: relative;
    padding: 10px 14px;
    font-size: var(--fs-sm);
    font-weight: 600;
    color: var(--text-muted);
    border-radius: var(--r-sm);
    transition: color var(--dur-2);
  }
  .nav-a::after {
    content: '';
    position: absolute;
    left: 14px;
    right: 14px;
    bottom: 4px;
    height: 1.5px;
    background: var(--accent);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform var(--dur-3) var(--ease-out);
  }
  .nav-a:hover,
  .nav-a.on {
    color: var(--text);
  }
  .nav-a:hover::after,
  .nav-a.on::after {
    transform: scaleX(1);
  }
  .act-search {
    display: inline-grid;
  }
}
</style>
