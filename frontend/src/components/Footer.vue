<template>
  <footer class="bg-gradient-to-b from-stone-900 to-stone-950 text-stone-300 pt-12 pb-10 border-t border-stone-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-stone-800/80">
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

        <!-- Univers Sacs (Vrais Liens) -->
        <div>
          <h4 class="font-serif text-white font-bold mb-4 text-base tracking-wide flex items-center gap-2">
            <ShoppingBag class="w-4 h-4 text-gold-400" />
            <span>Collection Sacs</span>
          </h4>
          <ul class="space-y-2.5 text-sm text-stone-400">
            <li><router-link to="/catalog?category=sacs-a-main" class="hover:text-gold-400 transition-colors">Sacs Cabas & Portés Main</router-link></li>
            <li><router-link to="/catalog?category=pochettes-bandoulieres" class="hover:text-gold-400 transition-colors">Pochettes Bijou de Gala</router-link></li>
            <li><router-link to="/catalog?type=SAC" class="hover:text-gold-400 transition-colors">Cuir Effet Croco & Finitions Dorées</router-link></li>
            <li><router-link to="/catalog?type=SAC" class="hover:text-gold-400 transition-colors">Bandoulières & Sacs Compacts</router-link></li>
          </ul>
        </div>

        <!-- Univers Chaussures (Vrais Liens) -->
        <div>
          <h4 class="font-serif text-white font-bold mb-4 text-base tracking-wide flex items-center gap-2">
            <Sparkles class="w-4 h-4 text-gold-400" />
            <span>Collection Chaussures</span>
          </h4>
          <ul class="space-y-2.5 text-sm text-stone-400">
            <li><router-link to="/catalog?category=escarpins-talons" class="hover:text-gold-400 transition-colors">Escarpins Stiletto 10cm</router-link></li>
            <li><router-link to="/catalog?category=sandales-mules" class="hover:text-gold-400 transition-colors">Sandales Dorées & Nu-Pieds</router-link></li>
            <li><router-link to="/catalog?category=sneakers-femme" class="hover:text-gold-400 transition-colors">Sneakers Urbaines Métallisées</router-link></li>
            <li><router-link to="/catalog?type=CHAUSSURE" class="hover:text-gold-400 transition-colors">Pointures disponibles : 37 à 42</router-link></li>
          </ul>
        </div>

        <!-- Contact & Service Client Direct -->
        <div class="space-y-4">
          <h4 class="font-serif text-white font-bold mb-4 text-base tracking-wide">Commandes & Service Client</h4>
          
          <div class="space-y-3">
            <!-- Numéro Officiel -->
            <a
              href="tel:+221772087820"
              class="flex items-center gap-3 p-3 rounded-2xl bg-stone-850 border border-stone-700/80 hover:border-gold-500/50 transition-colors group"
            >
              <div class="w-9 h-9 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center font-bold text-base group-hover:bg-gold-500 group-hover:text-stone-950 transition-colors">
                <IconPhoneSolid className="w-4 h-4 text-[#e02f75]" />
              </div>
              <div>
                <p class="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">Téléphone Direct</p>
                <p class="text-sm font-bold text-white group-hover:text-gold-400 transition-colors">+221 77 208 78 20</p>
              </div>
            </a>

            <!-- WhatsApp Direct -->
            <a
              href="https://wa.me/221772087820?text=Bonjour%20Jumelles%20Store%2C%20je%20souhaite%20commander%20un%20article"
              target="_blank"
              class="flex items-center gap-3 p-3 rounded-2xl bg-[#0f3d26]/40 border border-emerald-500/40 hover:bg-[#0f3d26]/70 transition-colors group"
            >
              <div class="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center font-bold text-base shadow-sm">
                <IconWhatsApp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p class="text-[11px] text-emerald-400 uppercase tracking-wider font-semibold">WhatsApp Boutique</p>
                <p class="text-xs font-bold text-white">Commander via WhatsApp (77 208 78 20)</p>
              </div>
            </a>
          </div>

          <!-- Moyens de paiement avec les vrais logos officiels -->
          <div class="pt-2">
            <p class="text-xs text-stone-400 mb-2 font-medium">Paiements 100% sécurisés :</p>
            <div class="flex items-center gap-2.5">
              <span class="inline-flex items-center gap-1.5 bg-sky-950/60 border border-cyan-500/40 text-cyan-300 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs">
                <IconWave className="w-4 h-4 shrink-0 rounded" />
                <span>Wave Sénégal</span>
              </span>
              <span class="inline-flex items-center gap-1.5 bg-orange-950/60 border border-orange-500/40 text-orange-300 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs">
                <IconOrangeMoney className="w-4 h-4 shrink-0 rounded" />
                <span>Orange Money</span>
              </span>
            </div>
          </div>
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
} from 'lucide-vue-next';
import IconWhatsApp from './icons/IconWhatsApp.vue';
import IconPhoneSolid from './icons/IconPhoneSolid.vue';
import IconWave from './icons/IconWave.vue';
import IconOrangeMoney from './icons/IconOrangeMoney.vue';
</script>
