<template>
  <div class="space-y-12 sm:space-y-20 pb-20">
    <!-- 1. Ruban Défilant Haute Couture (Motion Design Marquee) -->
    <div class="bg-stone-950 text-gold-400 border-y border-gold-500/30 py-2.5 overflow-hidden select-none">
      <div class="animate-marquee whitespace-nowrap text-xs font-bold uppercase tracking-[0.25em] flex items-center gap-8">
        <span class="flex items-center gap-2">
          <Sparkles class="w-3.5 h-3.5 text-gold-400" />
          <span>Nouvelle Collection Dakar 2026</span>
        </span>
        <span class="text-stone-600">•</span>
        <span class="flex items-center gap-2">
          <Truck class="w-3.5 h-3.5 text-gold-400" />
          <span>Livraison Express 24h à Domicile</span>
        </span>
        <span class="text-stone-600">•</span>
        <span class="flex items-center gap-2">
          <ShieldCheck class="w-3.5 h-3.5 text-gold-400" />
          <span>Validation Directe sur WhatsApp</span>
        </span>
        <span class="text-stone-600">•</span>
        <span class="flex items-center gap-2">
          <RefreshCw class="w-3.5 h-3.5 text-gold-400" />
          <span>Échange de Pointure Garanti sous 48h</span>
        </span>
        <span class="text-stone-600">•</span>
        <span class="flex items-center gap-2">
          <Award class="w-3.5 h-3.5 text-gold-400" />
          <span>Maison de Maroquinerie Fine & Souliers de Gala</span>
        </span>
        <span class="text-stone-600">•</span>
        <!-- Duplication pour boucle infinie fluide -->
        <span class="flex items-center gap-2">
          <Sparkles class="w-3.5 h-3.5 text-gold-400" />
          <span>Nouvelle Collection Dakar 2026</span>
        </span>
        <span class="text-stone-600">•</span>
        <span class="flex items-center gap-2">
          <Truck class="w-3.5 h-3.5 text-gold-400" />
          <span>Livraison Express 24h à Domicile</span>
        </span>
        <span class="text-stone-600">•</span>
        <span class="flex items-center gap-2">
          <ShieldCheck class="w-3.5 h-3.5 text-gold-400" />
          <span>Validation Directe sur WhatsApp</span>
        </span>
      </div>
    </div>



    <!-- 3. Hero Section Éditoriale Haute Maroquinerie & Souliers -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 text-white rounded-3xl p-6 sm:p-12 lg:p-16 border border-stone-800 shadow-2xl relative overflow-hidden">
        <!-- Glows dorés en arrière-plan -->
        <div class="absolute -top-32 -left-32 w-96 h-96 bg-gold-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          <!-- Colonne Gauche : Titre & Actions -->
          <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/15 border border-gold-400/40 text-gold-300 text-[10px] sm:text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-sm">
              <span class="w-2 h-2 rounded-full bg-gold-400 animate-ping"></span>
              <span>Maison Jumelles • Collection 2026</span>
            </div>

            <h1 class="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              L'Élégance du Sac & la Grâce du Soulier.
            </h1>

            <p class="text-stone-300 text-sm sm:text-base lg:text-lg leading-relaxed font-light max-w-xl mx-auto lg:mx-0">
              Des pièces exclusives de haute maroquinerie au cuir sélectionné et des souliers taillés pour sublimer chaque silhouette à Dakar.
            </p>

            <!-- Boutons Principaux -->
            <div class="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <router-link
                to="/catalog?type=SAC"
                class="px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-stone-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
              >
                <ShoppingBag class="w-4 h-4" />
                <span>Découvrir les Sacs</span>
                <ArrowRight class="w-4 h-4" />
              </router-link>

              <router-link
                to="/catalog?type=CHAUSSURE"
                class="px-6 sm:px-8 py-3.5 sm:py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md font-bold text-xs sm:text-sm rounded-2xl transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
              >
                <span>Voir les Chaussures (37-42)</span>
                <ArrowRight class="w-4 h-4" />
              </router-link>
            </div>

            <!-- Badges de réassurance sobres -->
            <div class="pt-4 border-t border-white/15 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-stone-300">
              <span class="flex items-center gap-2">
                <Truck class="w-3.5 h-3.5 text-gold-400" />
                <span>Livraison 24h Dakar</span>
              </span>
              <span class="flex items-center gap-2">
                <RefreshCw class="w-3.5 h-3.5 text-gold-400" />
                <span>Échange pointure 48h</span>
              </span>
              <span class="flex items-center gap-2">
                <ShieldCheck class="w-3.5 h-3.5 text-gold-400" />
                <span>Confirmation WhatsApp & Livraison 24h</span>
              </span>
            </div>
          </div>

          <!-- Colonne Droite : Vitrine Visuelle Double Produit (Sacs & Souliers) -->
          <div class="lg:col-span-5 grid grid-cols-2 gap-4">
            <!-- Produit 1 : Sac Birkin Camel -->
            <router-link
              to="/product/sac-a-main-birkin-style-camel"
              class="group relative rounded-2xl overflow-hidden bg-stone-900 border border-gold-500/30 shadow-xl aspect-[3/4] flex flex-col justify-end p-4 transition-all hover:-translate-y-1"
            >
              <img
                src="/products/sac-birkin-camel.jpg"
                alt="Sac Birkin Camel"
                class="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent"></div>
              <div class="relative z-10 space-y-1">
                <span class="text-[9px] uppercase tracking-wider text-gold-400 font-bold block">Best-Seller</span>
                <p class="font-serif font-bold text-xs sm:text-sm text-white line-clamp-1">Sac Birkin Camel</p>
                <span class="text-xs font-extrabold text-gold-300 block">15 000 FCFA</span>
              </div>
            </router-link>

            <!-- Produit 2 : Mules Talon Cœur Noir -->
            <router-link
              to="/product/mules-talon-coeur-noir-soiree"
              class="group relative rounded-2xl overflow-hidden bg-stone-900 border border-gold-500/30 shadow-xl aspect-[3/4] flex flex-col justify-end p-4 transition-all hover:-translate-y-1 mt-6"
            >
              <img
                src="/products/mules-talon-coeur-noir.jpg"
                alt="Mules Talon Cœur Noir"
                class="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent"></div>
              <div class="relative z-10 space-y-1">
                <span class="text-[9px] uppercase tracking-wider text-gold-400 font-bold block">Pointures 37-42</span>
                <p class="font-serif font-bold text-xs sm:text-sm text-white line-clamp-1">Mules Talon Cœur Noir</p>
                <span class="text-xs font-extrabold text-gold-300 block">12 000 FCFA</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Piliers de Confiance & Prestige (4 Cartes Modernes) -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200/90 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="flex items-start gap-4 p-3 rounded-2xl hover:bg-stone-50 transition-colors">
          <div class="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-200 text-gold-700 flex items-center justify-center shrink-0 shadow-2xs">
            <Award class="w-6 h-6" />
          </div>
          <div>
            <h4 class="font-serif font-bold text-stone-900 text-sm">Finition Prestige</h4>
            <p class="text-xs text-stone-500 mt-1">Cuir grainé sélectionné et bouclerie dorée inoxydable.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 p-3 rounded-2xl hover:bg-stone-50 transition-colors">
          <div class="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs">
            <Truck class="w-6 h-6" />
          </div>
          <div>
            <h4 class="font-serif font-bold text-stone-900 text-sm">Livraison Express 24h</h4>
            <p class="text-xs text-stone-500 mt-1">À domicile ou au bureau partout à Dakar et banlieue.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 p-3 rounded-2xl hover:bg-stone-50 transition-colors">
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 shadow-2xs p-1">
            <IconWhatsApp className="w-6 h-6 text-[#25D366]" />
          </div>
          <div>
            <h4 class="font-serif font-bold text-stone-900 text-sm">Validation Directe WhatsApp</h4>
            <p class="text-xs text-stone-500 mt-1">Confirmation immédiate avec le détail complet de vos articles.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 p-3 rounded-2xl hover:bg-stone-50 transition-colors">
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
            <RefreshCw class="w-6 h-6" />
          </div>
          <div>
            <h4 class="font-serif font-bold text-stone-900 text-sm">Échange Garanti 48h</h4>
            <p class="text-xs text-stone-500 mt-1">Échange facile de pointure sous 48h de 37 à 42.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. Les Deux Univers Emblématiques (Bannières Haute Couture) -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-xl mx-auto mb-10">
        <span class="text-xs font-bold text-gold-700 uppercase tracking-widest bg-gold-50 px-4 py-1.5 rounded-full border border-gold-200">
          Collections Exclusives 2026
        </span>
        <h2 class="font-serif text-3xl sm:text-4xl font-extrabold text-stone-950 mt-3">
          Maroquinerie Fine & Souliers
        </h2>
        <p class="text-stone-500 text-xs sm:text-sm mt-1.5">
          Choisissez votre univers pour explorer nos pièces en stock immédiat à Dakar.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <!-- Univers Sacs -->
        <router-link
          to="/catalog?type=SAC"
          class="group relative h-[400px] sm:h-[460px] rounded-3xl overflow-hidden shadow-xl flex items-end p-6 sm:p-8 text-white transition-all hover:-translate-y-1.5 border border-stone-200"
        >
          <img
            src="/products/sac-birkin-camel.jpg"
            alt="Collection Sacs Jumelles Store"
            class="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/45 to-transparent"></div>
          <div class="relative z-10 space-y-2">
            <div class="flex items-center gap-2">
              <span class="text-[10px] sm:text-xs uppercase tracking-widest text-gold-400 font-black">Maroquinerie & Cabas</span>
              <span class="px-2.5 py-0.5 rounded-full bg-gold-500 text-stone-950 font-black text-xs shadow">15 000 FCFA</span>
            </div>
            <h3 class="font-serif text-2xl sm:text-3xl font-extrabold">Sacs à Main, Cabas & Pochettes</h3>
            <p class="text-xs sm:text-sm text-stone-300 max-w-md font-light">Cuir grainé effet crocodile, bouclerie dorée luxueuse et chaînettes amovibles.</p>
            <span class="inline-flex items-center gap-2 text-xs font-bold text-gold-400 pt-1 group-hover:underline">
              <span>Explorer la collection Sacs (8 modèles)</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </span>
          </div>
        </router-link>

        <!-- Univers Chaussures -->
        <router-link
          to="/catalog?type=CHAUSSURE"
          class="group relative h-[400px] sm:h-[460px] rounded-3xl overflow-hidden shadow-xl flex items-end p-6 sm:p-8 text-white transition-all hover:-translate-y-1.5 border border-stone-200"
        >
          <img
            src="/products/mules-talon-coeur-noir.jpg"
            alt="Collection Chaussures Jumelles Store"
            class="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/45 to-transparent"></div>
          <div class="relative z-10 space-y-2">
            <div class="flex items-center gap-2">
              <span class="text-[10px] sm:text-xs uppercase tracking-widest text-gold-400 font-black">Souliers & Sandales</span>
              <span class="px-2.5 py-0.5 rounded-full bg-gold-500 text-stone-950 font-black text-xs shadow">12 000 FCFA</span>
            </div>
            <h3 class="font-serif text-2xl sm:text-3xl font-extrabold">Escarpins, Sandales & Mules</h3>
            <p class="text-xs sm:text-sm text-stone-300 max-w-md font-light">Des pointures du 37 au 42 avec un confort de marche incomparable et un galbe parfait.</p>
            <span class="inline-flex items-center gap-2 text-xs font-bold text-gold-400 pt-1 group-hover:underline">
              <span>Choisir ma pointure (37 à 42)</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </span>
          </div>
        </router-link>
      </div>
    </section>

    <!-- 6. Sélection Coups de Cœur avec Filtre Fast-Fashion Instantané -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-stone-200 pb-5">
        <div>
          <span class="text-xs font-bold text-gold-700 uppercase tracking-widest bg-gold-50 px-3 py-1 rounded-full border border-gold-200">
            Articles Disponibles Immédiatement
          </span>
          <h2 class="font-serif text-3xl font-extrabold text-stone-950 mt-2">Nos Pièces Phares du Moment</h2>
        </div>

        <!-- Onglets Filtres Rapides Fast-Fashion -->
        <div class="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl border border-stone-200">
          <button
            @click="activeCategory = 'ALL'"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
            :class="activeCategory === 'ALL' ? 'bg-stone-950 text-white shadow' : 'text-stone-600 hover:text-stone-950'"
          >
            Tous ({{ products.length }})
          </button>
          <button
            @click="activeCategory = 'SAC'"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
            :class="activeCategory === 'SAC' ? 'bg-stone-950 text-white shadow' : 'text-stone-600 hover:text-stone-950'"
          >
            Sacs (8)
          </button>
          <button
            @click="activeCategory = 'CHAUSSURE'"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
            :class="activeCategory === 'CHAUSSURE' ? 'bg-stone-950 text-white shadow' : 'text-stone-600 hover:text-stone-950'"
          >
            Chaussures (5)
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="n in 4" :key="n" class="bg-stone-200 animate-pulse rounded-3xl h-80"></div>
      </div>

      <!-- Products Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in visibleProducts"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- Bouton d'accès au catalogue complet -->
      <div class="text-center pt-10">
        <router-link
          to="/catalog"
          class="inline-flex items-center gap-2.5 px-8 py-4 bg-stone-950 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:scale-95"
        >
          <span>Accéder à Tout le Catalogue ({{ products.length }} Articles)</span>
          <ArrowRight class="w-4 h-4" />
        </router-link>
      </div>
    </section>

    <!-- 7. Témoignages de Clientes Vérifiées à Dakar -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-gradient-to-b from-stone-50 to-stone-100/70 border border-stone-200 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
        <div class="text-center max-w-lg mx-auto space-y-2">
          <span class="text-xs font-bold text-gold-700 uppercase tracking-widest bg-gold-50 px-3.5 py-1 rounded-full border border-gold-200">
            Avis Clientes Vérifiées
          </span>
          <h3 class="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Ce que disent nos clientes à Dakar
          </h3>
          <p class="text-xs sm:text-sm text-stone-500 font-light">
            Des centaines de femmes satisfaites par la qualité de nos cuirs et la rapidité de nos livraisons.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div class="flex items-center text-amber-400 gap-1 text-sm">
              <Star class="w-4 h-4 fill-amber-400" />
              <Star class="w-4 h-4 fill-amber-400" />
              <Star class="w-4 h-4 fill-amber-400" />
              <Star class="w-4 h-4 fill-amber-400" />
              <Star class="w-4 h-4 fill-amber-400" />
            </div>
            <p class="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
              « Le Sac Birkin Camel est tout simplement magnifique. Finition cuir irréprochable et bouclerie lourde. Livré en 3 heures à Dakar Almadies ! »
            </p>
            <div class="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
              <span class="font-bold text-stone-900">Fatou S.</span>
              <span class="text-stone-400">Almadies, Dakar</span>
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div class="flex items-center text-amber-400 gap-1 text-sm">
              <Star class="w-4 h-4 fill-amber-400" />
              <Star class="w-4 h-4 fill-amber-400" />
              <Star class="w-4 h-4 fill-amber-400" />
              <Star class="w-4 h-4 fill-amber-400" />
              <Star class="w-4 h-4 fill-amber-400" />
            </div>
            <p class="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
              « J'avais peur pour la pointure mais les escarpins en 39 taillent parfaitement. Confort incroyable pour danser toute la soirée. »
            </p>
            <div class="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
              <span class="font-bold text-stone-900">Aïssatou D.</span>
              <span class="text-stone-400">Point E, Dakar</span>
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div class="flex items-center text-amber-400 gap-1 text-sm">
              <Star class="w-4 h-4 fill-amber-400" />
              <Star class="w-4 h-4 fill-amber-400" />
              <Star class="w-4 h-4 fill-amber-400" />
              <Star class="w-4 h-4 fill-amber-400" />
              <Star class="w-4 h-4 fill-amber-400" />
            </div>
            <p class="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
              « Commande sur WhatsApp en un clic, confirmée immédiatement. Très professionnel et le packaging est sublime. »
            </p>
            <div class="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
              <span class="font-bold text-stone-900">Mariama B.</span>
              <span class="text-stone-400">Mermoz, Dakar</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 8. Bandeau Commande Rapide via WhatsApp -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 rounded-3xl p-8 sm:p-12 text-white border border-gold-500/30 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
        <div class="space-y-4 max-w-xl text-center lg:text-left">
          <span class="inline-block bg-[#25D366]/20 text-[#25D366] text-xs uppercase tracking-widest font-black px-4 py-1.5 rounded-full border border-[#25D366]/30">
            Commande Facile Sans Paiement en Ligne
          </span>
          <h3 class="font-serif text-2xl sm:text-4xl font-bold leading-tight">
            Validez votre commande directement sur WhatsApp
          </h3>
          <p class="text-stone-300 text-xs sm:text-sm leading-relaxed font-light">
            Sélectionnez vos modèles sur le site : votre commande est directement transmise avec les détails des articles à notre équipe pour convenir de la livraison sous 24h à Dakar. Règlement à la réception.
          </p>
          <div class="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <router-link
              to="/catalog"
              class="px-6 py-3 rounded-full bg-gold-500 hover:bg-gold-600 active:scale-95 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Découvrir la Collection</span>
              <ArrowRight class="w-4 h-4" />
            </router-link>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
          <!-- WhatsApp Card -->
          <a
            href="https://wa.me/221772087820?text=Bonjour%20Maison%20Jumelles%2C%20je%20souhaite%20des%20renseignements%20sur%20vos%20articles."
            target="_blank"
            rel="noopener noreferrer"
            class="bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 p-5 rounded-2xl flex items-center gap-4 w-full sm:w-64 shadow-lg transition-all group"
          >
            <div class="w-12 h-12 rounded-xl bg-[#25D366]/20 flex items-center justify-center shrink-0">
              <IconWhatsApp className="w-8 h-8 text-[#25D366] group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <p class="font-black text-sm text-white">WhatsApp Boutique</p>
              <p class="text-xs text-stone-300 font-mono">+221 77 208 78 20</p>
              <span class="text-[10px] text-[#25D366] font-bold">Réponse rapide • 7j/7</span>
            </div>
          </a>

          <!-- TikTok Card -->
          <a
            href="https://www.tiktok.com/@khadamasy6"
            target="_blank"
            rel="noopener noreferrer"
            class="bg-white/10 hover:bg-white/15 border border-gold-500/40 p-5 rounded-2xl flex items-center gap-4 w-full sm:w-64 shadow-lg transition-all group"
          >
            <div class="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center shrink-0">
              <IconTikTok className="w-7 h-7 text-gold-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <p class="font-black text-sm text-white">TikTok Officiel</p>
              <p class="text-xs text-gold-400 font-mono">@khadamasy6</p>
              <span class="text-[10px] text-stone-300 font-bold">Vidéos des articles →</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  Sparkles,
  Truck,
  ShieldCheck,
  RefreshCw,
  ShoppingBag,
  ArrowRight,
  Award,
  Star,
} from 'lucide-vue-next';
import IconWhatsApp from '../components/icons/IconWhatsApp.vue';
import IconTikTok from '../components/icons/IconTikTok.vue';
import { ProductService } from '../services/api';
import ProductCard from '../components/ProductCard.vue';

const products = ref<any[]>([]);
const loading = ref(true);
const activeCategory = ref<'ALL' | 'SAC' | 'CHAUSSURE'>('ALL');



onMounted(async () => {
  try {
    const res = await ProductService.getAll();
    products.value = res.data.data;
  } catch (error) {
    console.error('Erreur chargement produits:', error);
  } finally {
    loading.value = false;
  }
});

const visibleProducts = computed(() => {
  if (activeCategory.value === 'ALL') return products.value;
  return products.value.filter((p) => {
    const isSac = p.category?.type === 'SAC' || p.categoryId.includes('sac');
    const isShoe = p.category?.type === 'CHAUSSURE' || p.categoryId.includes('shoe');
    if (activeCategory.value === 'SAC') return isSac;
    if (activeCategory.value === 'CHAUSSURE') return isShoe;
    return true;
  });
});
</script>
