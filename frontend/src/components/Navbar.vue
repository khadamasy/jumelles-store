<template>
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all shadow-xs">
    <!-- Top Bar Élégante & Épurée -->
    <div class="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-stone-200 text-xs py-2 px-4 border-b border-gold-500/20">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="inline-block w-2 h-2 rounded-full bg-gold-400"></span>
          <span class="font-serif tracking-wider font-bold text-gold-400 text-[11px] sm:text-xs">JUMELLES STORE DAKAR</span>
          <span class="hidden md:inline text-stone-400 text-[11px]">• Maison de Maroquinerie Fine & Souliers de Gala</span>
        </div>

        <div class="flex items-center gap-3 sm:gap-5 text-[11px] text-stone-300">
          <span>Livraison Express 24h Dakar</span>
          <span class="text-gold-500/80">• Wave & Orange Money</span>
        </div>
      </div>
    </div>

    <!-- Main Navigation Bar -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        <!-- Mobile Menu Button & Brand Logo -->
        <div class="flex items-center gap-3">
          <!-- Mobile Hamburger Toggle -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 text-stone-800 hover:text-stone-950 rounded-xl hover:bg-stone-100 transition-colors"
            aria-label="Ouvrir le menu de navigation"
          >
            <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6 text-gold-700" />
          </button>

          <!-- Brand Logo -->
          <router-link to="/" class="flex items-center gap-3 group">
            <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 flex items-center justify-center text-gold-400 border border-gold-500/40 shadow-md group-hover:scale-105 group-hover:border-gold-400 transition-all">
              <span class="font-serif font-black text-xl sm:text-2xl tracking-tighter">J</span>
            </div>
            <div>
              <span class="font-serif font-extrabold text-xl sm:text-2xl tracking-wider text-stone-950 block leading-none">
                JUMELLES
              </span>
              <div class="flex items-center gap-1.5 mt-1">
                <span class="text-[9px] tracking-[0.28em] text-gold-700 font-black uppercase">
                  STORE
                </span>
                <span class="text-[8px] bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded font-semibold tracking-wider">
                  SACS & SOULIERS
                </span>
              </div>
            </div>
          </router-link>
        </div>

        <!-- Desktop Navigation Links (Style exact de la maquette : Accueil, Marché, Catégories, À propos) -->
        <nav class="hidden md:flex items-center space-x-1.5 text-sm font-medium">
          <!-- 1. Accueil -->
          <router-link
            to="/"
            class="px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all"
            :class="$route.path === '/' ? 'bg-sky-50 text-sky-600 font-semibold shadow-2xs' : 'text-stone-700 hover:text-stone-950 hover:bg-stone-50'"
          >
            <Home class="w-4 h-4" :class="$route.path === '/' ? 'text-sky-600' : 'text-stone-500'" />
            <span>Accueil</span>
          </router-link>

          <!-- 2. Marché -->
          <router-link
            to="/catalog"
            class="px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all"
            :class="$route.path.startsWith('/catalog') && !$route.query.type ? 'bg-sky-50 text-sky-600 font-semibold shadow-2xs' : 'text-stone-700 hover:text-stone-950 hover:bg-stone-50'"
          >
            <Store class="w-4 h-4" :class="$route.path.startsWith('/catalog') && !$route.query.type ? 'text-sky-600' : 'text-stone-500'" />
            <span>Marché</span>
          </router-link>

          <!-- 3. Catégories avec menu déroulant -->
          <div class="relative group">
            <button
              class="px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all text-stone-700 hover:text-stone-950 hover:bg-stone-50 cursor-pointer"
              :class="$route.query.type ? 'bg-sky-50 text-sky-600 font-semibold shadow-2xs' : ''"
            >
              <LayoutGrid class="w-4 h-4" :class="$route.query.type ? 'text-sky-600' : 'text-stone-500'" />
              <span>Catégories</span>
              <ChevronDown class="w-3.5 h-3.5 text-stone-400 group-hover:rotate-180 transition-transform" />
            </button>

            <!-- Dropdown Catégories -->
            <div class="absolute left-0 mt-1 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 hidden group-hover:block transition-all z-50">
              <router-link
                to="/catalog?type=SAC"
                class="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:text-gold-700 transition-colors"
              >
                <span class="w-2 h-2 rounded-full bg-gold-500"></span>
                <span>Sacs & Maroquinerie</span>
              </router-link>
              <router-link
                to="/catalog?type=CHAUSSURE"
                class="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:text-gold-700 transition-colors"
              >
                <span class="w-2 h-2 rounded-full bg-stone-900"></span>
                <span>Chaussures (37-42)</span>
              </router-link>
              <div class="border-t border-stone-100 my-1"></div>
              <router-link
                to="/catalog"
                class="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-gold-700 hover:bg-gold-50 transition-colors"
              >
                <span>Tout le catalogue</span>
              </router-link>
            </div>
          </div>

          <!-- 4. À propos -->
          <router-link
            to="/faq-livraison"
            class="px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all"
            :class="$route.path === '/faq-livraison' ? 'bg-sky-50 text-sky-600 font-semibold shadow-2xs' : 'text-stone-700 hover:text-stone-950 hover:bg-stone-50'"
          >
            <Info class="w-4 h-4" :class="$route.path === '/faq-livraison' ? 'text-sky-600' : 'text-stone-500'" />
            <span>À propos</span>
          </router-link>

          <!-- Espace Admin si direction -->
          <router-link
            v-if="authStore.isAdmin"
            to="/admin"
            class="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 font-bold text-xs hover:bg-amber-200 transition-all ml-1"
          >
            <span>Gérance</span>
          </router-link>
        </nav>

        <!-- Right Actions (Currency Switcher, User Pill Dropdown "Compte ∨", Cart) -->
        <div class="flex items-center space-x-2 sm:space-x-3">
          <!-- Convertisseur de Devise (FCFA / EUR €) -->
          <div class="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200/90 shadow-2xs">
            <button
              @click="currencyStore.setCurrency('XOF')"
              class="px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-extrabold transition-all"
              :class="currencyStore.isXof ? 'bg-stone-900 text-gold-400 shadow' : 'text-stone-500 hover:text-stone-900'"
              title="Afficher les prix en Franc CFA (FCFA)"
            >
              FCFA
            </button>
            <button
              @click="currencyStore.setCurrency('EUR')"
              class="px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-extrabold transition-all"
              :class="currencyStore.isEur ? 'bg-gold-600 text-white shadow' : 'text-stone-500 hover:text-stone-900'"
              title="Convertir les prix en Euros (€)"
            >
              EUR
            </button>
          </div>

          <!-- User / Auth Dropdown - Exactement comme la maquette : [User] Compte ∨ -->
          <div class="relative group">
            <button
              class="border border-stone-200 hover:border-stone-300 bg-white px-3.5 sm:px-4 py-2 rounded-2xl flex items-center gap-2 text-stone-800 text-xs sm:text-sm font-medium shadow-2xs transition-all cursor-pointer"
              aria-label="Mon compte"
            >
              <User class="w-4 h-4 text-stone-700 shrink-0" />
              <span class="max-w-[90px] sm:max-w-[120px] truncate">
                {{ authStore.isAuthenticated ? authStore.userName : 'Compte' }}
              </span>
              <ChevronDown class="w-3.5 h-3.5 text-stone-400 group-hover:rotate-180 transition-transform shrink-0" />
            </button>

            <!-- Dropdown Menu -->
            <div class="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-stone-200 py-3 hidden group-hover:block transition-all z-50 animate-in fade-in zoom-in-95">
              <div v-if="authStore.isAuthenticated" class="px-4 py-2 border-b border-stone-100">
                <p class="text-[10px] text-stone-400 uppercase tracking-wider font-bold">Compte client</p>
                <p class="text-sm font-bold text-stone-900 truncate">{{ authStore.userName }}</p>
                <span
                  class="inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md"
                  :class="authStore.isAdmin ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-blue-100 text-blue-800 border border-blue-300'"
                >
                  {{ authStore.isAdmin ? '👑 Direction' : '👤 Cliente' }}
                </span>
              </div>

              <div class="py-1">
                <router-link to="/orders" class="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50">
                  <PackageCheck class="w-4 h-4 text-stone-500" />
                  <span>Mes Commandes</span>
                </router-link>

                <router-link v-if="authStore.isAdmin" to="/admin" class="flex items-center gap-2 px-4 py-2 text-xs font-bold text-amber-800 hover:bg-amber-50">
                  <Crown class="w-4 h-4 text-amber-600" />
                  <span>Tableau de bord & Stocks</span>
                </router-link>
              </div>

              <!-- Switch roles for instant test -->
              <div class="px-4 py-2 border-t border-stone-100 space-y-1.5 bg-stone-50/50">
                <p class="text-[10px] uppercase tracking-wider text-stone-400 font-bold mb-1">Basculer de profil test :</p>
                <button
                  @click="authStore.loginAsDemoAdmin"
                  class="w-full text-left text-xs text-amber-900 hover:bg-amber-100/70 p-1.5 rounded-lg flex items-center justify-between font-bold cursor-pointer"
                >
                  <span>👑 Mode Gérance</span>
                  <span class="text-[10px] text-amber-600">Admin</span>
                </button>
                <button
                  @click="authStore.loginAsDemoClient"
                  class="w-full text-left text-xs text-blue-900 hover:bg-blue-100/70 p-1.5 rounded-lg flex items-center justify-between font-semibold cursor-pointer"
                >
                  <span>👤 Mode Cliente</span>
                  <span class="text-[10px] text-blue-600">Acheter</span>
                </button>
              </div>

              <div v-if="authStore.isAuthenticated" class="border-t border-stone-100 mt-1 pt-1">
                <button @click="authStore.logout" class="w-full text-left px-4 py-2 text-xs font-semibold text-rosewood-600 hover:bg-rosewood-50 cursor-pointer">
                  Déconnexion
                </button>
              </div>
            </div>
          </div>

          <!-- Shopping Cart Button -->
          <button
            @click="cartStore.toggleDrawer(true)"
            class="relative p-2.5 sm:px-4 sm:py-2.5 bg-stone-900 hover:bg-gold-600 text-white rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 active:scale-95 cursor-pointer"
            aria-label="Voir le panier"
          >
            <ShoppingBag class="w-4 h-4 text-gold-400" />
            <span class="hidden sm:inline text-xs font-bold">Panier</span>
            <span
              v-if="cartStore.totalItems > 0"
              class="bg-gold-400 text-stone-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow"
            >
              {{ cartStore.totalItems }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Drawer -->
    <div
      v-if="mobileMenuOpen"
      class="md:hidden fixed inset-0 top-[110px] bg-stone-950/70 backdrop-blur-md z-40 transition-all animate-in fade-in"
      @click.self="mobileMenuOpen = false"
    >
      <div class="bg-white border-b border-stone-200 shadow-2xl p-5 space-y-4 max-h-[calc(100vh-110px)] overflow-y-auto">
        <div class="space-y-1">
          <p class="text-[10px] font-bold uppercase tracking-widest text-stone-400">Navigation</p>
          <div class="grid grid-cols-1 gap-1.5 pt-1">
            <!-- 1. Accueil -->
            <router-link
              to="/"
              @click="mobileMenuOpen = false"
              class="flex items-center justify-between p-3 rounded-2xl transition-colors font-medium text-sm"
              :class="$route.path === '/' ? 'bg-sky-50 text-sky-700 font-semibold' : 'bg-stone-50 text-stone-800 hover:bg-stone-100'"
            >
              <div class="flex items-center gap-3">
                <Home class="w-4 h-4" :class="$route.path === '/' ? 'text-sky-600' : 'text-stone-500'" />
                <span>Accueil</span>
              </div>
              <ChevronRight class="w-4 h-4 text-stone-400" />
            </router-link>

            <!-- 2. Marché -->
            <router-link
              to="/catalog"
              @click="mobileMenuOpen = false"
              class="flex items-center justify-between p-3 rounded-2xl transition-colors font-medium text-sm"
              :class="$route.path.startsWith('/catalog') && !$route.query.type ? 'bg-sky-50 text-sky-700 font-semibold' : 'bg-stone-50 text-stone-800 hover:bg-stone-100'"
            >
              <div class="flex items-center gap-3">
                <Store class="w-4 h-4" :class="$route.path.startsWith('/catalog') && !$route.query.type ? 'text-sky-600' : 'text-stone-500'" />
                <span>Marché</span>
              </div>
              <ChevronRight class="w-4 h-4 text-stone-400" />
            </router-link>

            <!-- 3. Catégories -->
            <div class="p-3 rounded-2xl bg-stone-50 space-y-2">
              <div class="flex items-center gap-3 text-stone-800 font-medium text-sm">
                <LayoutGrid class="w-4 h-4 text-stone-500" />
                <span>Catégories</span>
              </div>
              <div class="pl-7 space-y-1.5 pt-1 border-t border-stone-200/60">
                <router-link
                  to="/catalog?type=SAC"
                  @click="mobileMenuOpen = false"
                  class="flex items-center justify-between text-xs py-1 text-stone-600 hover:text-gold-700 font-semibold"
                >
                  <span>Sacs & Maroquinerie</span>
                  <ChevronRight class="w-3.5 h-3.5 text-stone-400" />
                </router-link>
                <router-link
                  to="/catalog?type=CHAUSSURE"
                  @click="mobileMenuOpen = false"
                  class="flex items-center justify-between text-xs py-1 text-stone-600 hover:text-gold-700 font-semibold"
                >
                  <span>Chaussures (37-42)</span>
                  <ChevronRight class="w-3.5 h-3.5 text-stone-400" />
                </router-link>
              </div>
            </div>

            <!-- 4. À propos -->
            <router-link
              to="/faq-livraison"
              @click="mobileMenuOpen = false"
              class="flex items-center justify-between p-3 rounded-2xl transition-colors font-medium text-sm"
              :class="$route.path === '/faq-livraison' ? 'bg-sky-50 text-sky-700 font-semibold' : 'bg-stone-50 text-stone-800 hover:bg-stone-100'"
            >
              <div class="flex items-center gap-3">
                <Info class="w-4 h-4" :class="$route.path === '/faq-livraison' ? 'text-sky-600' : 'text-stone-500'" />
                <span>À propos & Livraison Dakar</span>
              </div>
              <ChevronRight class="w-4 h-4 text-stone-400" />
            </router-link>

            <!-- 5. Compte & Suivi -->
            <router-link
              to="/orders"
              @click="mobileMenuOpen = false"
              class="flex items-center justify-between p-3 rounded-2xl bg-stone-50 hover:bg-stone-100 transition-colors font-medium text-sm text-stone-800"
            >
              <div class="flex items-center gap-3">
                <User class="w-4 h-4 text-stone-500" />
                <span>Compte & Mes Commandes</span>
              </div>
              <ChevronRight class="w-4 h-4 text-stone-400" />
            </router-link>

            <!-- Admin si autorisé -->
            <router-link
              v-if="authStore.isAdmin"
              to="/admin"
              @click="mobileMenuOpen = false"
              class="flex items-center justify-between p-3 rounded-2xl bg-amber-50 border border-amber-200 font-bold text-sm text-amber-900 transition-colors"
            >
              <div class="flex items-center gap-3">
                <Crown class="w-4 h-4 text-amber-600" />
                <span>Espace Gérance & Stocks</span>
              </div>
              <ChevronRight class="w-4 h-4 text-amber-600" />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  Home,
  Store,
  LayoutGrid,
  Info,
  User,
  ChevronDown,
  ShoppingBag,
  Menu,
  X,
  ChevronRight,
  PackageCheck,
  Crown
} from 'lucide-vue-next';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { useCurrencyStore } from '../stores/currency';
import { usePhoneStore } from '../stores/phone';

const mobileMenuOpen = ref(false);
const cartStore = useCartStore();
const authStore = useAuthStore();
const currencyStore = useCurrencyStore();
const phoneStore = usePhoneStore();
</script>
