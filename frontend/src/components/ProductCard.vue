<template>
  <article class="pc" :class="{ soldout: totalStock === 0 }">
    <div class="pc-media">
      <router-link :to="productUrl" class="pc-img" :aria-label="product.name" tabindex="-1">
        <img :src="primaryImage" :alt="product.name" loading="lazy" decoding="async" />
      </router-link>
      <div class="pc-tags">
        <span v-if="discount > 0" class="pc-tag promo tnum">-{{ discount }}%</span>
        <span v-if="totalStock === 0" class="pc-tag out">Bientôt de retour</span>
        <span v-else-if="totalStock <= 3" class="pc-tag low">Dernières pièces</span>
      </div>
      <button
        v-if="totalStock > 0"
        type="button"
        class="pc-add"
        :aria-label="needsChoice ? `Choisir la taille ou le coloris : ${product.name}` : `Ajouter au panier : ${product.name}`"
        :title="needsChoice ? 'Choisir taille / coloris' : 'Ajouter au panier'"
        @click="quickAdd"
      >
        <ArrowRight v-if="needsChoice" aria-hidden="true" />
        <Plus v-else aria-hidden="true" />
      </button>
    </div>

    <router-link :to="productUrl" class="pc-in">
      <span class="pc-cat">{{ categoryLabel }}<template v-if="colorCount > 1"> · {{ colorCount }} coloris</template></span>
      <h3>{{ product.name }}</h3>
      <div class="pc-price tnum">
        <span>{{ formatFcfa(product.basePrice) }}</span>
        <s v-if="discount > 0">{{ formatFcfa(product.originalPrice) }}</s>
      </div>
    </router-link>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowRight, Plus } from 'lucide-vue-next';
import { useCartStore } from '../stores/cart';

const cartStore = useCartStore();
const router = useRouter();

const props = defineProps<{
  product: any;
}>();

const productUrl = computed(() => `/product/${props.product.slug || props.product.id}`);

const primaryImage = computed(() => {
  if (props.product.images && props.product.images.length > 0) {
    const primary = props.product.images.find((img: any) => img.isPrimary);
    return primary ? primary.minioUrl : props.product.images[0].minioUrl;
  }
  return '/products/sac-cadenas-camel.jpg';
});

const totalStock = computed(() =>
  (props.product.variants || []).reduce((sum: number, v: any) => sum + (v.stockQuantity || 0), 0)
);

const colorCount = computed(() => new Set((props.product.variants || []).map((v: any) => v.color)).size);

const discount = computed(() => {
  const op = Number(props.product.originalPrice);
  const bp = Number(props.product.basePrice);
  return op > bp && bp > 0 ? Math.round((1 - bp / op) * 100) : 0;
});

const categoryLabel = computed(() => {
  const id = String(props.product.categoryId || '');
  return id.includes('shoe') ? 'Chaussures' : 'Maroquinerie';
});

const formatFcfa = (n: number) => `${new Intl.NumberFormat('fr-FR').format(n || 0)} FCFA`;

const inStockVariants = computed(() =>
  (props.product.variants || []).filter((v: any) => v.stockQuantity > 0)
);

/** Plusieurs pointures / coloris disponibles : la cliente doit choisir sur la fiche article */
const needsChoice = computed(() => inStockVariants.value.length > 1);

const quickAdd = () => {
  if (needsChoice.value) {
    router.push(productUrl.value);
    return;
  }
  const availableVariant = inStockVariants.value[0];
  if (!availableVariant) return;

  cartStore.addItem({
    variantId: availableVariant.id,
    productId: props.product.id,
    productName: props.product.name,
    imageUrl: primaryImage.value,
    color: availableVariant.color || 'Standard',
    sizeOrShoeSize: availableVariant.sizeOrShoeSize || 'Unique',
    price: (props.product.basePrice || 0) + (availableVariant.priceAdjustment || 0),
    quantity: 1,
    maxStock: availableVariant.stockQuantity,
  });
};
</script>

<style scoped>
.pc {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.pc-media {
  position: relative;
  border-radius: var(--r-lg);
  overflow: hidden;
  background: var(--bg-sunken);
  isolation: isolate;
}
/* Toutes les photos dans le même cadre 4:5, quelle que soit leur taille d'origine */
.pc-img {
  display: block;
  aspect-ratio: 4 / 5;
}
.pc-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s var(--ease-out), opacity var(--dur-3);
}
.pc:hover .pc-img img {
  transform: scale(1.045);
}
.soldout .pc-img img {
  opacity: 0.6;
  filter: grayscale(0.4);
}

.pc-tags {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  pointer-events: none;
}
.pc-tag {
  padding: 5px 9px;
  border-radius: var(--r-full);
  font: 700 10.5px/1 var(--font-sans);
  letter-spacing: 0.03em;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
.pc-tag.promo {
  background: var(--danger);
  color: #fff;
}
.pc-tag.low {
  background: rgb(255 255 255 / 0.9);
  color: var(--accent-text);
}
.pc-tag.out {
  background: rgb(var(--c-sand-950) / 0.8);
  color: var(--on-ink);
}

.pc-add {
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 50%;
  background: rgb(255 255 255 / 0.94);
  color: var(--ink);
  cursor: pointer;
  box-shadow: var(--sh-2);
  transition: transform var(--dur-2) var(--ease-spring), opacity var(--dur-2), background-color var(--dur-2),
    color var(--dur-2);
}
.pc-add svg {
  width: 18px;
  height: 18px;
  stroke-width: 2.2;
}
.pc-add:hover {
  background: var(--ink);
  color: var(--on-ink);
  transform: scale(1.06);
}
.pc-add:active {
  transform: scale(0.9);
}

.pc-in {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: var(--s-3) 2px 0;
}
.pc-cat {
  font: 600 10.5px/1.2 var(--font-sans);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.pc-in h3 {
  margin: 0;
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  font-weight: 500;
  line-height: var(--lh-snug);
  letter-spacing: 0;
  color: var(--text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color var(--dur-2);
}
.pc-in:hover h3 {
  color: var(--accent-text);
}
.pc-price {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 2px 8px;
  font-weight: 700;
  font-size: var(--fs-sm);
  color: var(--text);
}
.pc-price s {
  font-weight: 500;
  font-size: var(--fs-xs);
  color: var(--text-faint);
}

/* Écran tactile : bouton toujours visible ; souris : il apparaît au survol */
@media (hover: hover) and (min-width: 720px) {
  .pc-add {
    opacity: 0;
    transform: translateY(8px);
  }
  .pc:hover .pc-add,
  .pc-add:focus-visible {
    opacity: 1;
    transform: none;
  }
}

@media (min-width: 720px) {
  .pc-in h3 {
    font-size: 15px;
  }
  .pc-price {
    font-size: 15px;
  }
}
</style>
