<template>
  <!-- Barre d'Action Rapide Simple & Épurée en bas des pages (Mobile & Desktop) -->
  <aside
    aria-label="Contact direct par téléphone et WhatsApp"
    class="fixed bottom-3 inset-x-3 sm:bottom-5 sm:right-6 sm:left-auto z-40 flex items-center justify-center transition-all duration-300 pointer-events-none"
  >
    <div
      class="pointer-events-auto bg-stone-950/95 backdrop-blur-md p-2 sm:p-2.5 rounded-full border border-gold-500/50 shadow-2xl flex items-center gap-2 max-w-full sm:max-w-none"
    >
      <!-- Bouton 1 : Appel (77 208 78 20) -->
      <a
        href="tel:+221772087820"
        class="group flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-stone-900 hover:bg-stone-850 active:scale-95 text-white font-bold text-xs sm:text-sm border border-[#d7b966]/90 hover:border-gold-300 transition-all shadow-md shrink-0 cursor-pointer"
        title="Appeler le 77 208 78 20"
      >
        <IconPhoneSolid className="w-4 h-4 text-[#e02f75] group-hover:rotate-12 transition-transform" />
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
        <IconWhatsApp className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
        <span class="tracking-wide whitespace-nowrap">WhatsApp (77 208 78 20)</span>
      </a>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import IconWhatsApp from './icons/IconWhatsApp.vue';
import IconPhoneSolid from './icons/IconPhoneSolid.vue';

const whatsappUrl = computed(() => {
  const msg = encodeURIComponent("Bonjour Jumelles Store, je souhaite avoir des informations ou passer une commande.");
  return `https://wa.me/221772087820?text=${msg}`;
});
</script>

