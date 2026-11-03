<template>
  <div class="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-gold-200">
    <Navbar />
    
    <main class="flex-1 pb-16 sm:pb-0">
      <router-view />
    </main>

    <CartDrawer />
    <Footer />

    <!-- Barre d'action rapide contact simple en bas des pages -->
    <BottomContactBar />

    <!-- Modal Téléphonique Interactif -->
    <PhoneServiceModal />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import CartDrawer from './components/CartDrawer.vue';
import BottomContactBar from './components/BottomContactBar.vue';
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
