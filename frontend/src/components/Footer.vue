<template>
  <footer class="bg-[#17110e] text-[#f6ece0] py-8 mt-6">
    <div class="max-w-[1080px] mx-auto px-4 md:px-7 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-6 md:gap-8">
      <!-- Colonne 1 : Marque & Réseaux Sociaux (TikTok en bas du site) -->
      <div class="space-y-3">
        <div class="font-serif font-bold text-[22px] tracking-[0.14em] text-[#f6ece0]">
          JUMELLES
        </div>
        <p class="text-[#bfb1a3] text-[13px] leading-relaxed max-w-sm">
          Sacs et chaussures à Dakar. Ouvert 7j/7, de 08h à 22h.
        </p>

        <!-- Icône TikTok officielle en bas du site -->
        <div id="social" aria-label="Réseaux sociaux" class="flex flex-wrap gap-2.5 pt-1">
          <a
            href="https://www.tiktok.com/@khadamasy6"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok @khadamasy6"
            title="Suivez-nous sur TikTok @khadamasy6"
            class="inline-flex items-center gap-2 px-3.5 h-11 rounded-xl border border-white/20 hover:border-[#d9ad5c] text-[#f6ece0] hover:text-[#d9ad5c] transition-colors"
          >
            <IconTikTok className="w-5 h-5" />
            <span class="text-xs font-semibold">TikTok @khadamasy6</span>
          </a>
        </div>
      </div>

      <!-- Colonne 2 : Boutique -->
      <div>
        <h4 class="font-sans font-bold text-xs tracking-[0.2em] uppercase text-[#d9ad5c] mb-2">
          Boutique
        </h4>
        <div class="flex flex-col text-sm">
          <router-link to="/catalog?type=SAC" class="py-1.5 text-[#e7dccf] hover:text-[#d9ad5c] transition-colors">
            Sacs
          </router-link>
          <router-link to="/catalog?category=pochettes-matelassees" class="py-1.5 text-[#e7dccf] hover:text-[#d9ad5c] transition-colors">
            Pochettes
          </router-link>
          <router-link to="/catalog?type=CHAUSSURE" class="py-1.5 text-[#e7dccf] hover:text-[#d9ad5c] transition-colors">
            Chaussures
          </router-link>
          <router-link to="/catalog?category=sandales-plates" class="py-1.5 text-[#e7dccf] hover:text-[#d9ad5c] transition-colors">
            Sandales
          </router-link>
        </div>
      </div>

      <!-- Colonne 3 : Aide -->
      <div>
        <h4 class="font-sans font-bold text-xs tracking-[0.2em] uppercase text-[#d9ad5c] mb-2">
          Aide
        </h4>
        <div class="flex flex-col text-sm">
          <router-link to="/orders" class="py-1.5 text-[#e7dccf] hover:text-[#d9ad5c] transition-colors">
            Suivre ma commande
          </router-link>
          <router-link to="/faq-livraison" class="py-1.5 text-[#e7dccf] hover:text-[#d9ad5c] transition-colors">
            Livraison et échanges
          </router-link>
          <router-link to="/conditions-utilisation" class="py-1.5 text-[#e7dccf] hover:text-[#d9ad5c] transition-colors">
            Conditions
          </router-link>
          <router-link to="/politique-confidentialite" class="py-1.5 text-[#e7dccf] hover:text-[#d9ad5c] transition-colors">
            Confidentialité
          </router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import IconTikTok from './icons/IconTikTok.vue';
</script>
