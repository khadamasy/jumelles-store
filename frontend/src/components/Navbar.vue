<template>
  <header class="jm-header">
    <div class="wrap bar">
      <button
        class="ib"
        id="burger"
        aria-label="Ouvrir le menu"
        :aria-expanded="mobileMenuOpen"
        aria-controls="menu"
        @click="openMenu"
      >
        <svg viewBox="0 0 24 24">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <router-link to="/" class="logo">
        JUMELLES<small>SACS &amp; CHAUSSURES</small>
      </router-link>

      <button
        class="ib"
        id="cart"
        aria-label="Voir le panier"
        @click="cartStore.toggleDrawer(true)"
      >
        <svg viewBox="0 0 24 24">
          <path d="M6 8h12l-1 12H7L6 8Z" />
          <path d="M9 8a3 3 0 0 1 6 0" />
        </svg>
        <span class="badge" :class="{ pop: badgePop }" id="count">
          {{ cartStore.totalItems }}
        </span>
      </button>
    </div>
  </header>

  <div
    id="menu"
    :class="{ open: mobileMenuOpen }"
    role="dialog"
    aria-modal="true"
    aria-label="Menu"
    :aria-hidden="!mobileMenuOpen"
  >
    <div class="top">
      <span class="serif" style="letter-spacing: 0.14em">JUMELLES</span>
      <button
        ref="closeBtnRef"
        class="ib"
        id="close"
        aria-label="Fermer le menu"
        @click="closeMenu"
      >
        <svg viewBox="0 0 24 24">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>
    </div>

    <nav aria-label="Navigation principale">
      <router-link to="/" @click="closeMenu">Accueil</router-link>
      <router-link to="/catalog?type=SAC" @click="closeMenu">Sacs</router-link>
      <router-link to="/catalog?type=CHAUSSURE" @click="closeMenu">Chaussures</router-link>
      <router-link to="/orders" @click="closeMenu">Suivre ma commande</router-link>
      <router-link to="/faq-livraison" @click="closeMenu">Livraison et échanges</router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';

const mobileMenuOpen = ref(false);
const closeBtnRef = ref<HTMLButtonElement | null>(null);
const badgePop = ref(false);

const cartStore = useCartStore();
const authStore = useAuthStore();

watch(
  () => cartStore.totalItems,
  () => {
    badgePop.value = true;
    setTimeout(() => {
      badgePop.value = false;
    }, 250);
  }
);

const openMenu = () => {
  mobileMenuOpen.value = true;
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden';
  }
  setTimeout(() => closeBtnRef.value?.focus(), 50);
};

const closeMenu = () => {
  if (!mobileMenuOpen.value) return;
  mobileMenuOpen.value = false;
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
};

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeMenu();
};

onMounted(() => window.addEventListener('keydown', handleEscape));
onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape);
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
});
</script>
