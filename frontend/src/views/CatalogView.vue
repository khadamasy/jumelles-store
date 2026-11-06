<template>
  <div class="cat-page">
    <div class="wrap">
      <!-- En-tête -->
      <header class="cat-head">
        <nav class="crumb" aria-label="Fil d'Ariane">
          <router-link to="/">Accueil</router-link>
          <span aria-hidden="true">/</span>
          <span>Catalogue</span>
        </nav>
        <span class="eyebrow"><i></i>Collection 2026 · Dakar</span>
        <h1>{{ pageTitle }}</h1>
        <p class="lead">{{ pageSubtitle }}</p>
      </header>

      <!-- Recherche -->
      <div class="cat-search">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Rechercher un sac, une mule…"
          aria-label="Rechercher un article"
        />
      </div>

      <!-- Catégories : une seule rangée qui défile sur téléphone -->
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

      <!-- Barre d'outils : nombre de résultats, filtres, tri -->
      <div class="cat-bar">
        <span class="count">{{ loading ? 'Chargement…' : `${filteredProducts.length} article${filteredProducts.length > 1 ? 's' : ''}` }}</span>
        <div class="cat-bar-r">
          <button type="button" class="tool" @click="filtersOpen = true">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
            Filtrer<span v-if="activeFilterCount > 0" class="dot">{{ activeFilterCount }}</span>
          </button>
          <label class="tool sort">
            <span class="sr-only">Trier</span>
            <select v-model="sortBy" aria-label="Trier les articles">
              <option value="default">Nouveautés</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </label>
        </div>
      </div>

      <!-- Filtres actifs -->
      <div v-if="activeFilterCount > 0" class="cat-active">
        <button v-if="selectedSize" type="button" @click="selectedSize = ''">Pointure {{ selectedSize }} ✕</button>
        <button v-if="selectedColor" type="button" @click="selectedColor = ''">{{ selectedColor }} ✕</button>
        <button v-if="inStockOnly" type="button" @click="inStockOnly = false">En stock ✕</button>
        <button type="button" class="clear" @click="clearFilters">Tout effacer</button>
      </div>

      <!-- Grille : 2 articles par ligne sur téléphone, 3 sur tablette, 4 sur ordinateur -->
      <div v-if="loading" class="grid">
        <div v-for="n in 8" :key="n" class="skel"></div>
      </div>

      <div v-else-if="filteredProducts.length === 0" class="empty">
        <h2>Aucun article ne correspond.</h2>
        <p>Essayez une autre recherche ou effacez les filtres.</p>
        <button type="button" class="btn gold" @click="resetFilters">Voir toute la collection</button>
      </div>

      <div v-else class="grid">
        <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
      </div>
    </div>

    <!-- Panneau de filtres (glisse depuis le bas sur téléphone, depuis la droite sur ordinateur) -->
    <div class="sheet" :class="{ on: filtersOpen }" :aria-hidden="!filtersOpen">
      <div class="sheet-bg" @click="filtersOpen = false"></div>
      <div class="sheet-pn" role="dialog" aria-modal="true" aria-labelledby="flt-title">
        <div class="sheet-h">
          <h2 id="flt-title">Filtrer</h2>
          <button type="button" class="ib" aria-label="Fermer les filtres" @click="filtersOpen = false">
            <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>

        <div class="sheet-body">
          <section>
            <h3>Pointure</h3>
            <div class="opts">
              <button
                v-for="size in shoeSizes"
                :key="size"
                type="button"
                class="opt sq"
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
              <input v-model="inStockOnly" type="checkbox" />
              <span>Uniquement les articles en stock</span>
            </label>
          </section>
        </div>

        <div class="sheet-f">
          <button type="button" class="btn line" @click="clearFilters">Effacer</button>
          <button type="button" class="btn gold" @click="filtersOpen = false">
            Voir {{ filteredProducts.length }} article{{ filteredProducts.length > 1 ? 's' : '' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ProductService } from '../services/api';
import ProductCard from '../components/ProductCard.vue';

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

// Panneau de filtres : bloque le défilement de la page derrière, se ferme avec Échap
watch(filtersOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : '';
});
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') filtersOpen.value = false;
};

onMounted(() => {
  loadProducts();
  window.addEventListener('keydown', onKey);
});
onUnmounted(() => {
  window.removeEventListener('keydown', onKey);
  document.body.style.overflow = '';
});
</script>

<style scoped>
.cat-page {
  padding: 18px 0 40px;
}

.crumb {
  display: flex;
  gap: 6px;
  font-size: 12px;
  color: var(--mut);
  margin-bottom: 14px;
}
.crumb a:hover {
  color: var(--gold);
}

.cat-head h1 {
  font-size: clamp(30px, 7vw, 44px);
  line-height: 1.08;
  margin: 10px 0 8px;
  font-weight: 400;
}
.cat-head .lead {
  color: var(--mut);
  font-size: 15px;
  margin: 0;
  max-width: 560px;
}

.cat-search {
  position: relative;
  margin-top: 20px;
}
.cat-search svg {
  position: absolute;
  left: 16px;
  top: 50%;
  width: 18px;
  height: 18px;
  transform: translateY(-50%);
  fill: none;
  stroke: var(--mut);
  stroke-width: 2;
  stroke-linecap: round;
}
.cat-search input {
  width: 100%;
  height: 50px;
  padding: 0 16px 0 44px;
  border-radius: 14px;
  border: 1px solid var(--bd);
  background: var(--card);
  font: inherit;
  font-size: 15px;
  color: var(--tx);
  outline: none;
}
.cat-search input:focus {
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(184, 137, 58, 0.15);
}

.cat-chips {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  margin: 14px -16px 0;
  padding: 2px 16px 4px;
}
.cat-chips::-webkit-scrollbar {
  display: none;
}
.chip {
  flex: none;
  height: 38px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid var(--bd);
  background: var(--card);
  color: var(--tx);
  font-weight: 600;
  font-size: 13.5px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.chip[aria-pressed='true'] {
  background: var(--ink);
  border-color: var(--ink);
  color: var(--on-ink);
}

.cat-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin: 18px 0 12px;
  padding-top: 14px;
  border-top: 1px solid var(--bd);
}
.count {
  font-size: 13px;
  color: var(--mut);
  font-weight: 600;
}
.cat-bar-r {
  display: flex;
  gap: 8px;
}
.tool {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 12px;
  border-radius: 12px;
  border: 1px solid var(--bd);
  background: var(--card);
  font-weight: 600;
  font-size: 13.5px;
  color: var(--tx);
  cursor: pointer;
}
.tool svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}
.tool .dot {
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  background: var(--gold);
  color: var(--ink);
  font-size: 11px;
  line-height: 18px;
  text-align: center;
}
.tool.sort {
  padding: 0;
}
.tool.sort select {
  height: 100%;
  border: 0;
  background: transparent;
  font: inherit;
  color: inherit;
  padding: 0 10px;
  border-radius: 12px;
  cursor: pointer;
}

.cat-active {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}
.cat-active button {
  height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid #ead9bd;
  background: #fbf3e4;
  color: #7a5214;
  font-weight: 600;
  font-size: 12.5px;
  cursor: pointer;
}
.cat-active .clear {
  background: transparent;
  border-color: transparent;
  text-decoration: underline;
  color: var(--mut);
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.skel {
  aspect-ratio: 4 / 6.2;
  border-radius: 18px;
  background: linear-gradient(100deg, #efe7dc 40%, #f7f1e9 50%, #efe7dc 60%) 0 0 / 200% 100%;
  animation: shimmer 1.3s linear infinite;
}
@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}

.empty {
  text-align: center;
  padding: 48px 16px;
  background: var(--card);
  border: 1px solid var(--bd);
  border-radius: 20px;
}
.empty h2 {
  font-weight: 400;
  margin: 0 0 6px;
}
.empty p {
  color: var(--mut);
  margin: 0 0 18px;
}
.empty .btn {
  display: inline-flex;
  width: auto;
  padding: 0 22px;
}

/* ---------- Panneau de filtres ---------- */
.sheet {
  position: fixed;
  inset: 0;
  z-index: 70;
  visibility: hidden;
}
.sheet.on {
  visibility: visible;
}
.sheet-bg {
  position: absolute;
  inset: 0;
  background: rgba(23, 17, 14, 0.45);
  opacity: 0;
  transition: opacity 0.25s;
}
.sheet.on .sheet-bg {
  opacity: 1;
}
.sheet-pn {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  max-height: 86vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  border-radius: 24px 24px 0 0;
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.sheet.on .sheet-pn {
  transform: none;
}
.sheet-h {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 12px 6px 20px;
}
.sheet-h h2 {
  margin: 0;
  font-weight: 400;
  font-size: 24px;
}
.sheet-body {
  overflow-y: auto;
  padding: 4px 20px 16px;
}
.sheet-body section {
  padding: 14px 0;
  border-bottom: 1px solid var(--bd);
}
.sheet-body section:last-child {
  border-bottom: 0;
}
.sheet-body h3 {
  font: 700 11px system-ui, sans-serif;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--mut);
  margin: 0 0 10px;
}
.opts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.opt {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid var(--bd);
  background: var(--card);
  color: var(--tx);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}
.opt.sq {
  width: 48px;
  justify-content: center;
  padding: 0;
}
.opt i {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
.opt[aria-pressed='true'] {
  border-color: var(--ink);
  background: var(--ink);
  color: var(--on-ink);
}
.switch {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 14.5px;
  cursor: pointer;
}
.switch input {
  width: 20px;
  height: 20px;
  accent-color: var(--gold);
}
.sheet-f {
  display: flex;
  gap: 10px;
  padding: 12px 20px calc(14px + env(safe-area-inset-bottom, 0px));
  border-top: 1px solid var(--bd);
}
.sheet-f .btn {
  flex: 1;
}
.sheet-f .btn.gold {
  flex: 2;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

@media (min-width: 720px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
  }
  .cat-chips {
    flex-wrap: wrap;
    overflow: visible;
    margin: 14px 0 0;
    padding: 0;
  }
  .sheet-pn {
    left: auto;
    top: 0;
    width: 400px;
    max-height: none;
    border-radius: 24px 0 0 24px;
    transform: translateX(100%);
  }
}
@media (min-width: 1000px) {
  .grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
