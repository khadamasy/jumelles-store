<template>
  <div class="cat-page">
    <div class="wrap">
      <!-- En-tête -->
      <header class="cat-head">
        <nav class="crumb" aria-label="Fil d'Ariane">
          <router-link to="/">Accueil</router-link>
          <ChevronRight class="crumb-sep" aria-hidden="true" />
          <span aria-current="page">Catalogue</span>
        </nav>
        <span class="eyebrow"><i></i>Collection 2026 · Dakar</span>
        <Transition name="fade" mode="out-in">
          <h1 :key="pageTitle">{{ pageTitle }}</h1>
        </Transition>
        <p class="lead">{{ pageSubtitle }}</p>
      </header>
    </div>

    <!-- Barre collante : recherche, catégories, filtres -->
    <div class="cat-sticky">
      <div class="wrap">
        <div class="cat-tools">
          <div class="cat-search">
            <Search aria-hidden="true" />
            <input
              v-model="searchQuery"
              type="search"
              enterkeyhint="search"
              placeholder="Rechercher un sac, une mule…"
              aria-label="Rechercher un article"
            />
            <Transition name="fade">
              <button v-if="searchQuery" type="button" class="cat-clear" aria-label="Effacer la recherche" @click="searchQuery = ''">
                <X aria-hidden="true" />
              </button>
            </Transition>
          </div>
          <button type="button" class="btn line cat-flt" @click="filtersOpen = true">
            <SlidersHorizontal aria-hidden="true" />
            <span class="cat-flt-l">Filtrer</span>
            <span v-if="activeFilterCount > 0" class="cat-dot tnum">{{ activeFilterCount }}</span>
          </button>
        </div>

        <div class="cat-chips" role="group" aria-label="Catégories">
          <button
            v-for="c in categoryChips"
            :key="c.key"
            type="button"
            class="chip"
            :aria-pressed="activeChip === c.key"
            @click="selectChip(c)"
          >
            {{ c.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="wrap">
      <!-- Résultats, filtres actifs, tri -->
      <div class="cat-bar">
        <span class="cat-count tnum" aria-live="polite">
          {{ loading ? 'Chargement…' : `${filteredProducts.length} article${filteredProducts.length > 1 ? 's' : ''}` }}
        </span>
        <label class="cat-sort">
          <span class="sr-only">Trier</span>
          <ArrowDownUp aria-hidden="true" />
          <select v-model="sortBy" aria-label="Trier les articles">
            <option value="default">Nouveautés</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </select>
        </label>
      </div>

      <TransitionGroup v-if="activeFilterCount > 0" tag="div" name="list" class="cat-active">
        <button v-if="selectedSize" key="s" type="button" class="chip on sm" @click="selectedSize = ''">
          Pointure {{ selectedSize }}<X aria-hidden="true" />
        </button>
        <button v-if="selectedColor" key="c" type="button" class="chip on sm" @click="selectedColor = ''">
          {{ selectedColor }}<X aria-hidden="true" />
        </button>
        <button v-if="inStockOnly" key="i" type="button" class="chip on sm" @click="inStockOnly = false">
          En stock<X aria-hidden="true" />
        </button>
        <button key="clear" type="button" class="cat-reset" @click="clearFilters">Tout effacer</button>
      </TransitionGroup>

      <!-- Chargement -->
      <div v-if="loading" class="grid" aria-hidden="true">
        <div v-for="n in 8" :key="n" class="sk-card">
          <div class="skel sk-img"></div>
          <div class="skel sk-l1"></div>
          <div class="skel sk-l2"></div>
        </div>
      </div>

      <!-- Aucun résultat -->
      <UiEmpty
        v-else-if="filteredProducts.length === 0"
        title="Aucun article ne correspond"
        text="Essayez une autre recherche ou effacez les filtres."
      >
        <template #icon><SearchX /></template>
        <button type="button" class="btn dark" @click="resetFilters">Voir toute la collection</button>
      </UiEmpty>

      <!-- Grille : 2 par ligne sur téléphone, 3 sur tablette, 4 sur ordinateur -->
      <div v-else class="grid stagger">
        <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
      </div>
    </div>

    <!-- Filtres -->
    <UiModal :open="filtersOpen" variant="sheet" title="Filtrer" close-label="Fermer les filtres" @close="filtersOpen = false">
      <div class="flt">
        <section>
          <h3>Pointure</h3>
          <div class="opts">
            <button
              v-for="size in shoeSizes"
              :key="size"
              type="button"
              class="opt sq tnum"
              :aria-pressed="selectedSize === size"
              @click="selectedSize = selectedSize === size ? '' : size"
            >
              {{ size }}
            </button>
          </div>
        </section>

        <section>
          <h3>Couleur</h3>
          <div class="opts">
            <button
              v-for="c in colors"
              :key="c.name"
              type="button"
              class="opt"
              :aria-pressed="selectedColor === c.name"
              @click="selectedColor = selectedColor === c.name ? '' : c.name"
            >
              <i :style="{ background: c.hex }"></i>{{ c.name }}
            </button>
          </div>
        </section>

        <section>
          <label class="switch">
            <input v-model="inStockOnly" type="checkbox" role="switch" />
            <span class="switch-ui" aria-hidden="true"></span>
            <span>Uniquement les articles en stock</span>
          </label>
        </section>
      </div>

      <template #footer>
        <div class="flt-ft">
          <button type="button" class="btn line" @click="clearFilters">Effacer</button>
          <button type="button" class="btn dark" @click="filtersOpen = false">
            Voir {{ filteredProducts.length }} article{{ filteredProducts.length > 1 ? 's' : '' }}
          </button>
        </div>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Search, X, SearchX, SlidersHorizontal, ArrowDownUp, ChevronRight } from 'lucide-vue-next';
import { useRoute, useRouter } from 'vue-router';
import { ProductService } from '../services/api';
import ProductCard from '../components/ProductCard.vue';
import UiModal from '../components/ui/UiModal.vue';
import UiEmpty from '../components/ui/UiEmpty.vue';

const route = useRoute();
const router = useRouter();

const products = ref<any[]>([]);
const shoeSizes = ref<string[]>(['37', '38', '39', '40', '41', '42']);
const loading = ref(true);

const searchQuery = ref('');
const selectedType = ref('');
const selectedCategory = ref('');
const selectedSize = ref('');
const selectedColor = ref('');
const inStockOnly = ref(false);
const sortBy = ref<'default' | 'price-asc' | 'price-desc'>('default');
const filtersOpen = ref(false);

/** Catégories fixes de la boutique (identifiants du catalogue) */
const categoryChips = [
  { key: 'all', label: 'Tout', type: '', category: '' },
  { key: 'SAC', label: 'Sacs', type: 'SAC', category: '' },
  { key: 'sacs-a-main', label: 'Sacs à main & cabas', type: '', category: 'sacs-a-main' },
  { key: 'pochettes-matelassees', label: 'Pochettes', type: '', category: 'pochettes-matelassees' },
  { key: 'CHAUSSURE', label: 'Chaussures', type: 'CHAUSSURE', category: '' },
  { key: 'mules-escarpins', label: 'Mules & escarpins', type: '', category: 'mules-escarpins' },
  { key: 'sandales-plates', label: 'Sandales & tongs', type: '', category: 'sandales-plates' },
];
const CATEGORY_IDS: Record<string, string> = {
  'sacs-a-main': 'cat-sac-1',
  'pochettes-matelassees': 'cat-sac-2',
  'mules-escarpins': 'cat-shoe-1',
  'sandales-plates': 'cat-shoe-2',
};

const activeChip = computed(() => selectedCategory.value || selectedType.value || 'all');

const colors = [
  { name: 'Noir', hex: '#1c1917' },
  { name: 'Marron', hex: '#7b4a2a' },
  { name: 'Camel', hex: '#c18a4f' },
  { name: 'Bordeaux', hex: '#6d1f2c' },
  { name: 'Rose', hex: '#e8b4b8' },
  { name: 'Blanc', hex: '#f7f3ee' },
  { name: 'Doré', hex: '#cfa64a' },
  { name: 'Argent', hex: '#c7c7cc' },
];

/** Lit les filtres depuis l'adresse (?type=SAC, ?category=sandales-plates) : liens du menu et du bas de page */
const syncFromQuery = () => {
  const type = typeof route.query.type === 'string' ? route.query.type.toUpperCase() : '';
  const category = typeof route.query.category === 'string' ? route.query.category : '';
  selectedType.value = type === 'SAC' || type === 'CHAUSSURE' ? type : '';
  selectedCategory.value = CATEGORY_IDS[category] ? category : '';
};
watch(() => [route.query.type, route.query.category], syncFromQuery, { immediate: true });

const selectChip = (c: (typeof categoryChips)[number]) => {
  const query: Record<string, string> = {};
  if (c.type) query.type = c.type;
  if (c.category) query.category = c.category;
  router.replace({ path: '/catalog', query });
};

const isShoe = (p: any) => String(p.categoryId || '').includes('shoe');

const pageTitle = computed(() => {
  const chip = categoryChips.find((c) => c.key === activeChip.value);
  if (!chip || chip.key === 'all') return 'Toute la collection';
  return chip.label;
});

const pageSubtitle = computed(() => {
  if (selectedType.value === 'CHAUSSURE' || ['mules-escarpins', 'sandales-plates'].includes(selectedCategory.value)) {
    return 'Pointures 37 à 42, échange de pointure sous 48 h.';
  }
  if (selectedType.value === 'SAC' || ['sacs-a-main', 'pochettes-matelassees'].includes(selectedCategory.value)) {
    return 'Maroquinerie sélectionnée, livrée en 24 h à Dakar.';
  }
  return 'Sacs et chaussures pour toutes vos occasions. Commandez en 2 minutes, confirmez sur WhatsApp.';
});

const activeFilterCount = computed(
  () => [selectedSize.value, selectedColor.value, inStockOnly.value].filter(Boolean).length
);

const filteredProducts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  const list = products.value.filter((p) => {
    if (selectedType.value === 'SAC' && isShoe(p)) return false;
    if (selectedType.value === 'CHAUSSURE' && !isShoe(p)) return false;
    if (selectedCategory.value && p.categoryId !== CATEGORY_IDS[selectedCategory.value]) return false;
    if (selectedSize.value && !p.variants?.some((v: any) => v.sizeOrShoeSize === selectedSize.value && v.stockQuantity > 0)) {
      return false;
    }
    if (selectedColor.value) {
      const wanted = selectedColor.value.toLowerCase();
      if (!p.variants?.some((v: any) => String(v.color).toLowerCase().includes(wanted))) return false;
    }
    if (inStockOnly.value && !p.variants?.some((v: any) => v.stockQuantity > 0)) return false;
    if (q && !`${p.name} ${p.description}`.toLowerCase().includes(q)) return false;
    return true;
  });
  if (sortBy.value === 'price-asc') return [...list].sort((a, b) => a.basePrice - b.basePrice);
  if (sortBy.value === 'price-desc') return [...list].sort((a, b) => b.basePrice - a.basePrice);
  return list;
});

const clearFilters = () => {
  selectedSize.value = '';
  selectedColor.value = '';
  inStockOnly.value = false;
};

const resetFilters = () => {
  clearFilters();
  searchQuery.value = '';
  sortBy.value = 'default';
  router.replace('/catalog');
};

const loadProducts = async () => {
  loading.value = true;
  try {
    const res = await ProductService.getAll();
    products.value = Array.isArray(res.data?.data) ? res.data.data : [];
    const sizesRes = await ProductService.getShoeSizes();
    if (Array.isArray(sizesRes.data?.data) && sizesRes.data.data.length > 0) {
      shoeSizes.value = sizesRes.data.data;
    }
  } catch (error) {
    console.error('Erreur chargement catalogue:', error);
  } finally {
    loading.value = false;
  }
};

// Panneau de filtres : Échap et blocage du défilement gérés par UiModal
onMounted(loadProducts);
</script>
<style scoped>
.cat-page {
  padding: var(--s-6) 0 var(--s-10);
}
.crumb-sep {
  width: 12px;
  height: 12px;
  opacity: 0.6;
}

.cat-head h1 {
  font-size: var(--fs-3xl);
  line-height: var(--lh-tight);
  margin: var(--s-3) 0 var(--s-2);
  font-weight: 400;
}
.cat-head .lead {
  margin: 0;
  max-width: 40em;
  color: var(--text-muted);
  font-size: var(--fs-sm);
}

/* ----- Barre collante ----- */
.cat-sticky {
  position: sticky;
  top: var(--header-h);
  z-index: 20;
  margin-top: var(--s-5);
  padding: var(--s-3) 0 var(--s-2);
  background: rgb(var(--c-sand-50) / 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}
.cat-tools {
  display: flex;
  gap: var(--s-2);
}
.cat-search {
  position: relative;
  flex: 1;
  min-width: 0;
}
.cat-search > svg {
  position: absolute;
  left: 14px;
  top: 50%;
  width: 18px;
  height: 18px;
  transform: translateY(-50%);
  color: var(--text-faint);
  pointer-events: none;
}
.cat-search input {
  width: 100%;
  height: 48px;
  padding: 0 44px;
  border-radius: var(--r-md);
  border: 1px solid var(--border-strong);
  background: var(--surface);
  font: 500 var(--fs-base) var(--font-sans);
  color: var(--text);
  outline: none;
  appearance: none;
  transition: border-color var(--dur-2), box-shadow var(--dur-2);
}
.cat-search input::-webkit-search-cancel-button {
  display: none;
}
.cat-search input::placeholder {
  color: var(--text-faint);
  font-weight: 400;
}
.cat-search input:focus {
  border-color: var(--accent);
  box-shadow: var(--focus-ring);
}
.cat-clear {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: var(--r-sm);
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
}
.cat-clear:hover {
  background: var(--bg-sunken);
}
.cat-clear svg {
  width: 16px;
  height: 16px;
}
.cat-flt {
  flex: none;
  padding: 0 14px;
}
.cat-flt-l {
  display: none;
}
.cat-dot {
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: var(--ink);
  color: var(--on-ink);
  font-size: 11px;
  line-height: 20px;
  font-weight: 700;
}

.cat-chips {
  display: flex;
  gap: var(--s-2);
  overflow-x: auto;
  margin: var(--s-3) calc(-1 * var(--gutter)) 0;
  padding: 2px var(--gutter) 4px;
  scrollbar-width: none;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 var(--gutter), #000 calc(100% - 32px), transparent);
  mask-image: linear-gradient(90deg, transparent, #000 var(--gutter), #000 calc(100% - 32px), transparent);
}
.cat-chips::-webkit-scrollbar {
  display: none;
}

/* ----- Résultats ----- */
.cat-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-3);
  margin: var(--s-5) 0 var(--s-3);
}
.cat-count {
  font-size: var(--fs-sm);
  font-weight: 600;
  color: var(--text-muted);
}
.cat-sort {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.cat-sort svg {
  position: absolute;
  left: 10px;
  width: 15px;
  height: 15px;
  color: var(--text-muted);
  pointer-events: none;
}
.cat-sort select {
  height: 40px;
  padding: 0 12px 0 32px;
  border: 1px solid transparent;
  border-radius: var(--r-sm);
  background: transparent;
  font: 600 var(--fs-sm) var(--font-sans);
  color: var(--text);
  cursor: pointer;
  outline: none;
  transition: background-color var(--dur-2), border-color var(--dur-2);
}
.cat-sort select:hover {
  background: var(--surface);
  border-color: var(--border);
}
.cat-sort select:focus-visible {
  box-shadow: var(--focus-ring);
}

.cat-active {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s-2);
  margin-bottom: var(--s-4);
}
.chip.sm {
  min-height: 34px;
  padding: 0 12px;
  font-size: var(--fs-xs);
}
.chip.sm svg {
  width: 14px;
  height: 14px;
}
.cat-reset {
  border: 0;
  background: none;
  padding: 8px 4px;
  font: 600 var(--fs-xs) var(--font-sans);
  color: var(--text-muted);
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}
.cat-reset:hover {
  color: var(--text);
}

/* ----- Grille ----- */
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--s-4) var(--s-3);
}
.sk-card {
  display: grid;
  gap: var(--s-2);
}
.sk-img {
  aspect-ratio: 4 / 5;
  border-radius: var(--r-lg);
}
.sk-l1 {
  height: 14px;
  width: 85%;
}
.sk-l2 {
  height: 14px;
  width: 45%;
}

/* ----- Filtres ----- */
.flt {
  display: grid;
  gap: var(--s-6);
}
.flt section h3 {
  margin: 0 0 var(--s-3);
  font: 700 var(--fs-2xs) / 1 var(--font-sans);
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--text-muted);
}
.opts {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-2);
}
.opt {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--s-2);
  min-height: var(--tap);
  padding: 0 var(--s-4);
  border-radius: var(--r-md);
  border: 1px solid var(--border-strong);
  background: var(--surface);
  color: var(--text);
  font: 600 var(--fs-sm) var(--font-sans);
  cursor: pointer;
  transition: border-color var(--dur-2), background-color var(--dur-2), color var(--dur-2), transform var(--dur-1);
}
.opt:hover {
  border-color: var(--text-faint);
}
.opt:active {
  transform: scale(0.96);
}
.opt.sq {
  width: 52px;
  padding: 0;
}
.opt i {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.12);
}
.opt[aria-pressed='true'] {
  border-color: var(--ink);
  background: var(--ink);
  color: var(--on-ink);
}

.switch {
  display: flex;
  align-items: center;
  gap: var(--s-3);
  min-height: var(--tap);
  font-weight: 600;
  cursor: pointer;
}
.switch input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
}
.switch-ui {
  position: relative;
  width: 46px;
  height: 28px;
  flex: none;
  border-radius: 14px;
  background: var(--border-strong);
  transition: background-color var(--dur-2) var(--ease-out);
}
.switch-ui::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  box-shadow: var(--sh-1);
  transition: transform var(--dur-3) var(--ease-spring);
}
.switch input:checked + .switch-ui {
  background: var(--ink);
}
.switch input:checked + .switch-ui::after {
  transform: translateX(18px);
}
.switch input:focus-visible + .switch-ui {
  box-shadow: var(--focus-ring);
}

.flt-ft {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--s-2);
}

/* ----- Tablette ----- */
@media (min-width: 720px) {
  .cat-page {
    padding-top: var(--s-10);
  }
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--s-8) var(--s-5);
  }
  .cat-flt-l {
    display: inline;
  }
  .cat-chips {
    flex-wrap: wrap;
    overflow: visible;
    margin-inline: 0;
    padding-inline: 0;
    -webkit-mask-image: none;
    mask-image: none;
  }
}

/* ----- Ordinateur ----- */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .cat-search {
    max-width: 480px;
  }
  .cat-tools {
    justify-content: space-between;
  }
}
</style>
