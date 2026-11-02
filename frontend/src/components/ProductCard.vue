<template>
  <div class="group relative bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-2xl hover:border-gold-400/80 transition-all duration-500 flex flex-col">
    <!-- Image & Badges -->
    <div class="relative aspect-[4/5] overflow-hidden bg-stone-100">
      <img
        :src="primaryImage"
        :alt="product.name"
        class="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
        loading="lazy"
      />

      <!-- Overlay gradient on hover -->
      <div class="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <!-- Badge Coup de Coeur -->
      <span
        v-if="product.isFeatured"
        class="absolute top-3.5 left-3.5 bg-stone-950/90 text-gold-400 backdrop-blur-md text-[10px] tracking-widest uppercase font-black px-3 py-1 rounded-full border border-gold-500/40 shadow-sm"
      >
        ★ Coup de Cœur
      </span>

      <!-- Badge Stock Restant -->
      <span
        v-if="totalStock <= 5 && totalStock > 0"
        class="absolute top-3.5 right-3.5 bg-amber-600/95 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-sm"
      >
        Plus que {{ totalStock }} en stock
      </span>
      <span
        v-else-if="totalStock === 0"
        class="absolute top-3.5 right-3.5 bg-rosewood-700/95 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md"
      >
        Rupture temporaire
      </span>

      <!-- Preview des pointures ou couleurs au survol -->
      <div class="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-wrap gap-1">
        <span
          v-for="v in previewVariants"
          :key="v.id"
          class="bg-white/95 text-stone-900 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm"
        >
          {{ isShoe ? v.sizeOrShoeSize : v.color }}
        </span>
      </div>
    </div>

    <!-- Details -->
    <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
      <div>
        <div class="flex items-center justify-between text-[11px] uppercase tracking-wider text-stone-400 font-bold mb-1">
          <span>{{ categoryName }}</span>
          <span v-if="isShoe" class="text-gold-700 font-extrabold">Pointures 36-45</span>
        </div>

        <router-link :to="`/product/${product.slug || product.id}`">
          <h3 class="font-serif font-bold text-stone-900 group-hover:text-gold-700 transition-colors line-clamp-2 text-base leading-snug">
            {{ product.name }}
          </h3>
        </router-link>
      </div>

      <div class="pt-3 border-t border-stone-100 flex items-center justify-between">
        <div>
          <span class="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">Prix boutique</span>
          <span class="font-serif font-black text-lg text-stone-950">
            {{ formatPrice(product.basePrice) }}
          </span>
        </div>

        <router-link
          :to="`/product/${product.slug || product.id}`"
          class="inline-flex items-center justify-center px-4 py-2 bg-stone-900 group-hover:bg-gold-600 text-white text-xs font-bold rounded-xl transition-all shadow group-hover:shadow-lg"
        >
          Commander
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
  return props.product.category?.name || 'Maroquinerie & Souliers';
});

const isShoe = computed(() => {
  return props.product.category?.type === 'CHAUSSURE' || props.product.categoryId?.includes('shoe');
});

const totalStock = computed(() => {
  if (!props.product.variants) return 0;
  return props.product.variants.reduce((sum: number, v: any) => sum + (v.stockQuantity || 0), 0);
});

const previewVariants = computed(() => {
  if (!props.product.variants) return [];
  return props.product.variants.slice(0, 5);
});

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(price);
};
</script>
