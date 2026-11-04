<template>
  <article class="jm-card" style="flex: initial; max-width: none; width: 100%">
    <div
      class="img"
      style="--g: linear-gradient(150deg, #c58a4a, #6b3f1f)"
    >
      <router-link :to="`/product/${product.slug || product.id}`" class="block w-full h-full">
        <img
          :src="primaryImage"
          :alt="product.name"
          loading="lazy"
          class="w-full h-full object-cover"
        />
      </router-link>

      <!-- Badge Réduction Promo si prix d'origine supérieur -->
      <span
        v-if="product.originalPrice && product.originalPrice > product.basePrice"
        class="absolute top-3 left-3 bg-rosewood-600 text-white text-[10px] tracking-wider uppercase font-black px-2.5 py-1 rounded-full shadow-md z-10"
      >
        -{{ Math.round((1 - product.basePrice / product.originalPrice) * 100) }}%
      </span>

      <!-- Badge Rupture -->
      <span
        v-if="totalStock === 0"
        class="absolute top-3 right-3 bg-rosewood-700/95 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md z-10"
      >
        Rupture
      </span>

      <!-- Bouton + Panier superposé sur l'image (identique à l'accueil) -->
      <button
        v-if="totalStock > 0"
        type="button"
        @click.stop="quickAdd"
        aria-label="Ajouter au panier"
        style="position: absolute; bottom: 10px; right: 10px; width: auto; min-height: 36px; padding: 0 12px; margin: 0; border-radius: 999px; background: rgba(23, 17, 14, 0.88); color: #f6ece0; border: 1px solid #d9ad5c; font-size: 12px; font-weight: 700; backdrop-filter: blur(6px); z-index: 2;"
      >
        + Panier
      </button>
    </div>

    <div class="in">
      <div>
        <router-link :to="`/product/${product.slug || product.id}`">
          <h3>{{ product.name }}</h3>
        </router-link>
        <span class="price">{{ formatFcfa(product.basePrice) }}</span>
      </div>
      <button
        type="button"
        :disabled="totalStock === 0"
        @click="quickAdd"
      >
        {{ totalStock > 0 ? 'Ajouter au panier' : 'Indisponible' }}
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCartStore } from '../stores/cart';

const cartStore = useCartStore();

const props = defineProps<{
  product: any;
}>();

const primaryImage = computed(() => {
  if (props.product.images && props.product.images.length > 0) {
    const primary = props.product.images.find((img: any) => img.isPrimary);
    return primary ? primary.minioUrl : props.product.images[0].minioUrl;
  }
  return '/products/sac-birkin-camel.jpg';
});

const totalStock = computed(() => {
  if (!props.product.variants) return 0;
  return props.product.variants.reduce((sum: number, v: any) => sum + (v.stockQuantity || 0), 0);
});

const formatFcfa = (n: number) => `${new Intl.NumberFormat('fr-FR').format(n || 0)} FCFA`;

const quickAdd = () => {
  const availableVariant =
    props.product.variants?.find((v: any) => v.stockQuantity > 0) ||
    props.product.variants?.[0];
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
    maxStock: availableVariant.stockQuantity || 10,
  });
};
</script>
