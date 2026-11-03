<template>
  <div class="space-y-16 sm:space-y-24 pb-20">
    <!-- Hero Section Haute Couture -->
    <section class="relative bg-stone-950 text-white min-h-[580px] lg:min-h-[680px] flex items-center overflow-hidden">
      <!-- Background Luxury Visual -->
      <div class="absolute inset-0 z-0 opacity-40 mix-blend-luminosity">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=85"
          alt="Jumelles Store Mode Dakar"
          class="w-full h-full object-cover scale-105"
        />
      </div>
      <div class="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/85 to-transparent z-10"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent z-10"></div>

      <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div class="max-w-2xl space-y-7">
          <div class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gold-500/15 border border-gold-400/40 text-gold-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-lg">
            <span class="w-2 h-2 rounded-full bg-gold-400 animate-ping"></span>
            <span>Maison Jumelles Store • Collection Dakar 2026</span>
          </div>

          <h1 class="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            L'Élégance du Sac & la Grâce du Soulier.
          </h1>

          <p class="text-stone-300 text-base sm:text-lg leading-relaxed font-light max-w-xl">
            Haute maroquinerie travaillée avec passion et chaussures d'exception pour sublimer votre allure à chaque événement, cérémonie et rendez-vous à Dakar.
          </p>

          <div class="flex flex-wrap items-center gap-4 pt-2">
            <router-link
              to="/catalog?type=SAC"
              class="px-8 py-4 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-stone-950 font-black text-sm rounded-2xl shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>👜</span>
              <span>Découvrir les Sacs</span>
            </router-link>

            <router-link
              to="/catalog?type=CHAUSSURE"
              class="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md font-bold text-sm rounded-2xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>👠</span>
              <span>Voir les Chaussures</span>
            </router-link>
          </div>

          <!-- Direct Phone & Reassurance Callout -->
          <div class="pt-6 border-t border-white/15 flex flex-wrap items-center gap-6 text-xs text-stone-300">
            <a
              href="tel:+221772087820"
              class="flex items-center gap-2 hover:text-gold-400 transition-colors font-bold"
            >
              <span class="w-7 h-7 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center font-bold text-xs">📞</span>
              <span>Service Vente : +221 77 208 78 20</span>
            </a>
            <div class="flex items-center gap-1.5 text-stone-300">
              <span class="text-emerald-400 font-bold">✓</span> Pointures du 37 au 42
            </div>
            <div class="flex items-center gap-1.5 text-stone-300">
              <span class="text-emerald-400 font-bold">✓</span> Paiements Wave & Orange Money
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4 Piliers de Confiance & Prestige -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-30">
      <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200/90 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="flex items-start gap-3.5">
          <div class="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-200 text-gold-700 flex items-center justify-center text-xl shrink-0 shadow-xs">
            👑
          </div>
          <div>
            <h4 class="font-serif font-bold text-stone-900 text-sm">Finition Prestige</h4>
            <p class="text-xs text-stone-500 mt-0.5">Cuir sélectionné et bouclerie dorée inoxydable.</p>
          </div>
        </div>

        <div class="flex items-start gap-3.5">
          <div class="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center text-xl shrink-0 shadow-xs">
            ⚡
          </div>
          <div>
            <h4 class="font-serif font-bold text-stone-900 text-sm">Livraison Express 24h</h4>
            <p class="text-xs text-stone-500 mt-0.5">À votre domicile ou bureau à Dakar et banlieue.</p>
          </div>
        </div>

        <div class="flex items-start gap-3.5">
          <div class="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center text-xl shrink-0 shadow-xs">
            🌊
          </div>
          <div>
            <h4 class="font-serif font-bold text-stone-900 text-sm">Wave & Orange Money</h4>
            <p class="text-xs text-stone-500 mt-0.5">Règlement mobile sécurisé et direct sans frais.</p>
          </div>
        </div>

        <div class="flex items-start gap-3.5">
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center text-xl shrink-0 shadow-xs">
            👠
          </div>
          <div>
            <h4 class="font-serif font-bold text-stone-900 text-sm">Échange Garanti 48h</h4>
            <p class="text-xs text-stone-500 mt-0.5">Échange de pointure sous 48h en cas de mauvaise taille.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Nos Deux Univers Emblématiques -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-xl mx-auto mb-12">
        <span class="text-xs font-bold text-gold-700 uppercase tracking-widest bg-gold-50 px-4 py-1 rounded-full border border-gold-200">
          Les Collections Exclusives
        </span>
        <h2 class="font-serif text-3xl sm:text-4xl font-extrabold text-stone-950 mt-3">
          Maroquinerie Fine & Souliers de Gala
        </h2>
        <p class="text-stone-500 text-xs sm:text-sm mt-2">
          Explorez nos pièces d'exception disponibles en stock immédiat à Dakar.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Univers Sacs -->
        <router-link
          to="/catalog?type=SAC"
          class="group relative h-[440px] rounded-3xl overflow-hidden shadow-xl flex items-end p-8 text-white transition-all hover:-translate-y-1.5 border border-stone-200"
        >
          <img
            src="/products/sac-birkin-camel.jpg"
            alt="Collection Sacs Jumelles Store"
            class="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/45 to-transparent"></div>
          <div class="relative z-10 space-y-2.5">
            <div class="flex items-center gap-2">
              <span class="text-xs uppercase tracking-widest text-gold-400 font-black">Maroquinerie & Cabas</span>
              <span class="px-2.5 py-0.5 rounded-full bg-gold-500 text-stone-950 font-black text-xs shadow">15 000 FCFA</span>
            </div>
            <h3 class="font-serif text-2xl sm:text-3xl font-extrabold">Sacs à Main, Cabas & Pochettes</h3>
            <p class="text-xs sm:text-sm text-stone-300 max-w-md font-light">Cuir grainé effet crocodile, bouclerie dorée luxueuse et chaînettes amovibles.</p>
            <span class="inline-flex items-center gap-2 text-xs font-bold text-gold-400 pt-1 group-hover:underline">
              Explorer tous les sacs (8 modèles) →
            </span>
          </div>
        </router-link>

        <!-- Univers Chaussures -->
        <router-link
          to="/catalog?type=CHAUSSURE"
          class="group relative h-[440px] rounded-3xl overflow-hidden shadow-xl flex items-end p-8 text-white transition-all hover:-translate-y-1.5 border border-stone-200"
        >
          <img
            src="/products/mules-talon-coeur-noir.jpg"
            alt="Collection Chaussures Jumelles Store"
            class="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/45 to-transparent"></div>
          <div class="relative z-10 space-y-2.5">
            <div class="flex items-center gap-2">
              <span class="text-xs uppercase tracking-widest text-gold-400 font-black">Souliers & Sandales</span>
              <span class="px-2.5 py-0.5 rounded-full bg-gold-500 text-stone-950 font-black text-xs shadow">12 000 FCFA</span>
            </div>
            <h3 class="font-serif text-2xl sm:text-3xl font-extrabold">Escarpins, Sandales & Mules</h3>
            <p class="text-xs sm:text-sm text-stone-300 max-w-md font-light">Des pointures du 37 au 42 avec un confort de marche incomparable et un galbe parfait.</p>
            <span class="inline-flex items-center gap-2 text-xs font-bold text-gold-400 pt-1 group-hover:underline">
              Choisir ma pointure (37 à 42) →
            </span>
          </div>
        </router-link>
      </div>
    </section>

    <!-- Featured Products Section avec Filtre d'Univers Direct -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-stone-200 pb-5">
        <div>
          <span class="text-xs font-bold text-gold-700 uppercase tracking-widest bg-gold-50 px-3 py-0.5 rounded-full border border-gold-200">
            Sélection Préférée de nos Clientes
          </span>
          <h2 class="font-serif text-3xl font-extrabold text-stone-950 mt-2">Nos Pièces Phares du Moment</h2>
        </div>

        <!-- Onglets Filtres Rapides Accueil -->
        <div class="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl border border-stone-200">
          <button
            @click="activeCategory = 'ALL'"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all"
            :class="activeCategory === 'ALL' ? 'bg-stone-950 text-white shadow' : 'text-stone-600 hover:text-stone-950'"
          >
            Tous ({{ products.length }})
          </button>
          <button
            @click="activeCategory = 'SAC'"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all"
            :class="activeCategory === 'SAC' ? 'bg-stone-950 text-white shadow' : 'text-stone-600 hover:text-stone-950'"
          >
            👜 Sacs
          </button>
          <button
            @click="activeCategory = 'CHAUSSURE'"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all"
            :class="activeCategory === 'CHAUSSURE' ? 'bg-stone-950 text-white shadow' : 'text-stone-600 hover:text-stone-950'"
          >
            👠 Chaussures
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

      <div class="text-center pt-10">
        <router-link
          to="/catalog"
          class="inline-flex items-center gap-2 px-8 py-4 bg-stone-950 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all"
        >
          <span>Accéder à Tout le Catalogue ({{ products.length }} Articles)</span>
          <span>→</span>
        </router-link>
      </div>
    </section>

    <!-- Wave & Orange Money & Assistance Banner -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 rounded-3xl p-8 sm:p-14 text-white border border-gold-500/30 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10">
        <div class="space-y-5 max-w-xl text-center lg:text-left">
          <span class="inline-block bg-gold-500/20 text-gold-400 text-xs uppercase tracking-widest font-black px-4 py-1.5 rounded-full border border-gold-400/30">
            Achat Simplifié Sans Carte Bancaire
          </span>
          <h3 class="font-serif text-2xl sm:text-4xl font-bold leading-tight">
            Réglez instantanément avec Wave ou Orange Money
          </h3>
          <p class="text-stone-300 text-sm leading-relaxed font-light">
            Validez votre commande en quelques secondes via votre téléphone. Notre service logistique prépare et expédie immédiatement votre colis à Dakar ou dans les régions.
          </p>
          <div class="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <a
              href="tel:+221772087820"
              class="px-5 py-3 rounded-2xl bg-white/10 border border-white/20 text-xs font-bold text-white hover:bg-white/20 transition-all flex items-center gap-2 shadow"
            >
              <span>📞</span> Appeler : +221 77 208 78 20
            </a>
            <a
              href="https://wa.me/221772087820?text=Bonjour%20Jumelles%20Store%2C%20je%20souhaite%20commander%20un%20article"
              target="_blank"
              class="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-all flex items-center gap-2 shadow-lg"
            >
              <span>💬</span> Écrire sur WhatsApp
            </a>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-4 shrink-0">
          <div class="bg-blue-600/10 backdrop-blur-md border border-blue-500/30 p-5 rounded-2xl flex items-center gap-4 w-52 shadow-lg">
            <span class="text-4xl">🌊</span>
            <div>
              <p class="font-black text-sm text-white">Wave</p>
              <p class="text-xs text-blue-300">Paiement 0% frais</p>
            </div>
          </div>
          <div class="bg-orange-600/10 backdrop-blur-md border border-orange-500/30 p-5 rounded-2xl flex items-center gap-4 w-52 shadow-lg">
            <span class="text-4xl">🍊</span>
            <div>
              <p class="font-black text-sm text-white">Orange Money</p>
              <p class="text-xs text-orange-300">Validation code OTP / #144#</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
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
