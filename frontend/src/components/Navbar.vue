<template>
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all shadow-sm">
    <!-- Top Announcement Bar avec Numéro Officiel & WhatsApp -->
    <div class="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-stone-200 text-xs py-2 px-4 border-b border-gold-500/20">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span class="font-medium text-gold-400">JUMELLES STORE DAKAR</span>
          <span class="hidden sm:inline text-stone-400">• Sacs de luxe & Souliers haute maroquinerie</span>
        </div>

        <div class="flex items-center gap-4 text-[11px]">
          <a
            href="tel:+221772087820"
            class="flex items-center gap-1.5 text-stone-300 hover:text-gold-400 transition-colors font-medium"
          >
            <span>📞</span>
            <span>+221 77 208 78 20</span>
          </a>

          <a
            href="https://wa.me/221772087820?text=Bonjour%20Jumelles%20Store%2C%20je%20souhaite%20des%20informations"
            target="_blank"
            class="hidden md:flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-full transition-colors"
          >
            <span>💬</span> WhatsApp Direct
          </a>

          <span class="hidden lg:inline text-gold-500 font-semibold">• Paiements Wave & Orange Money</span>
        </div>
      </div>
    </div>

    <!-- Main Navigation Bar -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        <!-- Brand Logo -->
        <router-link to="/" class="flex items-center gap-3.5 group">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950 flex items-center justify-center text-gold-400 border border-gold-500/40 shadow-md group-hover:scale-105 group-hover:border-gold-400 transition-all">
            <span class="font-serif font-black text-2xl tracking-tighter">J</span>
          </div>
          <div>
            <span class="font-serif font-extrabold text-2xl tracking-wider text-stone-950 block leading-none">
              JUMELLES
            </span>
            <div class="flex items-center gap-1.5 mt-1">
              <span class="text-[9px] tracking-[0.3em] text-gold-700 font-black uppercase">
                STORE
              </span>
              <span class="text-[8px] bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded font-semibold tracking-wider">
                SACS & SOULIERS
              </span>
            </div>
          </div>
        </router-link>

        <!-- Navigation Links -->
        <nav class="hidden md:flex items-center space-x-8 text-sm font-semibold">
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
            <span>👜</span> Sacs & Cabas
          </router-link>
          <router-link
            to="/catalog?type=CHAUSSURE"
            class="text-stone-700 hover:text-gold-700 transition-colors py-1 relative flex items-center gap-1.5"
            active-class="text-gold-700 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gold-600"
          >
            <span>👠</span> Chaussures & Escarpins
          </router-link>
          <router-link
            to="/catalog"
            class="text-stone-700 hover:text-gold-700 transition-colors py-1 relative"
            active-class="text-gold-700 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gold-600"
          >
            Tout le Catalogue
          </router-link>
          <router-link
            v-if="authStore.isAdmin"
            to="/admin"
            class="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold px-3.5 py-1.5 rounded-full text-xs shadow hover:from-amber-600 hover:to-amber-700 transition-all flex items-center gap-1.5"
          >
            <span>⚙️</span> Espace Gérance
          </router-link>
        </nav>

        <!-- Actions (Search, Account, Cart) -->
        <div class="flex items-center space-x-3 sm:space-x-4">
          <!-- User / Auth Dropdown -->
          <div class="relative group">
            <button class="flex items-center gap-2 text-stone-700 hover:text-stone-950 p-2.5 rounded-2xl hover:bg-stone-100 transition-all border border-stone-200/60">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-stone-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span v-if="authStore.isAuthenticated" class="text-xs font-bold hidden lg:inline max-w-[110px] truncate text-stone-900">
                {{ authStore.userName }}
              </span>
            </button>

            <!-- Dropdown Menu -->
            <div class="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-stone-200 py-3 hidden group-hover:block transition-all z-50 animate-fadeIn">
              <div v-if="authStore.isAuthenticated" class="px-4 py-2 border-b border-stone-100">
                <p class="text-[11px] text-stone-400">Compte actif</p>
                <p class="text-sm font-bold text-stone-900 truncate">{{ authStore.userName }}</p>
                <span
                  class="inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md"
                  :class="authStore.isAdmin ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-blue-100 text-blue-800 border border-blue-300'"
                >
                  {{ authStore.isAdmin ? '👑 Direction / Admin' : '👤 Client Particulier' }}
                </span>
              </div>

              <div class="py-1">
                <router-link v-if="authStore.isAuthenticated" to="/orders" class="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50">
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
                  <span>👑 Mode Administratrice</span>
                  <span class="text-[10px] text-amber-600">Gérer stocks</span>
                </button>
                <button
                  @click="authStore.loginAsDemoClient"
                  class="w-full text-left text-xs text-blue-900 hover:bg-blue-100/70 p-1.5 rounded-lg flex items-center justify-between font-semibold"
                >
                  <span>👤 Mode Cliente (Awa)</span>
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
            class="relative p-2.5 bg-stone-900 hover:bg-gold-600 text-white rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span class="hidden sm:inline text-xs font-bold pr-1">Panier</span>
            <span
              v-if="cartStore.totalItems > 0"
              class="bg-gold-400 text-stone-950 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow"
            >
              {{ cartStore.totalItems }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';

const cartStore = useCartStore();
const authStore = useAuthStore();
</script>
