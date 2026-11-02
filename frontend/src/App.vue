<template>
  <div class="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-gold-200">
    <Navbar />
    
    <main class="flex-1">
      <router-view />
    </main>

    <CartDrawer />
    <Footer />

    <!-- Boutons Flottants Téléphonie & WhatsApp Jumelles Store (+221 77 208 78 20) -->
    <div class="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
      <!-- Bouton Téléphone Direct -->
      <button
        @click="phoneStore.openModal()"
        class="bg-stone-900 hover:bg-gold-600 text-white p-3 sm:px-4 sm:py-2.5 rounded-full shadow-2xl flex items-center gap-2 transition-all transform hover:scale-105 border-2 border-gold-400/60 shadow-gold-900/20"
        title="Appeler ou commander par téléphone : +221 77 208 78 20"
      >
        <span class="text-xl">📞</span>
        <span class="hidden sm:inline font-bold text-xs tracking-wide">
          Appel (77 208 78 20)
        </span>
      </button>

      <!-- Bouton WhatsApp -->
      <button
        @click="phoneStore.openWhatsApp()"
        class="bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 transition-all transform hover:scale-105 group border-2 border-white/60 animate-bounce"
        title="Discuter sur WhatsApp : +221 77 208 78 20"
      >
        <span class="text-2xl">💬</span>
        <span class="hidden sm:inline font-bold text-xs tracking-wide">
          WhatsApp (77 208 78 20)
        </span>
      </button>
    </div>

    <!-- Modal Téléphonique Interactif -->
    <PhoneServiceModal />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import CartDrawer from './components/CartDrawer.vue';
import PhoneServiceModal from './components/PhoneServiceModal.vue';
import { useAuthStore } from './stores/auth';
import { usePhoneStore } from './stores/phone';

const authStore = useAuthStore();
const phoneStore = usePhoneStore();

onMounted(() => {
  // Initialisation Keycloak SSO non-bloquante
  authStore.initKeycloak();
});
</script>
