<template>
  <div class="pd-page">
    <div class="wrap">
      <nav class="crumb" aria-label="Fil d'Ariane">
        <router-link to="/">Accueil</router-link>
        <span aria-hidden="true">/</span>
        <router-link :to="categoryLink">{{ isShoe ? 'Chaussures' : 'Sacs' }}</router-link>
        <span aria-hidden="true">/</span>
        <span class="cur">{{ product?.name || 'Article' }}</span>
      </nav>

      <!-- Chargement -->
      <div v-if="loading" class="pd-grid" aria-hidden="true">
        <div class="skel img"></div>
        <div class="skel-col">
          <div class="skel l1"></div>
          <div class="skel l2"></div>
          <div class="skel l3"></div>
        </div>
      </div>

      <!-- Fiche article -->
      <div v-else-if="product" class="pd-grid">
        <!-- Galerie -->
        <section class="gal" aria-label="Photos de l'article">
          <div class="gal-main">
            <img :src="activeImage" :alt="activeImageAlt" />
            <span v-if="discount > 0" class="tag promo">-{{ discount }}%</span>
          </div>
          <div v-if="product.images && product.images.length > 1" class="gal-thumbs">
            <button
              v-for="img in product.images"
              :key="img.id"
              type="button"
              :aria-label="`Voir : ${img.altText || product.name}`"
              :aria-pressed="activeImage === img.minioUrl"
              @click="activeImage = img.minioUrl"
            >
              <img loading="lazy" decoding="async" :src="img.minioUrl" :alt="''" />
            </button>
          </div>
        </section>

        <!-- Informations et achat -->
        <section class="info">
          <span class="eyebrow">{{ product.category?.name || (isShoe ? 'Chaussures' : 'Maroquinerie') }}</span>
          <h1>{{ product.name }}</h1>

          <div class="price-row">
            <span class="price">{{ formatMain(currentPrice) }}</span>
            <s v-if="discount > 0">{{ formatMain(product.originalPrice) }}</s>
            <span class="price-alt">{{ formatAlt(currentPrice) }}</span>
          </div>

          <p class="stock" :class="stockClass">
            <i aria-hidden="true"></i>
            <span v-if="!selectedVariant || selectedVariant.stockQuantity <= 0">Cette taille est épuisée pour le moment</span>
            <span v-else-if="selectedVariant.stockQuantity <= 3">Plus que {{ selectedVariant.stockQuantity }} pièce{{ selectedVariant.stockQuantity > 1 ? 's' : '' }} à Dakar</span>
            <span v-else>En stock à Dakar · livraison en 24 h</span>
          </p>

          <!-- Coloris -->
          <div v-if="uniqueColors.length > 1 || uniqueColors[0] !== 'Unique'" class="pick">
            <div class="pick-h">
              <span>Coloris</span>
              <b>{{ selectedVariant?.color }}</b>
            </div>
            <div class="opts">
              <button
                v-for="c in uniqueColors"
                :key="c"
                type="button"
                class="opt"
                :class="{ off: !colorInStock(c) }"
                :aria-pressed="selectedVariant?.color === c"
                @click="selectColor(c)"
              >
                {{ c }}
              </button>
            </div>
          </div>

          <!-- Pointure / format -->
          <div class="pick">
            <div class="pick-h">
              <span>{{ isShoe ? 'Pointure' : 'Format' }}</span>
              <b>{{ selectedVariant?.sizeOrShoeSize }}</b>
              <router-link v-if="isShoe" to="/faq-livraison" class="pick-link">Échange sous 48 h</router-link>
            </div>
            <div class="opts">
              <button
                v-for="v in availableSizesForColor"
                :key="v.id"
                type="button"
                class="opt"
                :class="{ sq: isShoe }"
                :disabled="v.stockQuantity <= 0"
                :aria-pressed="selectedVariant?.id === v.id"
                @click="selectVariant(v)"
              >
                {{ v.sizeOrShoeSize }}
              </button>
            </div>
          </div>

          <!-- Achat -->
          <div class="buy">
            <div class="qty" role="group" aria-label="Quantité">
              <button type="button" aria-label="Diminuer la quantité" :disabled="quantity <= 1" @click="quantity--">−</button>
              <span aria-live="polite">{{ quantity }}</span>
              <button
                type="button"
                aria-label="Augmenter la quantité"
                :disabled="quantity >= (selectedVariant?.stockQuantity || 1)"
                @click="quantity++"
              >
                +
              </button>
            </div>
            <button
              type="button"
              class="btn gold add"
              :disabled="!selectedVariant || selectedVariant.stockQuantity <= 0"
              @click="addToCart"
            >
              {{ selectedVariant && selectedVariant.stockQuantity > 0 ? 'Ajouter au panier' : 'Épuisé' }}
            </button>
          </div>

          <button
            type="button"
            class="wa-link"
            :disabled="!selectedVariant || selectedVariant.stockQuantity <= 0"
            @click="orderProductByPhone"
          >
            <IconWhatsApp className="w-4 h-4" />
            Une question ? Commander sur WhatsApp
          </button>

          <!-- Réassurance -->
          <ul class="perks">
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.7" /><circle cx="17" cy="17.5" r="1.7" /></svg>
              Livraison 24 h à Dakar
            </li>
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" /><path d="M9 12l2 2 4-4" /></svg>
              Paiement à la livraison
            </li>
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 0 1 14-5l2 2M20 12a8 8 0 0 1-14 5l-2-2M20 4v5h-5M4 20v-5h5" /></svg>
              {{ isShoe ? 'Échange de pointure 48 h' : 'Emballage cadeau soigné' }}
            </li>
          </ul>

          <!-- Détails repliables -->
          <details class="acc" open>
            <summary>Description</summary>
            <p>{{ product.description }}</p>
          </details>
          <details class="acc">
            <summary>Livraison & paiement</summary>
            <p>
              Livraison sous 24 h à Dakar, offerte. Banlieue et régions : expédition sous 24 à 48 h, frais confirmés
              sur WhatsApp. Vous payez à la réception du colis, en espèces ou par mobile money.
            </p>
          </details>
          <details v-if="isShoe" class="acc">
            <summary>Pointures & échanges</summary>
            <p>
              Nos modèles chaussent normalement. La pointure ne convient pas ? Nous l'échangeons sous 48 h, article non porté
              et dans sa boîte. <router-link to="/faq-livraison">Voir toutes les conditions</router-link>
            </p>
          </details>
        </section>
      </div>

      <!-- Article introuvable ou retiré du catalogue -->
      <div v-else class="empty">
        <h1>{{ loadError ? 'Impossible de charger cet article.' : 'Cet article n\'est plus disponible.' }}</h1>
        <p>{{ loadError ? 'Vérifiez votre connexion puis réessayez.' : 'Il a peut-être été vendu ou retiré de la collection.' }}</p>
        <div class="empty-acts">
          <button v-if="loadError" type="button" class="btn line" @click="loadProduct">Réessayer</button>
          <router-link to="/catalog" class="btn gold">Voir toute la collection</router-link>
        </div>
      </div>

      <!-- Vous aimerez aussi -->
      <section v-if="related.length > 0" class="related" aria-label="Articles similaires">
        <h2>Vous aimerez aussi</h2>
        <div class="rel-grid">
          <ProductCard v-for="p in related" :key="p.id" :product="p" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { setPageMeta } from '../utils/seo';
import { useRoute } from 'vue-router';
import { ProductService } from '../services/api';
import { useCartStore } from '../stores/cart';
import { useCurrencyStore } from '../stores/currency';
import { usePhoneStore } from '../stores/phone';
import IconWhatsApp from '../components/icons/IconWhatsApp.vue';
import ProductCard from '../components/ProductCard.vue';

const route = useRoute();
const cartStore = useCartStore();
const currencyStore = useCurrencyStore();
const phoneStore = usePhoneStore();

const product = ref<any>(null);
const loading = ref(true);
const loadError = ref(false);
const activeImage = ref('');
const selectedVariant = ref<any>(null);
const quantity = ref(1);
const related = ref<any[]>([]);

/** Change de variante en gardant une quantité compatible avec son stock */
const selectVariant = (v: any) => {
  selectedVariant.value = v;
  const max = Math.max(1, v?.stockQuantity || 0);
  if (quantity.value > max) quantity.value = max;
};

const isShoe = computed(
  () => product.value?.category?.type === 'CHAUSSURE' || String(product.value?.categoryId || '').includes('shoe')
);

const categoryLink = computed(() => (isShoe.value ? '/catalog?type=CHAUSSURE' : '/catalog?type=SAC'));

const currentPrice = computed(() => {
  if (!product.value) return 0;
  return (product.value.basePrice || 0) + (selectedVariant.value?.priceAdjustment || 0);
});

const discount = computed(() => {
  const op = Number(product.value?.originalPrice);
  const bp = Number(product.value?.basePrice);
  return op > bp && bp > 0 ? Math.round((1 - bp / op) * 100) : 0;
});

/** Prix principal dans la devise choisie, prix secondaire dans l'autre */
const formatMain = (n: number) => (currencyStore.isEur ? currencyStore.toEurOnly(n) : currencyStore.toXofOnly(n));
const formatAlt = (n: number) => (currencyStore.isEur ? currencyStore.toXofOnly(n) : `≈ ${currencyStore.toEurOnly(n)}`);

const activeImageAlt = computed(() => {
  const img = product.value?.images?.find((i: any) => i.minioUrl === activeImage.value);
  return img?.altText || product.value?.name || '';
});

const stockClass = computed(() => {
  const s = selectedVariant.value?.stockQuantity || 0;
  return s <= 0 ? 'out' : s <= 3 ? 'low' : 'ok';
});

const uniqueColors = computed<string[]>(() =>
  Array.from(new Set((product.value?.variants || []).map((v: any) => v.color as string)))
);

const colorInStock = (color: string) =>
  (product.value?.variants || []).some((v: any) => v.color === color && v.stockQuantity > 0);

const availableSizesForColor = computed(() => {
  if (!product.value?.variants || !selectedVariant.value) return [];
  return product.value.variants.filter((v: any) => v.color === selectedVariant.value.color);
});

const selectColor = (color: string) => {
  // Même pointure si elle existe dans ce coloris, sinon la première disponible
  const ofColor = product.value.variants.filter((v: any) => v.color === color);
  const match =
    ofColor.find((v: any) => v.sizeOrShoeSize === selectedVariant.value?.sizeOrShoeSize && v.stockQuantity > 0) ||
    ofColor.find((v: any) => v.stockQuantity > 0) ||
    ofColor[0];
  if (match) selectVariant(match);
};

const orderProductByPhone = () => {
  if (!product.value || !selectedVariant.value) return;
  const photoUrl = phoneStore.toAbsolutePhotoUrl(activeImage.value);
  const summary = `${product.value.name} (${selectedVariant.value.color} / ${selectedVariant.value.sizeOrShoeSize} x${quantity.value})${photoUrl ? `\nPhoto : ${photoUrl}` : ''} - Total: ${currencyStore.toXofOnly(currentPrice.value * quantity.value)}`;
  phoneStore.openModal(summary, activeImage.value);
};

const addToCart = () => {
  if (!selectedVariant.value || !product.value || selectedVariant.value.stockQuantity <= 0) return;
  cartStore.addItem({
    variantId: selectedVariant.value.id,
    productId: product.value.id,
    productName: product.value.name,
    imageUrl: activeImage.value,
    color: selectedVariant.value.color,
    sizeOrShoeSize: selectedVariant.value.sizeOrShoeSize,
    price: currentPrice.value,
    quantity: quantity.value,
    maxStock: selectedVariant.value.stockQuantity,
  });
};

/** 4 articles de la même catégorie (ou du même univers) pour prolonger la visite */
const loadRelated = async (p: any) => {
  try {
    const res = await ProductService.getAll();
    const all: any[] = Array.isArray(res.data?.data) ? res.data.data : [];
    const others = all.filter((x) => x.id !== p.id);
    const sameCat = others.filter((x) => x.categoryId === p.categoryId);
    const sameUniverse = others.filter(
      (x) => x.categoryId !== p.categoryId && String(x.categoryId).includes('shoe') === String(p.categoryId).includes('shoe')
    );
    related.value = [...sameCat, ...sameUniverse].slice(0, 4);
  } catch {
    related.value = [];
  }
};

const loadProduct = async () => {
  const slug = route.params.slug as string;
  if (!slug) return;
  loading.value = true;
  loadError.value = false;
  product.value = null;
  selectedVariant.value = null;
  activeImage.value = '';
  quantity.value = 1;
  related.value = [];
  try {
    const res = await ProductService.getByIdOrSlug(slug);
    product.value = res.data.data;

    if (product.value.images && product.value.images.length > 0) {
      activeImage.value = product.value.images[0].minioUrl;
    }

    // Première variante EN STOCK (et non la première tout court, souvent épuisée)
    const variants = product.value.variants || [];
    selectedVariant.value = variants.find((v: any) => v.stockQuantity > 0) || variants[0] || null;

    setPageMeta({
      title: `${product.value.name} — Jumelles Store Dakar`,
      description: product.value.description,
      image: product.value.images?.[0]?.minioUrl,
      path: `/product/${product.value.slug}`,
    });
    void loadRelated(product.value);
  } catch (err: any) {
    // 404 : article retiré ; autre erreur : problème réseau, on propose de réessayer
    loadError.value = err?.response?.status !== 404;
    console.error('Erreur chargement détail produit:', err);
  } finally {
    loading.value = false;
  }
};

// Rechargé aussi quand on passe d'un article à l'autre (le composant est réutilisé par le routeur)
watch(() => route.params.slug, () => void loadProduct(), { immediate: true });
</script>

<style scoped>
.pd-page {
  padding: 14px 0 40px;
}

.crumb {
  display: flex;
  flex-wrap: nowrap;
  gap: 6px;
  font-size: 12px;
  color: var(--mut);
  margin-bottom: 14px;
  white-space: nowrap;
  overflow: hidden;
}
.crumb a:hover {
  color: var(--gold);
}
.crumb .cur {
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--tx);
}

.pd-grid {
  display: grid;
  gap: 22px;
}

/* ---------- Galerie ---------- */
.gal-main {
  position: relative;
  aspect-ratio: 4 / 5;
  border-radius: 22px;
  overflow: hidden;
  background: #efe7dc;
  box-shadow: var(--shadow);
}
.gal-main img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.tag.promo {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #a63333;
  color: #fff;
  font: 700 11px/1 system-ui, sans-serif;
  padding: 6px 10px;
  border-radius: 999px;
}
.gal-thumbs {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  overflow-x: auto;
  scrollbar-width: none;
}
.gal-thumbs::-webkit-scrollbar {
  display: none;
}
.gal-thumbs button {
  flex: none;
  width: 64px;
  height: 80px;
  padding: 0;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid transparent;
  background: #efe7dc;
  opacity: 0.65;
  cursor: pointer;
  transition: opacity 0.15s, border-color 0.15s;
}
.gal-thumbs button[aria-pressed='true'] {
  opacity: 1;
  border-color: var(--gold);
}
.gal-thumbs img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ---------- Informations ---------- */
.info h1 {
  font-size: clamp(26px, 6.5vw, 36px);
  font-weight: 400;
  line-height: 1.15;
  margin: 8px 0 12px;
}
.price-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 10px;
}
.price {
  font-size: 24px;
  font-weight: 800;
  color: var(--tx);
}
.price-row s {
  color: var(--mut);
  font-size: 15px;
}
.price-alt {
  font-size: 13px;
  color: var(--mut);
}

.stock {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0 4px;
  font-size: 13.5px;
  font-weight: 600;
}
.stock i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex: none;
}
.stock.ok {
  color: #1f7a4a;
}
.stock.ok i {
  background: #1f9d55;
}
.stock.low {
  color: #8a5a12;
}
.stock.low i {
  background: var(--gold);
}
.stock.out {
  color: #a63333;
}
.stock.out i {
  background: #a63333;
}

.pick {
  margin-top: 18px;
}
.pick-h {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 13.5px;
}
.pick-h span {
  color: var(--mut);
}
.pick-link {
  margin-left: auto;
  font-size: 12.5px;
  color: var(--gold);
  font-weight: 600;
  text-decoration: underline;
}
.opts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.opt {
  min-height: 42px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid var(--bd);
  background: var(--card);
  color: var(--tx);
  font-weight: 600;
  font-size: 13.5px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}
.opt:hover:not(:disabled) {
  border-color: var(--gold);
}
.opt.sq {
  min-width: 48px;
  padding: 0 10px;
}
.opt.off {
  color: var(--mut);
}
.opt:disabled {
  color: #b9aea4;
  background: transparent;
  text-decoration: line-through;
  cursor: not-allowed;
}
.opt[aria-pressed='true'] {
  background: var(--ink);
  border-color: var(--ink);
  color: var(--on-ink);
  text-decoration: none;
}

.buy {
  display: flex;
  gap: 10px;
  margin-top: 22px;
}
.qty {
  display: flex;
  align-items: center;
  border: 1px solid var(--bd);
  border-radius: 16px;
  background: var(--card);
}
.qty button {
  width: 42px;
  height: 50px;
  border: 0;
  background: transparent;
  font-size: 20px;
  color: var(--tx);
  cursor: pointer;
}
.qty button:disabled {
  color: #cdc3b8;
  cursor: not-allowed;
}
.qty span {
  min-width: 22px;
  text-align: center;
  font-weight: 700;
}
.add {
  flex: 1;
}
.add:disabled {
  background: #ddd3c7;
  color: var(--mut);
  box-shadow: none;
  cursor: not-allowed;
}

.wa-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin-top: 10px;
  min-height: 46px;
  border-radius: 14px;
  border: 1px solid #cfe9da;
  background: #f1faf4;
  color: #17643a;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
}
.wa-link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.perks {
  list-style: none;
  padding: 0;
  margin: 22px 0 8px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.perks li {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
  padding: 12px 6px;
  border-radius: 14px;
  background: var(--card);
  border: 1px solid var(--bd);
  font-size: 11.5px;
  font-weight: 600;
  line-height: 1.3;
}
.perks svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: var(--gold);
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.acc {
  border-bottom: 1px solid var(--bd);
}
.acc summary {
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
}
.acc summary::-webkit-details-marker {
  display: none;
}
.acc summary::after {
  content: '+';
  font-size: 20px;
  font-weight: 400;
  color: var(--gold);
}
.acc[open] summary::after {
  content: '−';
}
.acc p {
  margin: 0 0 16px;
  color: var(--mut);
  font-size: 14.5px;
}
.acc a {
  color: var(--gold);
  text-decoration: underline;
}

/* ---------- Similaires ---------- */
.related {
  margin-top: 40px;
}
.related h2 {
  font-weight: 400;
  font-size: 26px;
  margin: 0 0 14px;
}
.rel-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

/* ---------- États ---------- */
.empty {
  text-align: center;
  padding: 56px 16px;
  background: var(--card);
  border: 1px solid var(--bd);
  border-radius: 22px;
}
.empty h1 {
  font-weight: 400;
  font-size: 26px;
  margin: 0 0 8px;
}
.empty p {
  color: var(--mut);
  margin: 0 0 20px;
}
.empty-acts {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}
.empty-acts .btn {
  width: auto;
}

.skel {
  border-radius: 14px;
  background: linear-gradient(100deg, #efe7dc 40%, #f7f1e9 50%, #efe7dc 60%) 0 0 / 200% 100%;
  animation: shimmer 1.3s linear infinite;
}
.skel.img {
  aspect-ratio: 4 / 5;
  border-radius: 22px;
}
.skel-col {
  display: grid;
  gap: 12px;
  align-content: start;
}
.skel.l1 {
  height: 34px;
  width: 80%;
}
.skel.l2 {
  height: 26px;
  width: 40%;
}
.skel.l3 {
  height: 120px;
}
@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}

@media (min-width: 900px) {
  .pd-page {
    padding-top: 22px;
  }
  .pd-grid {
    grid-template-columns: 1.1fr 1fr;
    gap: 48px;
    align-items: start;
  }
  .gal {
    position: sticky;
    top: 76px;
  }
  .rel-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 18px;
  }
}
</style>
