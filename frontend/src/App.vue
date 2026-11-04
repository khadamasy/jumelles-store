<template>
  <div class="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-gold-200 pb-20 md:pb-0">
    <Navbar />

    <main class="flex-1">
      <router-view />
    </main>

    <CartDrawer />
    <Footer />

    <!-- Barre de contact fixe mobile-first (Appeler + WhatsApp) avec masquage intelligent au défilement -->
    <div
      v-if="$route.path !== '/admin'"
      role="complementary"
      aria-label="Contact direct"
      class="fixed left-3 right-3 md:left-auto md:right-6 md:min-w-[360px] bottom-[calc(10px+env(safe-area-inset-bottom,0px))] z-35 flex gap-2 bg-stone-950/95 backdrop-blur-md border border-white/15 rounded-[22px] p-2 shadow-2xl transition-transform duration-300"
      :class="dockHidden ? 'translate-y-[140%]' : 'translate-y-0'"
    >
      <a
        href="tel:+221772087820"
        class="flex-1 min-h-[48px] rounded-[15px] bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
      >
        <IconPhoneSolid className="w-5 h-5 text-gold-400" />
        <span>Appeler</span>
      </a>
      <a
        href="https://wa.me/221772087820?text=Bonjour%20Jumelles%20Store%2C%20je%20souhaite%20commander."
        target="_blank"
        rel="noopener noreferrer"
        class="flex-1 min-h-[48px] rounded-[15px] bg-[#1f9d55] hover:bg-[#198246] active:scale-95 text-[#08140d] font-bold text-sm flex items-center justify-center gap-2 transition-all"
      >
        <IconWhatsApp className="w-5 h-5 text-[#08140d]" />
        <span>WhatsApp</span>
      </a>
    </div>

    <!-- Modal Téléphonique Interactif -->
    <PhoneServiceModal />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import CartDrawer from './components/CartDrawer.vue';
import PhoneServiceModal from './components/PhoneServiceModal.vue';
import IconPhoneSolid from './components/icons/IconPhoneSolid.vue';
import IconWhatsApp from './components/icons/IconWhatsApp.vue';
import { useAuthStore } from './stores/auth';
import { usePhoneStore } from './stores/phone';

const authStore = useAuthStore();
const phoneStore = usePhoneStore();
const dockHidden = ref(false);
let lastScrollY = 0;

const handleScroll = () => {
  const y = window.scrollY;
  if (y > lastScrollY + 8 && y > 400 && window.innerWidth < 720) {
    dockHidden.value = true;
  } else if (y < lastScrollY - 8) {
    dockHidden.value = false;
  }
  lastScrollY = y;
};

onMounted(() => {
  authStore.initKeycloak();
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
