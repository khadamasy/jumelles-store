<template>
  <footer class="bg-stone-900 text-stone-300 pt-16 pb-8 border-t border-stone-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-stone-800">
        <!-- Brand Info -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-gold-400 border border-gold-500/30">
              <span class="font-serif font-bold text-lg">J</span>
            </div>
            <span class="font-serif font-bold text-xl tracking-wider text-white">JUMELLES STORE</span>
          </div>
          <p class="text-sm text-stone-400 leading-relaxed">
            Votre destination d'exception pour les sacs de haute maroquinerie et les chaussures haut de gamme. L'élégance africaine sublimée.
          </p>
          <div class="flex items-center gap-3 text-stone-400">
            <span class="text-xs bg-stone-800 px-3 py-1 rounded-full border border-stone-700">Dakar, Sénégal</span>
            <span class="text-xs bg-stone-800 px-3 py-1 rounded-full border border-stone-700">Livraison Express</span>
          </div>
        </div>

        <!-- Univers Sacs -->
        <div>
          <h4 class="font-serif text-white font-semibold mb-4 text-base tracking-wide">Univers Sacs</h4>
          <ul class="space-y-2.5 text-sm">
            <li><router-link to="/catalog?category=sacs-a-main" class="hover:text-gold-400 transition-colors">Sacs à main & Cabas</router-link></li>
            <li><router-link to="/catalog?category=pochettes-bandoulieres" class="hover:text-gold-400 transition-colors">Pochettes de soirée</router-link></li>
            <li><router-link to="/catalog?type=SAC" class="hover:text-gold-400 transition-colors">Maroquinerie Croco</router-link></li>
            <li><router-link to="/catalog?type=SAC" class="hover:text-gold-400 transition-colors">Sacs bandoulières</router-link></li>
          </ul>
        </div>

        <!-- Univers Chaussures -->
        <div>
          <h4 class="font-serif text-white font-semibold mb-4 text-base tracking-wide">Univers Chaussures</h4>
          <ul class="space-y-2.5 text-sm">
            <li><router-link to="/catalog?category=escarpins-talons" class="hover:text-gold-400 transition-colors">Escarpins & Talons</router-link></li>
            <li><router-link to="/catalog?category=sandales-mules" class="hover:text-gold-400 transition-colors">Sandales & Mules d'été</router-link></li>
            <li><router-link to="/catalog?category=sneakers-femme" class="hover:text-gold-400 transition-colors">Baskets & Sneakers chic</router-link></li>
            <li><router-link to="/catalog?type=CHAUSSURE" class="hover:text-gold-400 transition-colors">Pointures du 36 au 45</router-link></li>
          </ul>
        </div>

        <!-- Paiements & Contact -->
        <div class="space-y-4">
          <h4 class="font-serif text-white font-semibold mb-4 text-base tracking-wide">Paiements Sécurisés</h4>
          <p class="text-xs text-stone-400 leading-relaxed">
            Réglez vos commandes en toute sécurité et instantanément via les leaders du paiement mobile :
          </p>
          <div class="flex items-center gap-3">
            <div class="bg-blue-600/20 border border-blue-500/40 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <span>🌊</span> Wave
            </div>
            <div class="bg-orange-600/20 border border-orange-500/40 text-orange-400 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <span>🍊</span> Orange Money
            </div>
          </div>
          <div class="pt-2 text-xs text-stone-500">
            <p>Service client : +221 77 000 00 00</p>
            <p>Email : contact@jumelles-store.com</p>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-4">
        <p>© 2026 Jumelles Store. Tous droits réservés.</p>
        <p class="text-stone-400">Architecture : Vue.js 3 • Node.js • Keycloak • MinIO • PostgreSQL</p>
      </div>
    </div>
  </footer>
</template>
