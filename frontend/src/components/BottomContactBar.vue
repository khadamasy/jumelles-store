<template>
  <!-- Barre d'Action Rapide Simple & Épurée en bas des pages (Mobile & Desktop) -->
  <aside
    aria-label="Contact direct par téléphone et WhatsApp"
    class="fixed bottom-3 inset-x-3 sm:bottom-4 sm:right-5 sm:left-auto z-40 flex items-center justify-center transition-all duration-300 pointer-events-none"
  >
    <div
      class="pointer-events-auto bg-stone-950/95 backdrop-blur-md p-2 sm:p-2.5 rounded-full border border-gold-500/40 shadow-2xl flex items-center gap-2 max-w-full sm:max-w-none"
    >
      <!-- Bouton 1 : Appel (77 208 78 20) -->
      <a
        href="tel:+221772087820"
        class="group flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-stone-900 hover:bg-stone-850 active:scale-95 text-white font-bold text-xs sm:text-sm border border-gold-400/80 hover:border-gold-300 transition-all shadow-md shrink-0 cursor-pointer"
        title="Appeler le 77 208 78 20"
      >
        <Phone class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-400 group-hover:rotate-12 transition-transform" />
        <span class="tracking-wide whitespace-nowrap">Appel (77 208 78 20)</span>
      </a>

      <!-- Bouton 2 : WhatsApp (77 208 78 20) -->
      <a
        :href="whatsappUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="group flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md shrink-0 cursor-pointer"
        title="Écrire sur WhatsApp au 77 208 78 20"
      >
        <MessageCircle class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover:scale-110 transition-transform" />
        <span class="tracking-wide whitespace-nowrap">WhatsApp (77 208 78 20)</span>
      </a>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Phone, MessageCircle } from 'lucide-vue-next';

const whatsappUrl = computed(() => {
  const msg = encodeURIComponent("Bonjour Jumelles Store, je souhaite avoir des informations ou passer une commande.");
  return `https://wa.me/221772087820?text=${msg}`;
});
</script>
