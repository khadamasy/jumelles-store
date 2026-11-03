<template>
  <footer class="bg-gradient-to-b from-stone-900 to-stone-950 text-stone-300 pt-12 pb-10 border-t border-stone-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 pb-12 border-b border-stone-800/80">
        <!-- Brand Info -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center text-gold-400 border border-gold-500/40 shadow-lg">
              <span class="font-serif font-black text-2xl">J</span>
            </div>
            <div>
              <span class="font-serif font-bold text-xl tracking-wider text-white block">JUMELLES STORE</span>
              <span class="text-[10px] tracking-[0.25em] text-gold-500 font-bold block uppercase">Maison de Maroquinerie</span>
            </div>
          </div>
          <p class="text-sm text-stone-400 leading-relaxed font-light">
            La référence dakaroise du chic et de l'élégance : sacs à main luxueux, pochettes de gala et chaussures haut de gamme taillées sur-mesure pour sublimer chaque silhouette.
          </p>
          <div class="flex flex-wrap gap-2 pt-1">
            <span class="inline-flex items-center gap-1.5 text-[11px] bg-stone-800/80 text-stone-300 px-3 py-1 rounded-full border border-stone-700/60">
              <MapPin class="w-3 h-3 text-gold-400" />
              <span>Dakar, Sénégal</span>
            </span>
            <span class="inline-flex items-center gap-1.5 text-[11px] bg-stone-800/80 text-stone-300 px-3 py-1 rounded-full border border-stone-700/60">
              <Truck class="w-3 h-3 text-gold-400" />
              <span>Livraison Express 24h</span>
            </span>
          </div>
        </div>

        <!-- Univers Collections (Vrais Liens) -->
        <div>
          <h4 class="font-serif text-white font-bold mb-4 text-base tracking-wide flex items-center gap-2">
            <ShoppingBag class="w-4 h-4 text-gold-400" />
            <span>Collections</span>
          </h4>
          <ul class="space-y-2.5 text-sm text-stone-400">
            <li><router-link to="/catalog?type=SAC" class="hover:text-gold-400 transition-colors">Sacs Cabas & Portés Main</router-link></li>
            <li><router-link to="/catalog?category=pochettes-bandoulieres" class="hover:text-gold-400 transition-colors">Pochettes Bijou de Gala</router-link></li>
            <li><router-link to="/catalog?type=CHAUSSURE" class="hover:text-gold-400 transition-colors">Escarpins & Souliers (37-42)</router-link></li>
            <li><router-link to="/catalog?category=sandales-mules" class="hover:text-gold-400 transition-colors">Sandales & Mules Dorées</router-link></li>
            <li><router-link to="/catalog" class="hover:text-gold-400 transition-colors text-xs font-bold text-gold-500">Voir tout le catalogue →</router-link></li>
          </ul>
        </div>

        <!-- Section Légal (Conforme à la maquette fournie) -->
        <div>
          <h4 class="text-white font-bold mb-4 text-base tracking-wide flex items-center gap-2">
            <ShieldCheck class="w-4 h-4 text-sky-400" />
            <span>Légal</span>
          </h4>
          <ul class="space-y-3 text-sm text-stone-400">
            <li>
              <router-link
                to="/conditions-utilisation"
                class="flex items-center gap-2.5 hover:text-white transition-colors group"
              >
                <FileText class="w-4 h-4 text-stone-400 group-hover:text-sky-400 transition-colors shrink-0" />
                <span>Conditions d'utilisation</span>
              </router-link>
            </li>
            <li>
              <router-link
                to="/politique-confidentialite"
                class="flex items-center gap-2.5 hover:text-white transition-colors group"
              >
                <Lock class="w-4 h-4 text-stone-400 group-hover:text-sky-400 transition-colors shrink-0" />
                <span>Politique de confidentialité</span>
              </router-link>
            </li>
            <li>
              <router-link
                to="/faq-livraison"
                class="flex items-center gap-2.5 hover:text-white transition-colors group text-xs text-stone-400"
              >
                <HelpCircle class="w-4 h-4 text-stone-400 group-hover:text-gold-400 transition-colors shrink-0" />
                <span>Guide de livraison Dakar</span>
              </router-link>
            </li>
          </ul>
        </div>


      </div>

      <!-- Bottom Credits -->
      <div class="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-4">
        <p>© 2026 Jumelles Store Dakar. Tous droits réservés.</p>
        <div class="flex flex-wrap items-center justify-center gap-4 text-xs">
          <router-link to="/faq-livraison" class="text-gold-400 hover:text-gold-300 font-bold transition-colors">
            FAQ & Guide de Livraison Dakar
          </router-link>
          <span>•</span>
          <router-link to="/orders" class="text-stone-400 hover:text-gold-400 transition-colors">
            Suivi de Commande
          </router-link>
          <span>•</span>
          <router-link to="/catalog" class="text-stone-400 hover:text-gold-400 transition-colors">
            Tout le Catalogue
          </router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import {
  MapPin,
  Truck,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  FileText,
  Lock,
  HelpCircle,
} from 'lucide-vue-next';
</script>
