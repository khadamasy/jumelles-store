<template>
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all shadow-xs">
    <!-- Top Bar Élégante : Assistance & WhatsApp Dakar -->
    <div class="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-stone-200 text-xs py-2 px-4 border-b border-gold-500/20">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span class="font-serif tracking-wider font-bold text-gold-400 text-[11px] sm:text-xs">JUMELLES STORE DAKAR</span>
          <span class="hidden md:inline text-stone-400 text-[11px]">• Maison de Maroquinerie Fine & Souliers de Gala</span>
        </div>

        <div class="flex items-center gap-3 sm:gap-5 text-[11px]">
          <a
            href="tel:+221772087820"
            class="flex items-center gap-1.5 text-stone-300 hover:text-gold-400 transition-colors font-medium"
            title="Appel direct service client"
          >
            <IconPhoneSolid className="w-3.5 h-3.5 text-[#e02f75]" />
            <span class="font-mono font-bold">+221 77 208 78 20</span>
          </a>

          <a
            href="https://wa.me/221772087820?text=Bonjour%20Jumelles%20Store%2C%20je%20souhaite%20des%20informations%20sur%20vos%20articles"
            target="_blank"
            class="flex items-center gap-1.5 text-white font-bold bg-[#25D366] hover:bg-[#20ba59] px-2.5 py-0.5 rounded-full transition-colors shadow-xs"
          >
            <IconWhatsApp className="w-3.5 h-3.5 text-white" />
            <span class="hidden sm:inline">WhatsApp Direct</span>
            <span class="sm:hidden">WhatsApp</span>
          </a>

          <span class="hidden lg:inline text-gold-500/90 font-semibold">• Wave & Orange Money</span>
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

        <!-- Desktop Navigation Links (Vrais Liens) -->
        <nav class="hidden md:flex items-center space-x-7 text-xs lg:text-sm font-semibold">
          <router-link
            to="/"
            class="text-stone-700 hover:text-gold-700 transition-colors py-1 relative"
            active-class="text-gold-700 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gold-600"
          >
            Accueil
          </router-link>
          <router-link
            to="/catalog?type=SAC"
            class="text-stone-700 hover:text-gold-700 transition-colors py-1 relative flex items-center gap-1.5"
            active-class="text-gold-700 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gold-600"
          >
            <span>Sacs & Cabas</span>
          </router-link>
          <router-link
            to="/catalog?type=CHAUSSURE"
            class="text-stone-700 hover:text-gold-700 transition-colors py-1 relative flex items-center gap-1.5"
            active-class="text-gold-700 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gold-600"
          >
            <span>Chaussures (37-42)</span>
          </router-link>
          <router-link
            to="/catalog"
            class="text-stone-700 hover:text-gold-700 transition-colors py-1 relative"
            active-class="text-gold-700 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gold-600"
          >
            Tout le Catalogue
          </router-link>
          <router-link
            to="/faq-livraison"
            class="text-stone-700 hover:text-gold-700 transition-colors py-1 relative flex items-center gap-1"
            active-class="text-gold-700 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gold-600"
          >
            <span>FAQ Livraison</span>
          </router-link>
          <router-link
            v-if="authStore.isAdmin"
            to="/admin"
            class="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold px-3.5 py-1.5 rounded-full text-xs shadow hover:from-amber-600 hover:to-amber-700 transition-all flex items-center gap-1.5"
          >
            <span>Gérance</span>
          </router-link>
        </nav>

        <!-- Right Actions (Currency Switcher, User Dropdown, Cart) -->
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

          <!-- User / Auth Dropdown -->
          <div class="relative group">
            <button
              class="flex items-center gap-1.5 text-stone-700 hover:text-stone-950 p-2 sm:p-2.5 rounded-xl hover:bg-stone-100 transition-all border border-stone-200/60"
              aria-label="Mon compte"
            >
              <User class="w-4 h-4 text-stone-800" />
              <span v-if="authStore.isAuthenticated" class="text-xs font-bold hidden xl:inline max-w-[100px] truncate text-stone-900">
                {{ authStore.userName }}
              </span>
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
                  <span>📦</span> Mes Commandes
                </router-link>

                <router-link v-if="authStore.isAdmin" to="/admin" class="flex items-center gap-2 px-4 py-2 text-xs font-bold text-amber-800 hover:bg-amber-50">
                  <span>⚙️</span> Tableau de bord & Stocks
                </router-link>
              </div>

              <!-- Switch roles for instant test -->
              <div class="px-4 py-2 border-t border-stone-100 space-y-1.5 bg-stone-50/50">
                <p class="text-[10px] uppercase tracking-wider text-stone-400 font-bold mb-1">Basculer de profil test :</p>
                <button
                  @click="authStore.loginAsDemoAdmin"
                  class="w-full text-left text-xs text-amber-900 hover:bg-amber-100/70 p-1.5 rounded-lg flex items-center justify-between font-bold"
                >
                  <span>👑 Mode Gérance</span>
                  <span class="text-[10px] text-amber-600">Admin</span>
                </button>
                <button
                  @click="authStore.loginAsDemoClient"
                  class="w-full text-left text-xs text-blue-900 hover:bg-blue-100/70 p-1.5 rounded-lg flex items-center justify-between font-semibold"
                >
                  <span>👤 Mode Cliente</span>
                  <span class="text-[10px] text-blue-600">Acheter</span>
                </button>
              </div>

              <div v-if="authStore.isAuthenticated" class="border-t border-stone-100 mt-1 pt-1">
                <button @click="authStore.logout" class="w-full text-left px-4 py-2 text-xs font-semibold text-rosewood-600 hover:bg-rosewood-50">
                  Déconnexion
                </button>
              </div>
            </div>
          </div>

          <!-- Shopping Cart Button -->
          <button
            @click="cartStore.toggleDrawer(true)"
            class="relative p-2.5 sm:px-4 sm:py-2.5 bg-stone-900 hover:bg-gold-600 text-white rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 active:scale-95"
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

    <!-- Mobile Drawer Menu (Mobile First UI/UX) -->
    <div
      v-if="mobileMenuOpen"
      class="md:hidden fixed inset-0 top-[110px] bg-stone-950/70 backdrop-blur-md z-40 transition-all animate-in fade-in"
      @click.self="mobileMenuOpen = false"
    >
      <div class="bg-white border-b border-stone-200 shadow-2xl p-6 space-y-6 max-h-[calc(100vh-110px)] overflow-y-auto">
        <div class="space-y-1">
          <p class="text-[10px] font-bold uppercase tracking-widest text-gold-700">Collections Maison Jumelles</p>
          <div class="grid grid-cols-1 gap-2 pt-2">
            <router-link
              to="/"
              @click="mobileMenuOpen = false"
              class="flex items-center justify-between p-3 rounded-2xl bg-stone-50 hover:bg-gold-50 font-serif font-bold text-stone-900 transition-colors"
            >
              <span>Accueil</span>
              <ChevronRight class="w-4 h-4 text-stone-400" />
            </router-link>

            <router-link
              to="/catalog?type=SAC"
              @click="mobileMenuOpen = false"
              class="flex items-center justify-between p-3 rounded-2xl bg-stone-50 hover:bg-gold-50 font-serif font-bold text-stone-900 transition-colors"
            >
              <span>👜 Maroquinerie & Sacs de Luxe</span>
              <ChevronRight class="w-4 h-4 text-stone-400" />
            </router-link>

            <router-link
              to="/catalog?type=CHAUSSURE"
              @click="mobileMenuOpen = false"
              class="flex items-center justify-between p-3 rounded-2xl bg-stone-50 hover:bg-gold-50 font-serif font-bold text-stone-900 transition-colors"
            >
              <span>👠 Chaussures & Souliers (37-42)</span>
              <ChevronRight class="w-4 h-4 text-stone-400" />
            </router-link>

            <router-link
              to="/catalog"
              @click="mobileMenuOpen = false"
              class="flex items-center justify-between p-3 rounded-2xl bg-stone-50 hover:bg-gold-50 font-serif font-bold text-stone-900 transition-colors"
            >
              <span>✨ Tout le Catalogue (13 Pièces)</span>
              <ChevronRight class="w-4 h-4 text-stone-400" />
            </router-link>

            <router-link
              to="/faq-livraison"
              @click="mobileMenuOpen = false"
              class="flex items-center justify-between p-3 rounded-2xl bg-stone-50 hover:bg-gold-50 font-serif font-bold text-stone-900 transition-colors"
            >
              <div class="flex items-center gap-2.5">
                <HelpCircle class="w-4 h-4 text-gold-600" />
                <span>FAQ & Délais de Livraison Dakar</span>
              </div>
              <ChevronRight class="w-4 h-4 text-stone-400" />
            </router-link>

            <router-link
              to="/orders"
              @click="mobileMenuOpen = false"
              class="flex items-center justify-between p-3 rounded-2xl bg-stone-50 hover:bg-gold-50 font-serif font-bold text-stone-900 transition-colors"
            >
              <div class="flex items-center gap-2.5">
                <PackageCheck class="w-4 h-4 text-gold-600" />
                <span>Suivi de Commande</span>
              </div>
              <ChevronRight class="w-4 h-4 text-stone-400" />
            </router-link>

            <router-link
              v-if="authStore.isAdmin"
              to="/admin"
              @click="mobileMenuOpen = false"
              class="flex items-center justify-between p-3 rounded-2xl bg-amber-50 border border-amber-200 font-serif font-bold text-amber-900 transition-colors"
            >
              <div class="flex items-center gap-2.5">
                <Crown class="w-4 h-4 text-amber-600" />
                <span>Espace Gérance & Stocks</span>
              </div>
              <ChevronRight class="w-4 h-4 text-amber-600" />
            </router-link>
          </div>
        </div>

        <!-- Contact Rapide Mobile avec vrais icones -->
        <div class="pt-2 border-t border-stone-100 space-y-2">
          <p class="text-[10px] font-bold uppercase tracking-widest text-stone-400">Assistance Clientèle 7j/7</p>
          <div class="grid grid-cols-2 gap-2">
            <a
              href="tel:+221772087820"
              class="py-3 px-3 rounded-full bg-stone-950 text-white font-bold text-xs flex items-center justify-center gap-2 border border-[#d7b966]"
            >
              <IconPhoneSolid className="w-3.5 h-3.5 text-[#e02f75]" />
              <span>Appeler</span>
            </a>
            <a
              href="https://wa.me/221772087820?text=Bonjour%20Jumelles%20Store"
              target="_blank"
              class="py-3 px-3 rounded-full bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
            >
              <IconWhatsApp className="w-4 h-4 text-white" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronRight,
  HelpCircle,
  PackageCheck,
  Crown
} from 'lucide-vue-next';
import IconWhatsApp from './icons/IconWhatsApp.vue';
import IconPhoneSolid from './icons/IconPhoneSolid.vue';
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
