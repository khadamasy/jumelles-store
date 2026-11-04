<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />

    <main class="flex-1">
      <router-view />
    </main>

    <CartDrawer />
    <Footer />

    <div
      v-if="$route.path !== '/admin'"
      class="dock"
      :class="{ hide: dockHidden }"
      id="dock"
      role="complementary"
      aria-label="Contact direct"
    >
      <a class="call" href="tel:+221772087820">
        <svg viewBox="0 0 24 24">
          <path
            d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11 11 0 0 0 3.5.56 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.4.56 3.5a1 1 0 0 1-.25 1z"
          />
        </svg>
        Appeler
      </a>
      <a
        class="wa"
        :href="dockWhatsAppUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg viewBox="0 0 24 24">
          <path
            d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.2 14.3c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.8-.1 1.4z"
          />
        </svg>
        WhatsApp
      </a>
    </div>

    <PhoneServiceModal />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import CartDrawer from './components/CartDrawer.vue';
import PhoneServiceModal from './components/PhoneServiceModal.vue';
import { useAuthStore } from './stores/auth';
import { useCartStore } from './stores/cart';
import { toAbsolutePhotoUrl, buildWhatsAppSendUrl } from './stores/phone';

const authStore = useAuthStore();
const cartStore = useCartStore();
const dockHidden = ref(false);
let lastScrollY = 0;

const dockWhatsAppUrl = computed(() => {
  if (cartStore.items.length > 0) {
    const firstPhoto = toAbsolutePhotoUrl(cartStore.items[0]?.imageUrl);
    const summary = cartStore.items
      .map((i) => {
        const photoUrl = toAbsolutePhotoUrl(i.imageUrl);
        return `${i.productName} (${i.color} / ${i.sizeOrShoeSize} x${i.quantity})${photoUrl ? `\nPhoto : ${photoUrl}` : ''}`;
      })
      .join('\n\n');
    const msg = `${firstPhoto ? firstPhoto + '\n\n' : ''}Bonjour Jumelles Store, je souhaite commander par téléphone l'article suivant : Panier Jumelles Store: ${summary} - Total: ${cartStore.formattedSubtotal}`;
    return buildWhatsAppSendUrl(msg);
  }
  return buildWhatsAppSendUrl('Bonjour Jumelles Store, je souhaite commander.');
});

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
