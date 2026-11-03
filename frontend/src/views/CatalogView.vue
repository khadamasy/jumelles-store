<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <!-- Header Page -->
    <div class="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <nav class="text-xs text-stone-400 mb-2">
          <router-link to="/" class="hover:text-stone-700">Accueil</router-link> / <span class="text-stone-700">Catalogue</span>
        </nav>
        <h1 class="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          {{ pageTitle }}
        </h1>
        <p class="text-sm text-stone-500 mt-1">
          {{ filteredProducts.length }} article(s) trouvé(s) dans notre boutique
        </p>
      </div>

      <!-- Quick Search input -->
      <div class="relative w-full md:w-72">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher un sac, escarpin..."
          class="w-full pl-10 pr-4 py-3 bg-white border border-stone-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 shadow-sm"
        />
        <Search class="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
      </div>
    </div>

    <!-- Raccourcis Rapides Univers (Mobile & Tablette) -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar lg:hidden">
      <button
        @click="selectedType = ''"
        class="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer"
        :class="selectedType === '' ? 'bg-stone-950 text-white shadow' : 'bg-white border border-stone-200 text-stone-700'"
      >
        Tous les articles ({{ products.length }})
      </button>
      <button
        @click="selectedType = 'SAC'"
        class="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer"
        :class="selectedType === 'SAC' ? 'bg-stone-950 text-white shadow' : 'bg-white border border-stone-200 text-stone-700'"
      >
        Sacs & Cabas
      </button>
      <button
        @click="selectedType = 'CHAUSSURE'"
        class="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer"
        :class="selectedType === 'CHAUSSURE' ? 'bg-stone-950 text-white shadow' : 'bg-white border border-stone-200 text-stone-700'"
      >
        Chaussures (37-42)
      </button>
    </div>

    <!-- Main Layout: Sidebar Filters + Products Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Filter Sidebar -->
      <aside class="space-y-6 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm h-fit">
        <div class="flex items-center justify-between pb-3 border-b border-stone-100">
          <h3 class="font-serif font-bold text-stone-900 text-base">Filtres</h3>
          <button @click="resetFilters" class="text-xs text-gold-700 hover:text-gold-900 font-bold flex items-center gap-1 cursor-pointer">
            <RotateCcw class="w-3 h-3" />
            <span>Réinitialiser</span>
          </button>
        </div>

        <!-- Univers Filter -->
        <div class="space-y-2">
          <label class="text-xs font-semibold uppercase tracking-wider text-stone-400 block">Univers</label>
          <div class="flex flex-col gap-1.5 text-sm">
            <button
              @click="selectedType = ''"
              class="text-left px-3 py-2 rounded-xl transition-colors flex items-center justify-between cursor-pointer"
              :class="selectedType === '' ? 'bg-stone-950 text-white font-medium' : 'text-stone-700 hover:bg-stone-100'"
            >
              <span>Tous les articles</span>
            </button>
            <button
              @click="selectedType = 'SAC'"
              class="text-left px-3 py-2 rounded-xl transition-colors flex items-center justify-between cursor-pointer"
              :class="selectedType === 'SAC' ? 'bg-stone-950 text-white font-medium' : 'text-stone-700 hover:bg-stone-100'"
            >
              <span>Maroquinerie & Sacs</span>
            </button>
            <button
              @click="selectedType = 'CHAUSSURE'"
              class="text-left px-3 py-2 rounded-xl transition-colors flex items-center justify-between cursor-pointer"
              :class="selectedType === 'CHAUSSURE' ? 'bg-stone-950 text-white font-medium' : 'text-stone-700 hover:bg-stone-100'"
            >
              <span>Chaussures & Souliers</span>
            </button>
          </div>
        </div>

        <!-- Pointures Chaussures (Filtre dynamique) -->
        <div class="space-y-2 pt-2 border-t border-stone-100">
          <label class="text-xs font-semibold uppercase tracking-wider text-stone-400 block">
            Pointure de Chaussure
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="size in shoeSizes"
              :key="size"
              @click="toggleSize(size)"
              class="w-10 h-10 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center"
              :class="selectedSize === size ? 'bg-gold-600 text-white border-gold-600 shadow' : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'"
            >
              {{ size }}
            </button>
          </div>
        </div>

        <!-- Couleurs -->
        <div class="space-y-2 pt-2 border-t border-stone-100">
          <label class="text-xs font-semibold uppercase tracking-wider text-stone-400 block">
            Couleurs populaires
          </label>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="c in ['Noir', 'Doré', 'Blanc', 'Marron', 'Rouge']"
              :key="c"
              @click="selectedColor = (selectedColor === c ? '' : c)"
              class="px-3 py-1 rounded-full text-xs font-medium border transition-colors"
              :class="selectedColor === c ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'"
            >
              {{ c }}
            </button>
          </div>
        </div>

        <!-- Assistance Commande Téléphonique -->
        <div class="pt-4 border-t border-stone-100 bg-stone-50 p-4 rounded-2xl space-y-2">
          <p class="text-xs font-bold text-stone-900 flex items-center gap-1.5">
            <Phone class="w-3.5 h-3.5 text-gold-700" />
            <span>Conseil & Commande :</span>
          </p>
          <a
            href="tel:+221772087820"
            class="text-xs font-black text-stone-900 hover:text-gold-700 block font-mono"
          >
            +221 77 208 78 20
          </a>
          <a
            href="https://wa.me/221772087820?text=Bonjour%20Jumelles%20Store%2C%20j%27aimerais%20de%20l%27aide%20pour%20choisir%20une%20pointure%20ou%20un%20sac"
            target="_blank"
            class="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-300 px-2.5 py-1 rounded-lg"
          >
            <MessageCircle class="w-3 h-3 text-emerald-700" />
            <span>Aide WhatsApp</span>
          </a>
        </div>
      </aside>

      <!-- Products Grid -->
      <main class="lg:col-span-3 space-y-6">
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="n in 6" :key="n" class="bg-stone-200 animate-pulse rounded-3xl h-80"></div>
        </div>

        <div v-else-if="filteredProducts.length === 0" class="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4 shadow-sm">
          <div class="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <Search class="w-8 h-8" />
          </div>
          <h3 class="font-serif text-xl font-bold text-stone-900">Aucun produit ne correspond à vos critères.</h3>
          <p class="text-sm text-stone-500">Essayez de réinitialiser vos filtres ou de modifier votre mot-clé de recherche.</p>
          <button @click="resetFilters" class="px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-xl hover:bg-gold-600 transition-colors cursor-pointer">
            Afficher toute la boutique
          </button>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Search, RotateCcw, Phone, MessageCircle } from 'lucide-vue-next';
import { ProductService } from '../services/api';
import ProductCard from '../components/ProductCard.vue';

const route = useRoute();
const router = useRouter();

const products = ref<any[]>([]);
const shoeSizes = ref<string[]>(['37', '38', '39', '40', '41', '42']);
const loading = ref(true);

const searchQuery = ref('');
const selectedType = ref((route.query.type as string) || '');
const selectedSize = ref('');
const selectedColor = ref('');

const loadProducts = async () => {
  loading.value = true;
  try {
    const res = await ProductService.getAll();
    products.value = res.data.data;

    const sizesRes = await ProductService.getShoeSizes();
    if (sizesRes.data.data && sizesRes.data.data.length > 0) {
      shoeSizes.value = sizesRes.data.data;
    }
  } catch (error) {
    console.error('Erreur chargement catalogue:', error);
  } finally {
    loading.value = false;
  }
};

watch(
  () => route.query.type,
  (newType) => {
    selectedType.value = (newType as string) || '';
  }
);

const pageTitle = computed(() => {
  if (selectedType.value === 'SAC') return 'Collection Sacs & Cabas';
  if (selectedType.value === 'CHAUSSURE') return 'Collection Chaussures & Escarpins';
  return 'Tous Nos Sacs & Chaussures';
});

const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    // Univers SAC / CHAUSSURE
    if (selectedType.value) {
      const isSac = p.category?.type === 'SAC' || p.categoryId.includes('sac');
      const isShoe = p.category?.type === 'CHAUSSURE' || p.categoryId.includes('shoe');
      if (selectedType.value === 'SAC' && !isSac) return false;
      if (selectedType.value === 'CHAUSSURE' && !isShoe) return false;
    }

    // Pointure
    if (selectedSize.value) {
      const hasSize = p.variants?.some((v: any) => v.sizeOrShoeSize === selectedSize.value && v.stockQuantity > 0);
      if (!hasSize) return false;
    }

    // Couleur
    if (selectedColor.value) {
      const hasColor = p.variants?.some((v: any) => v.color.toLowerCase().includes(selectedColor.value.toLowerCase()));
      if (!hasColor) return false;
    }

    // Recherche
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }

    return true;
  });
});

const toggleSize = (size: string) => {
  selectedSize.value = selectedSize.value === size ? '' : size;
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedType.value = '';
  selectedSize.value = '';
  selectedColor.value = '';
  router.push('/catalog');
};

onMounted(() => {
  loadProducts();
});
</script>

