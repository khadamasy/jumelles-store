<template>
  <div class="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-gold-200">
    <Navbar />
    
    <main class="flex-1">
      <router-view />
    </main>

    <CartDrawer />
    <Footer />

    <!-- Bouton Flottant WhatsApp Officiel Jumelles Store (+221 77 208 78 20) -->
    <a
      href="https://wa.me/221772087820?text=Bonjour%20Jumelles%20Store%2C%20je%20souhaite%20commander%20ou%20avoir%20des%20informations%20sur%20un%20article."
      target="_blank"
      class="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 transition-all transform hover:scale-105 group border-2 border-white/60 animate-bounce"
      title="Contactez Jumelles Store sur WhatsApp : +221 77 208 78 20"
    >
      <span class="text-2xl">💬</span>
      <span class="hidden sm:inline font-bold text-xs tracking-wide">
        WhatsApp (77 208 78 20)
      </span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import CartDrawer from './components/CartDrawer.vue';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();

onMounted(() => {
  // Initialisation Keycloak SSO non-bloquante
  authStore.initKeycloak();
});
</script>
