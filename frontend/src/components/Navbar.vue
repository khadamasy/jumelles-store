<template>
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all">
    <!-- Top Announcement Bar -->
    <div class="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-stone-200 text-xs py-2 px-4 text-center tracking-widest uppercase flex items-center justify-center gap-2">
      <span>✨ Nouvelle Collection Sacs Croco & Escarpins Jumelles Store ✨</span>
      <span class="hidden md:inline text-gold-400 font-semibold">• Paiement instantané Wave & Orange Money</span>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-3 group">
          <div class="w-11 h-11 rounded-full bg-stone-900 flex items-center justify-center text-gold-400 border border-gold-500/40 shadow-sm group-hover:scale-105 transition-transform">
            <span class="font-serif font-bold text-xl">J</span>
          </div>
          <div>
            <span class="font-serif font-bold text-2xl tracking-wider text-stone-900 block leading-tight">
              JUMELLES
            </span>
            <span class="text-[10px] tracking-[0.25em] text-gold-600 font-semibold uppercase block">
              STORE • DAKAR
            </span>
          </div>
        </router-link>

        <!-- Navigation Links -->
        <nav class="hidden md:flex items-center space-x-8 text-sm font-medium">
          <router-link to="/" class="text-stone-700 hover:text-gold-600 transition-colors" active-class="text-gold-600 font-semibold">
            Accueil
          </router-link>
          <router-link to="/catalog?type=SAC" class="text-stone-700 hover:text-gold-600 transition-colors" active-class="text-gold-600 font-semibold">
            👜 Sacs & Cabas
          </router-link>
          <router-link to="/catalog?type=CHAUSSURE" class="text-stone-700 hover:text-gold-600 transition-colors" active-class="text-gold-600 font-semibold">
            👠 Chaussures & Escarpins
          </router-link>
          <router-link to="/catalog" class="text-stone-700 hover:text-gold-600 transition-colors" active-class="text-gold-600 font-semibold">
            Tout le Catalogue
          </router-link>
          <router-link v-if="authStore.isAdmin" to="/admin" class="bg-amber-50 text-amber-800 border border-amber-300 px-3 py-1 rounded-full text-xs font-semibold hover:bg-amber-100 transition-colors">
            ⚙️ Espace Admin
          </router-link>
        </nav>

        <!-- Actions (Search, Account, Cart) -->
        <div class="flex items-center space-x-4">
          <!-- User / Auth -->
          <div class="relative group">
            <button class="flex items-center gap-2 text-stone-700 hover:text-stone-900 p-2 rounded-full hover:bg-stone-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span v-if="authStore.isAuthenticated" class="text-xs font-medium hidden lg:inline max-w-[100px] truncate">
                {{ authStore.userName }}
              </span>
            </button>

            <!-- Dropdown Menu -->
            <div class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-2 hidden group-hover:block transition-all z-50">
              <div v-if="authStore.isAuthenticated" class="px-4 py-2 border-b border-stone-100">
                <p class="text-xs text-stone-500">Connecté en tant que</p>
                <p class="text-sm font-semibold text-stone-900 truncate">{{ authStore.userName }}</p>
                <span class="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded" :class="authStore.isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'">
                  {{ authStore.isAdmin ? 'Administrateur' : 'Client' }}
                </span>
              </div>

              <router-link v-if="authStore.isAuthenticated" to="/orders" class="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">
                📦 Mes Commandes
              </router-link>

              <router-link v-if="authStore.isAdmin" to="/admin" class="block px-4 py-2 text-sm text-amber-700 font-medium hover:bg-amber-50">
                📊 Tableau de bord Admin
              </router-link>

              <div v-if="!authStore.isAuthenticated" class="px-4 py-2 space-y-2">
                <p class="text-xs text-stone-500 mb-1">Authentification :</p>
                <button @click="authStore.loginAsDemoClient" class="w-full text-left text-xs text-blue-700 hover:bg-blue-50 p-1.5 rounded flex items-center gap-1.5">
                  👤 Démo Client (Awa Diop)
                </button>
                <button @click="authStore.loginAsDemoAdmin" class="w-full text-left text-xs text-amber-800 hover:bg-amber-50 p-1.5 rounded flex items-center gap-1.5 font-medium">
                  👑 Démo Admin (Directrice)
                </button>
                <button @click="authStore.loginKeycloak" class="w-full mt-2 bg-stone-900 text-white text-xs py-1.5 rounded hover:bg-stone-800 transition">
                  Connexion Keycloak SSO
                </button>
              </div>

              <div v-if="authStore.isAuthenticated" class="border-t border-stone-100 mt-1 pt-1">
                <button @click="authStore.logout" class="w-full text-left px-4 py-2 text-sm text-rosewood-600 hover:bg-rosewood-50">
                  Déconnexion
                </button>
              </div>
            </div>
          </div>

          <!-- Cart Button -->
          <button @click="cartStore.toggleDrawer(true)" class="relative p-2 text-stone-700 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span v-if="cartStore.totalItems > 0" class="absolute -top-1 -right-1 bg-gold-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
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
