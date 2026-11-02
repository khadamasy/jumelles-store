<template>
  <div class="space-y-20 pb-20">
    <!-- Hero Section -->
    <section class="relative bg-stone-900 text-white min-h-[550px] lg:min-h-[620px] flex items-center overflow-hidden">
      <!-- Background pattern/image overlay -->
      <div class="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=80"
          alt="Jumelles Store Mode"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/80 to-transparent z-10"></div>

      <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="max-w-2xl space-y-6">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300 text-xs font-semibold uppercase tracking-wider">
            <span>✨ Nouvelle Collection Exclusive 2026</span>
          </div>

          <h1 class="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            L'Élégance Absolue à Vos Pieds et à Vos Côtés.
          </h1>

          <p class="text-stone-300 text-base sm:text-lg leading-relaxed font-light">
            Découvrez la maroquinerie de prestige et les souliers d'exception de <strong class="text-white font-medium">Jumelles Store</strong>. Des créations raffinées qui rehaussent votre prestance en toute occasion.
          </p>

          <div class="flex flex-wrap items-center gap-4 pt-4">
            <router-link
              to="/catalog?type=SAC"
              class="px-7 py-3.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-stone-950 font-semibold text-sm rounded-xl shadow-lg transition-all"
            >
              👜 Découvrir les Sacs
            </router-link>

            <router-link
              to="/catalog?type=CHAUSSURE"
              class="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md font-semibold text-sm rounded-xl transition-all"
            >
              👠 Explorer les Chaussures
            </router-link>
          </div>

          <!-- Reassurance Mini Badges -->
          <div class="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-stone-400">
            <div class="flex items-center gap-2">
              <span class="text-gold-400">✔</span> Cuir & Finitions Luxe
            </div>
            <div class="flex items-center gap-2">
              <span class="text-gold-400">✔</span> Paiements Wave & OM
            </div>
            <div class="flex items-center gap-2">
              <span class="text-gold-400">✔</span> Livraison Dakar & Régions
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Univers Highlights -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-xl mx-auto mb-12">
        <p class="text-xs font-semibold text-gold-600 uppercase tracking-widest">Nos Deux Univers</p>
        <h2 class="font-serif text-3xl font-bold text-stone-900 mt-2">Maroquinerie & Chaussures</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Univers Sacs -->
        <router-link
          to="/catalog?type=SAC"
          class="group relative h-[380px] rounded-3xl overflow-hidden shadow-md flex items-end p-8 text-white transition-transform hover:-translate-y-1"
        >
          <img
            src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80"
            alt="Collection Sacs Jumelles Store"
            class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent"></div>
          <div class="relative z-10 space-y-2">
            <span class="text-xs uppercase tracking-widest text-gold-400 font-semibold">Maroquinerie Fine</span>
            <h3 class="font-serif text-2xl sm:text-3xl font-bold">Sacs à Main, Cabas & Pochettes</h3>
            <p class="text-sm text-stone-300 max-w-md">Effet crocodile, cuir véritable et fermoirs bijou étincelants.</p>
            <span class="inline-flex items-center gap-2 text-xs font-semibold text-gold-400 pt-2 group-hover:underline">
              Voir toute la maroquinerie →
            </span>
          </div>
        </router-link>

        <!-- Univers Chaussures -->
        <router-link
          to="/catalog?type=CHAUSSURE"
          class="group relative h-[380px] rounded-3xl overflow-hidden shadow-md flex items-end p-8 text-white transition-transform hover:-translate-y-1"
        >
          <img
            src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80"
            alt="Collection Chaussures Jumelles Store"
            class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent"></div>
          <div class="relative z-10 space-y-2">
            <span class="text-xs uppercase tracking-widest text-gold-400 font-semibold">Souliers Féminins</span>
            <h3 class="font-serif text-2xl sm:text-3xl font-bold">Escarpins, Sandales & Sneakers</h3>
            <p class="text-sm text-stone-300 max-w-md">Du 36 au 45, découvrez le parfait équilibre entre maintien et glamour.</p>
            <span class="inline-flex items-center gap-2 text-xs font-semibold text-gold-400 pt-2 group-hover:underline">
              Choisir ma pointure →
            </span>
          </div>
        </router-link>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <p class="text-xs font-semibold text-gold-600 uppercase tracking-widest">Sélection de la Directrice</p>
          <h2 class="font-serif text-3xl font-bold text-stone-900 mt-2">Nos Pièces Phares</h2>
        </div>
        <router-link
          to="/catalog"
          class="text-sm font-semibold text-stone-800 hover:text-gold-600 transition-colors flex items-center gap-1"
        >
          Consulter tout le catalogue ({{ products.length }}) →
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="n in 4" :key="n" class="bg-stone-200 animate-pulse rounded-2xl h-80"></div>
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

    <!-- Wave & Orange Money Highlight Banner -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-gradient-to-br from-stone-900 to-stone-800 rounded-3xl p-8 sm:p-12 text-white border border-gold-500/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div class="space-y-4 max-w-xl text-center md:text-left">
          <span class="inline-block bg-gold-500/20 text-gold-400 text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded-full border border-gold-400/30">
            Paiement 100% Mobile & Garanti
          </span>
          <h3 class="font-serif text-2xl sm:text-3xl font-bold">
            Commandez en 1 clic avec Wave ou Orange Money
          </h3>
          <p class="text-stone-300 text-sm leading-relaxed">
            Pas besoin de carte bancaire ! Scannez simplement le QR code ou validez le débit sur votre application mobile pour sécuriser instantanément votre sac ou votre paire de chaussures.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-4 shrink-0">
          <div class="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-3 w-48">
            <span class="text-3xl">🌊</span>
            <div>
              <p class="font-bold text-sm">Wave</p>
              <p class="text-[11px] text-stone-400">Paiement 0% frais</p>
            </div>
          </div>
          <div class="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-3 w-48">
            <span class="text-3xl">🍊</span>
            <div>
              <p class="font-bold text-sm">Orange Money</p>
              <p class="text-[11px] text-stone-400">Validation code OTP</p>
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
