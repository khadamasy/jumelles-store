<template>
  <div class="app">
    <a href="#contenu" class="skip">Aller au contenu</a>

    <Navbar v-if="showShell" />

    <main id="contenu" class="app-main">
      <router-view v-slot="{ Component, route: r }">
        <div :key="r.path" class="page-anim">
          <component :is="Component" />
        </div>
      </router-view>
    </main>

    <Footer v-if="showShell" />

    <CartDrawer />

    <!-- Barre de contact (téléphone : en bas ; ordinateur : bulle discrète) -->
    <Transition name="dock">
      <div
        v-if="showDock"
        class="dock"
        :class="{ hide: dockHidden }"
        role="complementary"
        aria-label="Contact direct"
      >
        <a class="dock-call" href="tel:+221772087820">
          <Phone aria-hidden="true" />
          <span>Appeler</span>
        </a>
        <a class="dock-wa" :href="dockWhatsAppUrl" target="_blank" rel="noopener noreferrer">
          <IconWhatsApp className="dock-ic" />
          <span>WhatsApp</span>
        </a>
      </div>
    </Transition>

    <PhoneServiceModal />
    <UiToaster />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { Phone } from 'lucide-vue-next';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import CartDrawer from './components/CartDrawer.vue';
import PhoneServiceModal from './components/PhoneServiceModal.vue';
import UiToaster from './components/ui/UiToaster.vue';
import IconWhatsApp from './components/icons/IconWhatsApp.vue';
import { useAuthStore } from './stores/auth';
import { useCartStore } from './stores/cart';
import { toAbsolutePhotoUrl, buildWhatsAppSendUrl } from './stores/phone';

const route = useRoute();
const authStore = useAuthStore();
const cartStore = useCartStore();
const dockHidden = ref(false);
let lastScrollY = 0;

// L'espace gérance a sa propre interface une fois connecté
const showShell = computed(() => route.path !== '/admin' || !authStore.isAdmin);
// Commande et confirmation ont déjà leurs boutons WhatsApp / appel : pas de doublon
const showDock = computed(() => !['/admin', '/checkout', '/order-success'].includes(route.path));

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

<style scoped>
.app {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}
.app-main {
  flex: 1;
}

.skip {
  position: absolute;
  left: var(--s-3);
  top: -60px;
  z-index: 100;
  padding: 10px 16px;
  border-radius: var(--r-sm);
  background: var(--ink);
  color: var(--on-ink);
  font-weight: 600;
  transition: top var(--dur-2) var(--ease-out);
}
.skip:focus {
  top: var(--s-3);
}

/* ----- Barre de contact ----- */
.dock {
  position: fixed;
  left: 12px;
  right: 12px;
  bottom: calc(10px + env(safe-area-inset-bottom, 0px));
  z-index: var(--z-dock);
  display: flex;
  gap: 6px;
  padding: 6px;
  border-radius: var(--r-lg);
  background: rgb(var(--c-sand-950) / 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgb(255 255 255 / 0.1);
  box-shadow: var(--sh-3);
  transition: transform var(--dur-3) var(--ease-out), opacity var(--dur-3) var(--ease-out);
}
.dock.hide {
  transform: translateY(140%);
}
.dock a {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--s-2);
  min-height: 48px;
  border-radius: var(--r-md);
  font-weight: 600;
  font-size: var(--fs-sm);
  transition: background-color var(--dur-2), transform var(--dur-1);
}
.dock a:active {
  transform: scale(0.97);
}
.dock svg,
.dock :deep(.dock-ic) {
  width: 19px;
  height: 19px;
}
.dock-call {
  color: var(--on-ink);
  background: rgb(255 255 255 / 0.07);
}
.dock-call:hover {
  background: rgb(255 255 255 / 0.12);
}
.dock-wa {
  color: #fff;
  background: var(--wa);
}
.dock-wa:hover {
  background: var(--wa-hover);
}

.dock-enter-active,
.dock-leave-active {
  transition: transform var(--dur-3) var(--ease-out), opacity var(--dur-3) var(--ease-out);
}
.dock-enter-from,
.dock-leave-to {
  opacity: 0;
  transform: translateY(40px);
}

@media (min-width: 720px) {
  .dock {
    left: auto;
    right: 24px;
    bottom: 24px;
    border-radius: var(--r-full);
  }
  .dock a {
    flex: none;
    min-height: 44px;
    padding: 0 18px;
    border-radius: var(--r-full);
  }
}
</style>
