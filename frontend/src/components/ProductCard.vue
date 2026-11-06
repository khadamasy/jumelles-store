<template>
  <article class="pc">
    <router-link :to="productUrl" class="pc-img" :aria-label="product.name">
      <img :src="primaryImage" :alt="product.name" loading="lazy" decoding="async" />
      <span v-if="discount > 0" class="pc-tag promo">-{{ discount }}%</span>
      <span v-if="totalStock === 0" class="pc-tag out">Bientôt de retour</span>
      <span v-else-if="totalStock <= 3" class="pc-tag low">Dernières pièces</span>
    </router-link>

    <button
      v-if="totalStock > 0"
      type="button"
      class="pc-add"
      :aria-label="needsChoice ? `Choisir la taille ou le coloris : ${product.name}` : `Ajouter au panier : ${product.name}`"
      @click="quickAdd"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path v-if="needsChoice" d="M5 12h14M13 6l6 6-6 6" />
        <path v-else d="M12 5v14M5 12h14" />
      </svg>
    </button>

    <router-link :to="productUrl" class="pc-in">
      <span class="pc-cat">{{ categoryLabel }}</span>
      <h3>{{ product.name }}</h3>
      <div class="pc-price">
        <span>{{ formatFcfa(product.basePrice) }}</span>
        <s v-if="discount > 0">{{ formatFcfa(product.originalPrice) }}</s>
      </div>
      <span v-if="colorCount > 1" class="pc-meta">{{ colorCount }} coloris</span>
    </router-link>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
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
  background: var(--card);
  border: 1px solid var(--bd);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(36, 29, 25, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}
.pc:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

/* Toutes les photos dans le même cadre 4:5, quelle que soit leur taille d'origine */
.pc-img {
  position: relative;
  display: block;
  aspect-ratio: 4 / 5;
  background: #efe7dc;
  overflow: hidden;
}
.pc-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}
.pc:hover .pc-img img {
  transform: scale(1.04);
}

.pc-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  font: 700 10px/1 system-ui, sans-serif;
  letter-spacing: 0.04em;
  padding: 5px 8px;
  border-radius: 999px;
}
.pc-tag.promo {
  background: #a63333;
  color: #fff;
}
.pc-tag.low {
  background: rgba(255, 255, 255, 0.92);
  color: #7a5214;
}
.pc-tag.out {
  background: rgba(23, 17, 14, 0.82);
  color: var(--on-ink);
}
.pc-tag.promo + .pc-tag {
  top: 32px;
}

.pc-add {
  position: absolute;
  right: 8px;
  /* En bas à droite de la photo : un % de marge se calcule sur la LARGEUR de la carte,
     donc 125 % = hauteur de la photo au format 4:5 */
  top: 0;
  margin-top: calc(125% - 46px);
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 0;
  background: rgba(255, 255, 255, 0.94);
  color: var(--ink);
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  transition: transform 0.15s, background 0.15s;
}
.pc-add:hover {
  background: var(--gold2);
}
.pc-add:active {
  transform: scale(0.9);
}
.pc-add svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.pc-in {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 10px 12px 12px;
  flex: 1;
}
.pc-cat {
  font: 700 9.5px/1 system-ui, sans-serif;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gold);
}
.pc-in h3 {
  margin: 2px 0 0;
  font-size: 14.5px;
  font-weight: 400;
  line-height: 1.3;
  color: var(--tx);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.pc-price {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: auto;
  padding-top: 4px;
  font-weight: 800;
  font-size: 14px;
  color: var(--tx);
}
.pc-price s {
  font-weight: 500;
  font-size: 12px;
  color: var(--mut);
}
.pc-meta {
  font-size: 11.5px;
  color: var(--mut);
}

@media (min-width: 720px) {
  .pc-in h3 {
    font-size: 16px;
  }
  .pc-price {
    font-size: 15px;
  }
}
</style>
