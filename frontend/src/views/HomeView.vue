<template>
  <div class="space-y-20 pb-20">
    <!-- Hero Section Haute Couture -->
    <section class="relative bg-stone-950 text-white min-h-[580px] lg:min-h-[660px] flex items-center overflow-hidden">
      <!-- Background Luxury Visual -->
      <div class="absolute inset-0 z-0 opacity-40 mix-blend-luminosity">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=85"
          alt="Jumelles Store Mode Dakar"
          class="w-full h-full object-cover scale-105"
        />
      </div>
      <div class="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/85 to-transparent z-10"></div>
      <div class="absolute inset-0 bg-radial-gradient from-transparent to-stone-950/60 z-10"></div>

      <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="max-w-2xl space-y-7">
          <div class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gold-500/15 border border-gold-400/40 text-gold-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
            <span>✨</span>
            <span>Maison Jumelles Store • Collection Exclusive 2026</span>
          </div>

          <h1 class="font-serif text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            L'Excellence du Sac & la Grâce du Soulier.
          </h1>

          <p class="text-stone-300 text-base sm:text-lg leading-relaxed font-light">
            Découvrez nos pièces de haute maroquinerie travaillées au millimètre et nos chaussures d'exception conçues pour sublimer chacune de vos apparitions à Dakar et au-delà.
          </p>

          <div class="flex flex-wrap items-center gap-4 pt-3">
            <router-link
              to="/catalog?type=SAC"
              class="px-8 py-4 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-stone-950 font-black text-sm rounded-2xl shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              👜 Découvrir les Sacs de Luxe
            </router-link>

            <router-link
              to="/catalog?type=CHAUSSURE"
              class="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md font-bold text-sm rounded-2xl transition-all transform hover:-translate-y-0.5"
            >
              👠 Choisir sa Paire de Chaussures
            </router-link>
          </div>

          <!-- Direct Phone & WhatsApp Callout -->
          <div class="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-stone-300">
            <a
              href="tel:+221772087820"
              class="flex items-center gap-2 hover:text-gold-400 transition-colors font-bold"
            >
              <span class="w-6 h-6 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center">📞</span>
              <span>Commandes : +221 77 208 78 20</span>
            </a>
            <div class="flex items-center gap-2">
              <span class="text-gold-400">✔</span> Pointures 37 à 42
            </div>
            <div class="flex items-center gap-2">
              <span class="text-gold-400">✔</span> Paiements Wave & Orange Money
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Nos Deux Univers Emblématiques -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-xl mx-auto mb-14">
        <span class="text-xs font-bold text-gold-700 uppercase tracking-widest bg-gold-50 px-3.5 py-1 rounded-full border border-gold-200">
          Les Collections Jumelles Store
        </span>
        <h2 class="font-serif text-3xl sm:text-4xl font-extrabold text-stone-950 mt-3">
          Maroquinerie Fine & Souliers Prestigieux
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Univers Sacs -->
        <router-link
          to="/catalog?type=SAC"
          class="group relative h-[420px] rounded-3xl overflow-hidden shadow-xl flex items-end p-8 text-white transition-all hover:-translate-y-1 border border-stone-200"
        >
          <img
            src="/products/sac-birkin-camel.jpg"
            alt="Collection Sacs Jumelles Store"
            class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent"></div>
          <div class="relative z-10 space-y-2">
            <span class="text-xs uppercase tracking-widest text-gold-400 font-black">Maroquinerie & Cabas</span>
            <h3 class="font-serif text-2xl sm:text-3xl font-extrabold">Sacs à Main, Cabas & Pochettes</h3>
            <p class="text-sm text-stone-300 max-w-md font-light">Cuir grainé effet crocodile, bouclerie dorée luxueuse et chaînettes amovibles.</p>
            <span class="inline-flex items-center gap-2 text-xs font-bold text-gold-400 pt-2 group-hover:underline">
              Explorer tous les sacs →
            </span>
          </div>
        </router-link>

        <!-- Univers Chaussures -->
        <router-link
          to="/catalog?type=CHAUSSURE"
          class="group relative h-[420px] rounded-3xl overflow-hidden shadow-xl flex items-end p-8 text-white transition-all hover:-translate-y-1 border border-stone-200"
        >
          <img
            src="/products/mules-talon-coeur-noir.jpg"
            alt="Collection Chaussures Jumelles Store"
            class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent"></div>
          <div class="relative z-10 space-y-2">
            <span class="text-xs uppercase tracking-widest text-gold-400 font-black">Souliers & Sandales</span>
            <h3 class="font-serif text-2xl sm:text-3xl font-extrabold">Escarpins, Sandales & Sneakers</h3>
            <p class="text-sm text-stone-300 max-w-md font-light">Des pointures du 37 au 42 avec un confort de marche incomparable et un galbe parfait.</p>
            <span class="inline-flex items-center gap-2 text-xs font-bold text-gold-400 pt-2 group-hover:underline">
              Choisir ma pointure →
            </span>
          </div>
        </router-link>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4 border-b border-stone-200 pb-5">
        <div>
          <span class="text-xs font-bold text-gold-700 uppercase tracking-widest">Sélection de la Directrice</span>
          <h2 class="font-serif text-3xl font-extrabold text-stone-950 mt-1">Nos Pièces Phares du Moment</h2>
        </div>
        <router-link
          to="/catalog"
          class="text-xs font-bold text-stone-800 hover:text-gold-700 transition-colors flex items-center gap-1.5 uppercase tracking-wider"
        >
          Voir l'intégralité du catalogue ({{ products.length }}) →
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="n in 4" :key="n" class="bg-stone-200 animate-pulse rounded-3xl h-80"></div>
      </div>

      <!-- Products Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
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
              class="px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <span>📞</span> Appeler : +221 77 208 78 20
            </a>
            <a
              href="https://wa.me/221772087820?text=Bonjour%20Jumelles%20Store%2C%20je%20souhaite%20commander%20un%20article"
              target="_blank"
              class="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-all flex items-center gap-2 shadow-lg"
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
              <p class="text-xs text-orange-300">Validation code OTP</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ProductService } from '../services/api';
import ProductCard from '../components/ProductCard.vue';

const products = ref<any[]>([]);
const loading = ref(true);

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
</script>
