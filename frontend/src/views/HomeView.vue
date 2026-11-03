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
          <span>Paiements Wave & Orange Money Sécurisés</span>
        </span>
        <span class="text-stone-600">•</span>
        <span class="flex items-center gap-2">
          <RefreshCw class="w-3.5 h-3.5 text-gold-400" />
          <span>Échange de Pointure Garanti sous 48h</span>
        </span>
        <span class="text-stone-600">•</span>
        <span class="flex items-center gap-2">
          <Phone class="w-3.5 h-3.5 text-gold-400" />
          <span>Commandes WhatsApp : +221 77 208 78 20</span>
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
          <span>Paiements Wave & Orange Money Sécurisés</span>
        </span>
      </div>
    </div>

    <!-- 2. Raccourcis Stories / Fast-Fashion Mobile First (Instagram Style) -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-2 pt-1 custom-scrollbar">
        <router-link
          v-for="story in mobileStories"
          :key="story.label"
          :to="story.link"
          class="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
        >
          <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 bg-gradient-to-tr from-gold-600 via-gold-400 to-amber-200 group-hover:scale-105 transition-transform shadow-md">
            <div class="w-full h-full rounded-full overflow-hidden bg-stone-900 border-2 border-white">
              <img :src="story.image" :alt="story.label" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
          </div>
          <span class="text-[11px] sm:text-xs font-bold text-stone-800 group-hover:text-gold-700 transition-colors whitespace-nowrap">
            {{ story.label }}
          </span>
        </router-link>
      </div>
    </section>

    <!-- 3. Hero Section Haute Couture (Mobile First & Motion Design) -->
    <section class="relative bg-stone-950 text-white min-h-[520px] lg:min-h-[660px] flex items-center overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 shadow-2xl border border-stone-800">
      <!-- Background Luxury Visual with Zoom Hover Effect -->
      <div class="absolute inset-0 z-0 opacity-40 mix-blend-luminosity overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=85"
          alt="Maison Jumelles Store Mode Dakar"
          class="w-full h-full object-cover scale-105 transition-transform duration-1000 ease-out"
        />
      </div>
      <div class="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/85 to-transparent z-10"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent z-10"></div>

      <div class="relative z-20 max-w-4xl px-6 sm:px-12 lg:px-16 py-16 lg:py-24 space-y-6 sm:space-y-8">
        <!-- Luxury Floating Badge -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/15 border border-gold-400/40 text-gold-300 text-[10px] sm:text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-lg">
          <span class="w-2 h-2 rounded-full bg-gold-400 animate-ping"></span>
          <span>Maison Jumelles • Haute Maroquinerie Dakar</span>
        </div>

        <h1 class="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
          L'Élégance du Sac & la Grâce du Soulier.
        </h1>

        <p class="text-stone-300 text-sm sm:text-base lg:text-lg leading-relaxed font-light max-w-xl">
          Pièces exclusives de haute maroquinerie au cuir sélectionné et souliers taillés pour sublimer chaque silhouette à Dakar.
        </p>

        <!-- CTAs Vrais Liens -->
        <div class="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
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

        <!-- Reassurance Mini Badges -->
        <div class="pt-4 border-t border-white/15 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-stone-300">
          <a href="tel:+221772087820" class="flex items-center gap-2 hover:text-gold-400 transition-colors font-bold">
            <Phone class="w-3.5 h-3.5 text-gold-400" />
            <span>Commandes : +221 77 208 78 20</span>
          </a>
          <span class="flex items-center gap-1 text-emerald-400 font-semibold">
            <CheckCircle2 class="w-3.5 h-3.5" />
            <span>Livraison 24h Dakar</span>
          </span>
          <span class="flex items-center gap-1 text-gold-400 font-semibold">
            <ShieldCheck class="w-3.5 h-3.5" />
            <span>Wave & Orange Money</span>
          </span>
        </div>
      </div>
    </section>

    <!-- 4. Piliers de Confiance & Prestige (4 Cartes Modernes avec Vraies Icônes) -->
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
          <div class="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 shadow-2xs">
            <ShieldCheck class="w-6 h-6" />
          </div>
          <div>
            <h4 class="font-serif font-bold text-stone-900 text-sm">Wave & Orange Money</h4>
            <p class="text-xs text-stone-500 mt-1">Transfert direct sécurisé au 77 208 78 20 (Fary Dione).</p>
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

    <!-- 7. Bandeau Paiement Mobile & Assistance Directe -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 rounded-3xl p-8 sm:p-12 text-white border border-gold-500/30 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
        <div class="space-y-4 max-w-xl text-center lg:text-left">
          <span class="inline-block bg-gold-500/20 text-gold-400 text-xs uppercase tracking-widest font-black px-4 py-1.5 rounded-full border border-gold-400/30">
            Achat Simplifié Sans Carte Bancaire
          </span>
          <h3 class="font-serif text-2xl sm:text-4xl font-bold leading-tight">
            Réglez instantanément avec Wave ou Orange Money
          </h3>
          <p class="text-stone-300 text-xs sm:text-sm leading-relaxed font-light">
            Validez votre commande en quelques secondes. Transfert direct vers le compte officiel vérifié <strong>77 208 78 20 (Fary Dione)</strong>.
          </p>
          <div class="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <a
              href="tel:+221772087820"
              class="px-5 py-3 rounded-2xl bg-white/10 border border-white/20 text-xs font-bold text-white hover:bg-white/20 transition-all flex items-center gap-2 shadow"
            >
              <Phone class="w-4 h-4 text-gold-400" />
              <span>Appeler : +221 77 208 78 20</span>
            </a>
            <a
              href="https://wa.me/221772087820?text=Bonjour%20Jumelles%20Store%2C%20je%20souhaite%20commander%20un%20article"
              target="_blank"
              class="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-all flex items-center gap-2 shadow-lg"
            >
              <MessageCircle class="w-4 h-4" />
              <span>Écrire sur WhatsApp</span>
            </a>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
          <!-- Wave Card -->
          <div class="bg-blue-600/10 backdrop-blur-md border border-blue-500/30 p-5 rounded-2xl flex items-center gap-4 w-full sm:w-56 shadow-lg">
            <div class="w-12 h-12 rounded-xl bg-blue-600/30 flex items-center justify-center text-blue-400 font-black text-xl shrink-0">
              🌊
            </div>
            <div>
              <p class="font-black text-sm text-white">Wave Sénégal</p>
              <p class="text-xs text-blue-300">Paiement 0% frais</p>
            </div>
          </div>

          <!-- Orange Money Card -->
          <div class="bg-orange-600/10 backdrop-blur-md border border-orange-500/30 p-5 rounded-2xl flex items-center gap-4 w-full sm:w-56 shadow-lg">
            <div class="w-12 h-12 rounded-xl bg-orange-600/30 flex items-center justify-center text-orange-400 font-black text-xl shrink-0">
              🍊
            </div>
            <div>
              <p class="font-black text-sm text-white">Orange Money</p>
              <p class="text-xs text-orange-300">Max it ou code #144#</p>
            </div>
          </div>
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
  Phone,
  MessageCircle,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Award,
} from 'lucide-vue-next';
import { ProductService } from '../services/api';
import ProductCard from '../components/ProductCard.vue';

const products = ref<any[]>([]);
const loading = ref(true);
const activeCategory = ref<'ALL' | 'SAC' | 'CHAUSSURE'>('ALL');

// Fast-Fashion Stories / Catégories Rapides pour Mobile First
const mobileStories = [
  {
    label: 'Tous les Sacs',
    link: '/catalog?type=SAC',
    image: '/products/sac-birkin-camel.jpg',
  },
  {
    label: 'Pochettes Soirée',
    link: '/catalog?category=pochettes-bandoulieres',
    image: '/products/sac-pochette-chaine-or.jpg',
  },
  {
    label: 'Escarpins Gala',
    link: '/catalog?category=escarpins-talons',
    image: '/products/escarpins-stiletto-noir.jpg',
  },
  {
    label: 'Mules & Nu-Pieds',
    link: '/catalog?category=sandales-mules',
    image: '/products/mules-talon-coeur-noir.jpg',
  },
  {
    label: 'Collection Sneaker',
    link: '/catalog?category=sneakers-femme',
    image: '/products/sneakers-urbaines-dorees.jpg',
  },
  {
    label: 'Guide Livraison',
    link: '/faq-livraison',
    image: '/products/sac-cabas-croco-noir.jpg',
  },
];

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
