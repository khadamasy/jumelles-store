<template>
  <footer class="bg-gradient-to-b from-stone-900 to-stone-950 text-stone-300 pt-16 pb-10 border-t border-stone-800">
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
            La référence sénégalaise du chic et de l'élégance : sacs à main luxueux, pochettes de gala et chaussures haut de gamme taillées sur-mesure pour sublimer chaque silhouette.
          </p>
          <div class="flex flex-wrap gap-2 pt-1">
            <span class="text-[11px] bg-stone-800/80 text-stone-300 px-3 py-1 rounded-full border border-stone-700/60">📍 Dakar, Sénégal</span>
            <span class="text-[11px] bg-stone-800/80 text-stone-300 px-3 py-1 rounded-full border border-stone-700/60">⚡ Livraison Express 24h</span>
          </div>
        </div>

        <!-- Univers Sacs -->
        <div>
          <h4 class="font-serif text-white font-bold mb-4 text-base tracking-wide flex items-center gap-2">
            <span>👜</span> Collection Sacs
          </h4>
          <ul class="space-y-2.5 text-sm text-stone-400">
            <li><router-link to="/catalog?category=sacs-a-main" class="hover:text-gold-400 transition-colors">Sacs Cabas & Sacs Portés Main</router-link></li>
            <li><router-link to="/catalog?category=pochettes-bandoulieres" class="hover:text-gold-400 transition-colors">Pochettes Bijou de Gala</router-link></li>
            <li><router-link to="/catalog?type=SAC" class="hover:text-gold-400 transition-colors">Cuir Effet Croco & Finitions Dorées</router-link></li>
            <li><router-link to="/catalog?type=SAC" class="hover:text-gold-400 transition-colors">Bandoulières & Sacs Compacts</router-link></li>
          </ul>
        </div>

        <!-- Univers Chaussures -->
        <div>
          <h4 class="font-serif text-white font-bold mb-4 text-base tracking-wide flex items-center gap-2">
            <span>👠</span> Collection Chaussures
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
              class="flex items-center gap-3 p-3 rounded-xl bg-stone-800/60 border border-stone-700/80 hover:border-gold-500/50 transition-colors group"
            >
              <div class="w-9 h-9 rounded-lg bg-gold-500/10 text-gold-400 flex items-center justify-center font-bold text-base group-hover:bg-gold-500 group-hover:text-stone-950 transition-colors">
                📞
              </div>
              <div>
                <p class="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">Téléphone / Assistance</p>
                <p class="text-sm font-bold text-white group-hover:text-gold-400 transition-colors">+221 77 208 78 20</p>
              </div>
            </a>

            <!-- WhatsApp Direct -->
            <a
              href="https://wa.me/221772087820?text=Bonjour%20Jumelles%20Store%2C%20je%20souhaite%20commander%20un%20article"
              target="_blank"
              class="flex items-center gap-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 hover:bg-emerald-900/40 transition-colors group"
            >
              <div class="w-9 h-9 rounded-lg bg-emerald-500 text-stone-950 flex items-center justify-center font-bold text-base">
                💬
              </div>
              <div>
                <p class="text-[11px] text-emerald-400 uppercase tracking-wider font-semibold">WhatsApp Boutique</p>
                <p class="text-xs font-bold text-white">Commander via WhatsApp (77 208 78 20)</p>
              </div>
            </a>
          </div>

          <!-- Moyens de paiement -->
          <div class="pt-2">
            <p class="text-xs text-stone-400 mb-2 font-medium">Paiements 100% sécurisés :</p>
            <div class="flex items-center gap-2">
              <span class="bg-blue-600/20 border border-blue-500/40 text-blue-400 px-3 py-1 rounded-md text-xs font-bold">
                🌊 Wave
              </span>
              <span class="bg-orange-600/20 border border-orange-500/40 text-orange-400 px-3 py-1 rounded-md text-xs font-bold">
                🍊 Orange Money
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Credits -->
      <div class="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-4">
        <p>© 2026 Jumelles Store Dakar. Tous droits réservés.</p>
        <p class="text-stone-500">Maroquinerie d'exception & Souliers sur-mesure</p>
      </div>
    </div>
  </footer>
</template>
