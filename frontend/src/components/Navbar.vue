<template>
  <header class="sticky top-0 z-30 bg-[#faf7f2]/92 backdrop-blur-md border-b border-[#e9e0d6] transition-all">
    <div class="max-w-[1080px] mx-auto px-4 md:px-7 flex items-center gap-2 h-14 md:h-16">
      <!-- Bouton Menu Plein Écran (Mobile) -->
      <button
        @click="openMenu"
        :aria-expanded="mobileMenuOpen"
        aria-controls="mobile-fullscreen-menu"
        aria-label="Ouvrir le menu"
        class="md:hidden w-11 h-11 rounded-xl flex items-center justify-center text-[#241d19] active:scale-92 transition-transform cursor-pointer"
      >
        <svg class="w-6 h-6 stroke-current fill-none stroke-[1.8]" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <!-- Logo -->
      <router-link to="/" class="flex-1 md:flex-none font-serif font-bold text-xl tracking-[0.14em] text-[#241d19] leading-tight">
        JUMELLES
        <small class="block font-sans font-semibold text-[9px] tracking-[0.3em] text-[#b8893a]">
          SACS &amp; CHAUSSURES
        </small>
      </router-link>

      <!-- Navigation Desktop -->
      <nav aria-label="Navigation principale" class="hidden md:flex items-center gap-1 mx-auto text-sm font-semibold text-[#241d19]">
        <router-link
          to="/"
          class="px-3.5 py-2 rounded-xl transition-colors"
          :class="$route.path === '/' ? 'bg-[#e9e0d6]/70 text-[#17110e] font-bold' : 'hover:bg-[#e9e0d6]/40 text-[#6f625a] hover:text-[#241d19]'"
        >
          Accueil
        </router-link>
        <router-link
          to="/catalog?type=SAC"
          class="px-3.5 py-2 rounded-xl transition-colors"
          :class="$route.query.type === 'SAC' ? 'bg-[#e9e0d6]/70 text-[#17110e] font-bold' : 'hover:bg-[#e9e0d6]/40 text-[#6f625a] hover:text-[#241d19]'"
        >
          Sacs
        </router-link>
        <router-link
          to="/catalog?type=CHAUSSURE"
          class="px-3.5 py-2 rounded-xl transition-colors"
          :class="$route.query.type === 'CHAUSSURE' ? 'bg-[#e9e0d6]/70 text-[#17110e] font-bold' : 'hover:bg-[#e9e0d6]/40 text-[#6f625a] hover:text-[#241d19]'"
        >
          Chaussures
        </router-link>
        <router-link
          to="/orders"
          class="px-3.5 py-2 rounded-xl transition-colors"
          :class="$route.path === '/orders' ? 'bg-[#e9e0d6]/70 text-[#17110e] font-bold' : 'hover:bg-[#e9e0d6]/40 text-[#6f625a] hover:text-[#241d19]'"
        >
          Suivre ma commande
        </router-link>
        <router-link
          to="/faq-livraison"
          class="px-3.5 py-2 rounded-xl transition-colors"
          :class="$route.path === '/faq-livraison' ? 'bg-[#e9e0d6]/70 text-[#17110e] font-bold' : 'hover:bg-[#e9e0d6]/40 text-[#6f625a] hover:text-[#241d19]'"
        >
          Livraison et échanges
        </router-link>
        <router-link
          v-if="authStore.isAdmin"
          to="/admin"
          class="px-3 py-1.5 rounded-xl bg-[#b8893a]/20 text-[#17110e] font-bold text-xs hover:bg-[#b8893a]/30 transition-colors ml-1"
        >
          Gérance
        </router-link>
      </nav>

      <!-- Actions Droite : Devise & Panier -->
      <div class="flex items-center gap-1.5">
        <div class="hidden sm:flex items-center bg-[#e9e0d6]/60 p-0.5 rounded-xl border border-[#e9e0d6]">
          <button
            @click="currencyStore.setCurrency('XOF')"
            class="px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer"
            :class="currencyStore.isXof ? 'bg-[#17110e] text-[#d9ad5c]' : 'text-[#6f625a] hover:text-[#241d19]'"
          >
            FCFA
          </button>
          <button
            @click="currencyStore.setCurrency('EUR')"
            class="px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer"
            :class="currencyStore.isEur ? 'bg-[#17110e] text-[#d9ad5c]' : 'text-[#6f625a] hover:text-[#241d19]'"
          >
            EUR €
          </button>
        </div>

        <button
          @click="cartStore.toggleDrawer(true)"
          aria-label="Voir le panier"
          class="w-11 h-11 rounded-xl flex items-center justify-center text-[#241d19] active:scale-92 transition-transform relative cursor-pointer"
        >
          <svg class="w-6 h-6 stroke-current fill-none stroke-[1.8]" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 8h12l-1 12H7L6 8Z" />
            <path d="M9 8a3 3 0 0 1 6 0" />
          </svg>
          <span
            class="absolute top-1 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#b8893a] text-[#17110e] font-sans font-bold text-[11px] leading-[18px] text-center transition-transform duration-250"
            :class="badgePop ? 'scale-140' : 'scale-100'"
          >
            {{ cartStore.totalItems }}
          </span>
        </button>
      </div>
    </div>

    <!-- Menu Plein Écran Mobile (Fidèle à jumelles-accueil-mobile-first.html) -->
    <div
      id="mobile-fullscreen-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      :aria-hidden="!mobileMenuOpen"
      class="fixed inset-0 z-50 bg-[#17110e] text-[#f6ece0] px-5 pt-4 pb-6 flex flex-col transition-transform duration-350 ease-[cubic-bezier(.2,.8,.2,1)]"
      :class="mobileMenuOpen ? 'translate-y-0 visible' : '-translate-y-full invisible'"
    >
      <div class="flex items-center justify-between">
        <span class="font-serif font-bold text-lg tracking-[0.14em] text-[#f6ece0]">JUMELLES</span>
        <button
          ref="closeBtnRef"
          @click="closeMenu"
          aria-label="Fermer le menu"
          class="w-11 h-11 rounded-xl flex items-center justify-center text-[#f6ece0] active:scale-92 cursor-pointer"
        >
          <svg class="w-6 h-6 stroke-current fill-none stroke-[1.8]" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      <nav aria-label="Navigation principale" class="grid gap-1 mt-6">
        <router-link
          to="/"
          @click="closeMenu"
          class="font-serif font-semibold text-[26px] py-3 border-b border-white/12 text-[#f6ece0] hover:text-[#d9ad5c] transition-colors"
        >
          Accueil
        </router-link>
        <router-link
          to="/catalog?type=SAC"
          @click="closeMenu"
          class="font-serif font-semibold text-[26px] py-3 border-b border-white/12 text-[#f6ece0] hover:text-[#d9ad5c] transition-colors"
        >
          Sacs
        </router-link>
        <router-link
          to="/catalog?type=CHAUSSURE"
          @click="closeMenu"
          class="font-serif font-semibold text-[26px] py-3 border-b border-white/12 text-[#f6ece0] hover:text-[#d9ad5c] transition-colors"
        >
          Chaussures
        </router-link>
        <router-link
          to="/orders"
          @click="closeMenu"
          class="font-serif font-semibold text-[26px] py-3 border-b border-white/12 text-[#f6ece0] hover:text-[#d9ad5c] transition-colors"
        >
          Suivre ma commande
        </router-link>
        <router-link
          to="/faq-livraison"
          @click="closeMenu"
          class="font-serif font-semibold text-[26px] py-3 border-b border-white/12 text-[#f6ece0] hover:text-[#d9ad5c] transition-colors"
        >
          Livraison et échanges
        </router-link>
        <router-link
          v-if="authStore.isAdmin"
          to="/admin"
          @click="closeMenu"
          class="font-serif font-semibold text-[22px] py-3 text-[#d9ad5c]"
        >
          Espace Gérance
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { useCurrencyStore } from '../stores/currency';

const mobileMenuOpen = ref(false);
const closeBtnRef = ref<HTMLButtonElement | null>(null);
const badgePop = ref(false);

const cartStore = useCartStore();
const authStore = useAuthStore();
const currencyStore = useCurrencyStore();

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
