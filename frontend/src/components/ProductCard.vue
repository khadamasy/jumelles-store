<template>
  <div class="group relative bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
    <!-- Image & Badges -->
    <div class="relative aspect-[4/5] overflow-hidden bg-stone-100">
      <img
        :src="primaryImage"
        :alt="product.name"
        class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <!-- Badge Coup de Coeur -->
      <span
        v-if="product.isFeatured"
        class="absolute top-3 left-3 bg-stone-900/90 text-gold-400 backdrop-blur-sm text-[10px] tracking-wider uppercase font-semibold px-2.5 py-1 rounded-full border border-gold-500/30"
      >
        ★ Coup de Cœur
      </span>

      <!-- Badge Stock Restant -->
      <span
        v-if="totalStock <= 5 && totalStock > 0"
        class="absolute top-3 right-3 bg-rosewood-600/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm"
      >
        Plus que {{ totalStock }} en stock
      </span>
      <span
        v-else-if="totalStock === 0"
        class="absolute top-3 right-3 bg-stone-700/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full"
      >
        Rupture
      </span>
    </div>

    <!-- Details -->
    <div class="p-5 flex-1 flex flex-col justify-between">
      <div>
        <p class="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
          {{ categoryName }}
        </p>
        <router-link :to="`/product/${product.slug || product.id}`">
          <h3 class="font-medium text-stone-900 group-hover:text-gold-700 transition-colors line-clamp-2 text-base">
            {{ product.name }}
          </h3>
        </router-link>
      </div>

      <div class="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
        <div>
          <span class="text-xs text-stone-400 block">À partir de</span>
          <span class="font-serif font-bold text-lg text-stone-900">
            {{ formatPrice(product.basePrice) }}
          </span>
        </div>

        <router-link
          :to="`/product/${product.slug || product.id}`"
          class="inline-flex items-center justify-center px-4 py-2 bg-stone-900 hover:bg-gold-600 text-white text-xs font-semibold rounded-xl transition-all shadow-sm group-hover:shadow"
        >
          Découvrir
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  product: any;
}>();

const primaryImage = computed(() => {
  if (props.product.images && props.product.images.length > 0) {
    const primary = props.product.images.find((img: any) => img.isPrimary);
    return primary ? primary.minioUrl : props.product.images[0].minioUrl;
  }
  return 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80';
});

const categoryName = computed(() => {
  return props.product.category?.name || 'Maroquinerie & Chaussures';
});

const totalStock = computed(() => {
  if (!props.product.variants) return 0;
  return props.product.variants.reduce((sum: number, v: any) => sum + (v.stockQuantity || 0), 0);
});

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(price);
};
</script>
