<template>
  <div class="pd-page">
    <div class="wrap">
      <nav class="crumb pd-crumb" aria-label="Fil d'Ariane">
        <router-link to="/">Accueil</router-link>
        <ChevronRight class="crumb-sep" aria-hidden="true" />
        <router-link :to="categoryLink">{{ isShoe ? 'Chaussures' : 'Sacs' }}</router-link>
        <ChevronRight class="crumb-sep" aria-hidden="true" />
        <span class="cur" aria-current="page">{{ product?.name || 'Article' }}</span>
      </nav>

      <!-- Chargement -->
      <div v-if="loading" class="pd-grid" aria-hidden="true">
        <div class="skel sk-img"></div>
        <div class="sk-col">
          <div class="skel sk-l0"></div>
          <div class="skel sk-l1"></div>
          <div class="skel sk-l2"></div>
          <div class="skel sk-l3"></div>
          <div class="skel sk-l4"></div>
        </div>
      </div>

      <!-- Fiche article -->
      <div v-else-if="product" class="pd-grid">
        <!-- Galerie -->
        <section class="gal" :class="{ multi: product.images && product.images.length > 1 }" aria-label="Photos de l'article">
          <div class="gal-main">
            <Transition name="img-fade">
              <img :key="activeImage" :src="activeImage" :alt="activeImageAlt" />
            </Transition>
            <span v-if="discount > 0" class="gal-tag tnum">-{{ discount }}%</span>
            <button type="button" class="gal-zoom" aria-label="Voir la photo en grand" @click="openLightbox">
              <span class="gal-zoom-ic"><Maximize2 aria-hidden="true" /></span>
            </button>
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
              <img loading="lazy" decoding="async" :src="img.minioUrl" alt="" />
            </button>
          </div>
        </section>

        <!-- Informations et achat -->
        <section class="info">
          <span class="eyebrow">{{ product.category?.name || (isShoe ? 'Chaussures' : 'Maroquinerie') }}</span>
          <h1>{{ product.name }}</h1>

          <div class="price-row">
            <span class="price tnum">{{ formatMain(currentPrice) }}</span>
            <s v-if="discount > 0" class="tnum">{{ formatMain(product.originalPrice) }}</s>
            <span class="price-alt tnum">{{ formatAlt(currentPrice) }}</span>
          </div>

          <p class="stock" :class="stockClass">
            <i aria-hidden="true"></i>
            <span v-if="!selectedVariant || selectedVariant.stockQuantity <= 0">Cette taille est épuisée pour le moment</span>
            <span v-else-if="selectedVariant.stockQuantity <= 3">
              Plus que {{ selectedVariant.stockQuantity }} pièce{{ selectedVariant.stockQuantity > 1 ? 's' : '' }} à Dakar
            </span>
            <span v-else>En stock à Dakar · livraison en 24 h</span>
          </p>

          <div class="picks">
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
                <router-link v-if="isShoe" to="/faq-livraison" class="pick-link">
                  <Repeat aria-hidden="true" />Échange sous 48 h
                </router-link>
              </div>
              <div class="opts">
                <button
                  v-for="v in availableSizesForColor"
                  :key="v.id"
                  type="button"
                  class="opt tnum"
                  :class="{ sq: isShoe }"
                  :disabled="v.stockQuantity <= 0"
                  :aria-pressed="selectedVariant?.id === v.id"
                  @click="selectVariant(v)"
                >
                  {{ v.sizeOrShoeSize }}
                </button>
              </div>
            </div>
          </div>

          <!-- Achat -->
          <div class="buy">
            <UiQty v-model="quantity" :min="1" :max="selectedVariant?.stockQuantity || 1" />
            <button
              type="button"
              class="btn gold lg add"
              :disabled="!selectedVariant || selectedVariant.stockQuantity <= 0"
              @click="addToCart"
            >
              <ShoppingBag aria-hidden="true" />
              {{ selectedVariant && selectedVariant.stockQuantity > 0 ? 'Ajouter au panier' : 'Épuisé' }}
            </button>
          </div>

          <button
            type="button"
            class="btn line block wa-link"
            :disabled="!selectedVariant || selectedVariant.stockQuantity <= 0"
            @click="orderProductByPhone"
          >
            <IconWhatsApp className="w-4 h-4" />
            Une question ? Commander sur WhatsApp
          </button>

          <!-- Réassurance -->
          <ul class="perks">
            <li><Truck aria-hidden="true" /><span>Livraison 24 h<br />à Dakar</span></li>
            <li><Banknote aria-hidden="true" /><span>Paiement<br />à la livraison</span></li>
            <li>
              <component :is="isShoe ? Repeat : Gift" aria-hidden="true" />
              <span v-if="isShoe">Échange de<br />pointure 48 h</span>
              <span v-else>Emballage<br />cadeau soigné</span>
            </li>
          </ul>

          <!-- Détails repliables -->
          <div class="accs">
            <details class="acc" open>
              <summary>Description<ChevronDown aria-hidden="true" /></summary>
              <p>{{ product.description }}</p>
            </details>
            <details class="acc">
              <summary>Livraison & paiement<ChevronDown aria-hidden="true" /></summary>
              <p>
                Livraison sous 24 h à Dakar, offerte. Banlieue et régions : expédition sous 24 à 48 h, frais confirmés
                sur WhatsApp. Vous payez à la réception du colis, en espèces ou par mobile money.
              </p>
            </details>
            <details v-if="isShoe" class="acc">
              <summary>Pointures & échanges<ChevronDown aria-hidden="true" /></summary>
              <p>
                Nos modèles chaussent normalement. La pointure ne convient pas ? Nous l'échangeons sous 48 h, article non
                porté et dans sa boîte. <router-link to="/faq-livraison">Voir toutes les conditions</router-link>
              </p>
            </details>
          </div>
        </section>
      </div>

      <!-- Article introuvable ou retiré du catalogue -->
      <UiEmpty
        v-else
        heading-tag="h1"
        :title="loadError ? 'Impossible de charger cet article' : 'Cet article n\'est plus disponible'"
        :text="loadError ? 'Vérifiez votre connexion puis réessayez.' : 'Il a peut-être été vendu ou retiré de la collection.'"
      >
        <template #icon>
          <WifiOff v-if="loadError" />
          <PackageX v-else />
        </template>
        <button v-if="loadError" type="button" class="btn line" @click="loadProduct">
          <RotateCw aria-hidden="true" />Réessayer
        </button>
        <router-link to="/catalog" class="btn dark">Voir toute la collection</router-link>
      </UiEmpty>

      <!-- Visionneuse plein écran -->
      <ProductLightbox
        :open="lightboxOpen"
        :images="lightboxImages"
        :start-index="lightboxStart"
        @close="lightboxOpen = false"
      />

      <!-- Vous aimerez aussi -->
      <section v-if="related.length > 0" class="related" aria-labelledby="rel-title">
        <h2 id="rel-title">Vous aimerez aussi</h2>
        <div class="rel-grid stagger">
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
import UiQty from '../components/ui/UiQty.vue';
import UiEmpty from '../components/ui/UiEmpty.vue';
import ProductLightbox from '../components/ProductLightbox.vue';
import {
  ChevronRight,
  ChevronDown,
  ShoppingBag,
  Truck,
  Banknote,
  Repeat,
  Gift,
  WifiOff,
  PackageX,
  RotateCw,
  Maximize2,
} from 'lucide-vue-next';

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

/** Visionneuse plein écran : toutes les photos, ouverte sur celle affichée */
const lightboxOpen = ref(false);
const lightboxStart = ref(0);
const lightboxImages = computed<Array<{ src: string; alt: string }>>(() => {
  const imgs = product.value?.images || [];
  if (imgs.length === 0) return activeImage.value ? [{ src: activeImage.value, alt: product.value?.name || '' }] : [];
  return imgs.map((i: any) => ({ src: i.minioUrl, alt: i.altText || product.value?.name || '' }));
});
const openLightbox = () => {
  const i = lightboxImages.value.findIndex((img) => img.src === activeImage.value);
  lightboxStart.value = Math.max(0, i);
  lightboxOpen.value = true;
};

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
  padding: var(--s-4) 0 var(--s-10);
}
.pd-crumb {
  flex-wrap: nowrap;
  white-space: nowrap;
  overflow: hidden;
}
.pd-crumb .cur {
  overflow: hidden;
  text-overflow: ellipsis;
}
.crumb-sep {
  width: 12px;
  height: 12px;
  flex: none;
  opacity: 0.6;
}

.pd-grid {
  display: grid;
  gap: var(--s-6);
}

/* ----- Chargement ----- */
.sk-img {
  aspect-ratio: 4 / 5;
  border-radius: var(--r-xl);
}
.sk-col {
  display: grid;
  gap: var(--s-3);
  align-content: start;
}
.sk-l0 {
  height: 12px;
  width: 30%;
}
.sk-l1 {
  height: 36px;
  width: 85%;
}
.sk-l2 {
  height: 24px;
  width: 40%;
}
.sk-l3 {
  height: 48px;
  margin-top: var(--s-4);
}
.sk-l4 {
  height: 56px;
}

/* ----- Galerie ----- */
.gal-main {
  position: relative;
  display: grid;
  /* Cadre toujours au format photo (4:5) : sa largeur découle de la hauteur disponible,
     la photo n'est donc jamais rognée. Téléphone : 60 % de la hauteur de l'écran au plus. */
  aspect-ratio: 4 / 5;
  width: 100%;
  max-width: calc(60svh * 0.8);
  margin-inline: auto;
  border-radius: var(--r-xl);
  overflow: hidden;
  background: var(--bg-sunken);
  box-shadow: var(--sh-2);
}
.gal-main img {
  grid-area: 1 / 1;
  width: 100%;
  height: 100%;
  /* Photo entière (bandes discrètes si son format diffère légèrement du cadre) */
  object-fit: contain;
}
.img-fade-enter-active,
.img-fade-leave-active {
  transition: opacity var(--dur-3) var(--ease-out);
}
.img-fade-enter-from,
.img-fade-leave-to {
  opacity: 0;
}
.gal-tag {
  position: absolute;
  top: var(--s-3);
  left: var(--s-3);
  padding: 6px 10px;
  border-radius: var(--r-full);
  background: var(--danger);
  color: #fff;
  font: 700 var(--fs-xs) / 1 var(--font-sans);
}
/* Toute la photo est cliquable : ouvre la visionneuse */
.gal-zoom {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: var(--s-3);
  border: 0;
  background: transparent;
  cursor: zoom-in;
}
.gal-zoom-ic {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgb(255 255 255 / 0.9);
  color: var(--ink);
  box-shadow: var(--sh-2);
  transition: transform var(--dur-2) var(--ease-spring);
}
.gal-zoom:hover .gal-zoom-ic {
  transform: scale(1.1);
}
.gal-zoom-ic svg {
  width: 18px;
  height: 18px;
}
.gal-zoom:focus-visible {
  outline-offset: -4px;
}

.gal-thumbs {
  display: flex;
  gap: var(--s-2);
  margin-top: var(--s-3);
  overflow-x: auto;
  scrollbar-width: none;
  padding: 2px;
}
.gal-thumbs::-webkit-scrollbar {
  display: none;
}
.gal-thumbs button {
  flex: none;
  width: 64px;
  height: 80px;
  padding: 0;
  border: 0;
  border-radius: var(--r-sm);
  overflow: hidden;
  background: var(--bg-sunken);
  cursor: pointer;
  opacity: 0.6;
  box-shadow: 0 0 0 1px var(--border);
  transition: opacity var(--dur-2), box-shadow var(--dur-2), transform var(--dur-1);
}
.gal-thumbs button:hover {
  opacity: 0.9;
}
.gal-thumbs button:active {
  transform: scale(0.95);
}
.gal-thumbs button[aria-pressed='true'] {
  opacity: 1;
  box-shadow: 0 0 0 2px var(--ink);
}
.gal-thumbs img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ----- Informations ----- */
.info h1 {
  margin: var(--s-2) 0 var(--s-3);
  font-size: var(--fs-3xl);
  line-height: var(--lh-tight);
  font-weight: 400;
}
.price-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px var(--s-3);
}
.price {
  font-family: var(--font-display);
  font-size: var(--fs-xl);
  font-weight: 500;
}
.price-row s {
  color: var(--text-faint);
  font-size: var(--fs-sm);
}
.price-alt {
  color: var(--text-muted);
  font-size: var(--fs-sm);
}

.stock {
  display: inline-flex;
  align-items: center;
  gap: var(--s-2);
  margin: var(--s-3) 0 0;
  padding: 6px 12px;
  border-radius: var(--r-full);
  font-size: var(--fs-xs);
  font-weight: 600;
}
.stock i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}
.stock.ok {
  background: var(--success-soft);
  color: var(--success);
}
.stock.low {
  background: var(--warning-soft);
  color: var(--warning);
}
.stock.low i {
  animation: blink 1.6s var(--ease-in-out) infinite;
}
.stock.out {
  background: var(--danger-soft);
  color: var(--danger);
}

.picks {
  display: grid;
  gap: var(--s-5);
  margin-top: var(--s-6);
}
.pick-h {
  display: flex;
  align-items: baseline;
  gap: var(--s-2);
  margin-bottom: var(--s-3);
  font-size: var(--fs-sm);
}
.pick-h span {
  font-weight: 700;
}
.pick-h b {
  font-weight: 500;
  color: var(--text-muted);
}
.pick-link {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--fs-xs);
  font-weight: 600;
  color: var(--accent-text);
}
.pick-link svg {
  width: 13px;
  height: 13px;
}
.pick-link:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}
.opts {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-2);
}
.opt {
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
.opt:hover:not(:disabled) {
  border-color: var(--text-faint);
}
.opt:active:not(:disabled) {
  transform: scale(0.96);
}
.opt.sq {
  width: 54px;
  padding: 0;
}
.opt.off,
.opt:disabled {
  color: var(--text-faint);
  background: var(--bg-sunken);
  text-decoration: line-through;
}
.opt:disabled {
  cursor: not-allowed;
}
.opt[aria-pressed='true'] {
  border-color: var(--ink);
  background: var(--ink);
  color: var(--on-ink);
  text-decoration: none;
}

.buy {
  display: flex;
  gap: var(--s-2);
  margin-top: var(--s-6);
}
.buy .add {
  flex: 1;
}
.wa-link {
  margin-top: var(--s-2);
  color: var(--wa);
  font-size: var(--fs-sm);
}

.perks {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--s-2);
  list-style: none;
  margin: var(--s-6) 0 0;
  padding: 0;
}
.perks li {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: var(--s-3) var(--s-2);
  border-radius: var(--r-md);
  background: var(--surface);
  border: 1px solid var(--border);
  font-size: var(--fs-2xs);
  font-weight: 600;
  line-height: 1.3;
  text-align: center;
  color: var(--text-muted);
}
.perks svg {
  width: 20px;
  height: 20px;
  color: var(--accent-text);
  stroke-width: 1.6;
}

.accs {
  margin-top: var(--s-6);
  border-top: 1px solid var(--border);
}
.acc {
  border-bottom: 1px solid var(--border);
}
.acc summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 56px;
  font-weight: 600;
  cursor: pointer;
  list-style: none;
}
.acc summary::-webkit-details-marker {
  display: none;
}
.acc summary svg {
  width: 18px;
  height: 18px;
  color: var(--text-muted);
  transition: transform var(--dur-3) var(--ease-out);
}
.acc[open] summary svg {
  transform: rotate(180deg);
}
.acc p {
  margin: 0 0 var(--s-5);
  color: var(--text-muted);
  font-size: var(--fs-sm);
  line-height: 1.65;
  white-space: pre-line;
  animation: rise-in var(--dur-3) var(--ease-out);
}
.acc p a {
  color: var(--accent-text);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* ----- Suggestions ----- */
.related {
  margin-top: var(--s-16);
}
.related h2 {
  margin: 0 0 var(--s-5);
  font-size: var(--fs-2xl);
}
.rel-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--s-4) var(--s-3);
}

@keyframes blink {
  50% {
    opacity: 0.35;
  }
}

/* ----- Tablette et plus ----- */
@media (min-width: 720px) {
  .pd-page {
    padding-top: var(--s-6);
  }
  .rel-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--s-8) var(--s-5);
  }
}

@media (min-width: 720px) {
  .gal-main {
    max-width: calc(70vh * 0.8);
  }
}

@media (min-width: 1024px) {
  .pd-grid {
    /* La galerie prend sa largeur naturelle, les informations le reste : pas de vide entre les deux */
    grid-template-columns: auto minmax(0, 1fr);
    gap: var(--s-12);
    align-items: start;
  }
  /* Ordinateur : photo entière visible dans la hauteur de l'écran, miniatures à gauche */
  .gal {
    position: sticky;
    top: calc(var(--header-h) + var(--s-4));
  }
  .gal.multi {
    display: grid;
    grid-template-columns: 72px minmax(0, 1fr);
    gap: var(--s-3);
    align-items: start;
  }
  .gal-main {
    grid-column: 2;
    grid-row: 1;
    width: calc(min(100vh - var(--header-h) - 120px, 720px) * 0.8);
    max-width: none;
    margin-inline: 0;
  }
  .gal-thumbs {
    grid-column: 1;
    grid-row: 1;
    flex-direction: column;
    margin-top: 0;
    max-height: min(calc(100vh - var(--header-h) - 120px), 720px);
    overflow-y: auto;
    overflow-x: visible;
  }
  .gal-thumbs button {
    width: 72px;
    height: 90px;
  }
  .info {
    padding-top: var(--s-4);
  }
}
</style>
