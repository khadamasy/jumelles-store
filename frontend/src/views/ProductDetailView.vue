<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Breadcrumb -->
    <nav class="text-xs text-stone-400 mb-8">
      <router-link to="/" class="hover:text-stone-700">Accueil</router-link> /
      <router-link to="/catalog" class="hover:text-stone-700">Catalogue</router-link> /
      <span class="text-stone-700 font-medium">{{ product?.name || 'Article' }}</span>
    </nav>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
      <div class="aspect-square bg-stone-200 rounded-3xl"></div>
      <div class="space-y-4">
        <div class="h-8 bg-stone-200 rounded w-3/4"></div>
        <div class="h-6 bg-stone-200 rounded w-1/4"></div>
        <div class="h-24 bg-stone-200 rounded w-full"></div>
      </div>
    </div>

    <!-- Product Layout -->
    <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      <!-- Media Gallery (MinIO Images) -->
      <div class="space-y-4">
        <!-- Main Big Image -->
        <div class="aspect-[4/5] bg-stone-100 rounded-3xl overflow-hidden border border-stone-200 shadow-md">
          <img
            :src="activeImage"
            :alt="product.name"
            class="w-full h-full object-cover object-center"
          />
        </div>

        <!-- Thumbnails -->
        <div v-if="product.images && product.images.length > 1" class="flex gap-3 overflow-x-auto pb-2">
          <button
            v-for="img in product.images"
            :key="img.id"
            @click="activeImage = img.minioUrl"
            class="w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0"
            :class="activeImage === img.minioUrl ? 'border-gold-600 ring-2 ring-gold-400/50' : 'border-stone-200 opacity-70 hover:opacity-100'"
          >
            <img :src="img.minioUrl" :alt="img.altText" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <!-- Info & Variant Configuration -->
      <div class="space-y-6">
        <div>
          <span class="text-xs uppercase tracking-widest text-gold-600 font-bold block mb-1">
            {{ product.category?.name || 'Article Jumelles Store' }}
          </span>
          <h1 class="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
            {{ product.name }}
          </h1>
          <div class="mt-4 flex items-baseline gap-3">
            <span class="font-serif text-3xl font-bold text-stone-950">
              {{ formatPrice(currentPrice) }}
            </span>
            <span class="text-xs text-stone-400">TVA et emballage cadeau inclus</span>
          </div>
        </div>

        <p class="text-stone-600 text-sm leading-relaxed border-t border-stone-100 pt-4">
          {{ product.description }}
        </p>

        <!-- Variants Selection: Color -->
        <div class="space-y-3 pt-2">
          <label class="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
            Couleur : <span class="text-stone-900 font-bold">{{ selectedVariant?.color }}</span>
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="v in uniqueColors"
              :key="v"
              @click="selectColor(v)"
              class="px-4 py-2 rounded-xl text-xs font-semibold border transition-all"
              :class="selectedVariant?.color === v ? 'bg-stone-900 text-white border-stone-900 shadow-sm' : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'"
            >
              {{ v }}
            </button>
          </div>
        </div>

        <!-- Variants Selection: Shoe Size or Bag Format -->
        <div class="space-y-3 pt-2">
          <div class="flex items-center justify-between">
            <label class="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
              {{ isShoe ? 'Pointure disponible :' : 'Taille / Format :' }}
              <span class="text-stone-900 font-bold ml-1">{{ selectedVariant?.sizeOrShoeSize }}</span>
            </label>
            <span v-if="isShoe" class="text-xs text-gold-600 font-medium cursor-pointer hover:underline">
              Guide des pointures
            </span>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              v-for="v in availableSizesForColor"
              :key="v.id"
              @click="selectedVariant = v"
              :disabled="v.stockQuantity <= 0"
              class="px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center min-w-[50px]"
              :class="[
                selectedVariant?.id === v.id
                  ? 'bg-gold-600 text-white border-gold-600 shadow'
                  : v.stockQuantity > 0
                  ? 'bg-white border-stone-300 text-stone-800 hover:border-gold-500'
                  : 'bg-stone-100 border-stone-200 text-stone-400 line-through cursor-not-allowed'
              ]"
            >
              {{ v.sizeOrShoeSize }}
            </button>
          </div>
        </div>

        <!-- Stock Status -->
        <div class="pt-2 flex items-center gap-2 text-xs font-medium">
          <span
            class="w-2.5 h-2.5 rounded-full"
            :class="selectedVariant && selectedVariant.stockQuantity > 0 ? 'bg-emerald-500' : 'bg-rosewood-500'"
          ></span>
          <span v-if="selectedVariant && selectedVariant.stockQuantity > 0" class="text-emerald-700">
            En stock ({{ selectedVariant.stockQuantity }} pièce(s) disponible(s))
          </span>
          <span v-else class="text-rosewood-600 font-semibold">
            Actuellement en rupture pour cette sélection
          </span>
        </div>

        <!-- Quantity & Add to Cart -->
        <div class="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <!-- Quantity Stepper -->
          <div class="flex items-center border border-stone-300 rounded-xl bg-white w-fit">
            <button
              @click="quantity > 1 ? quantity-- : null"
              class="px-3 py-2 text-stone-600 hover:text-stone-900 font-bold"
            >
              -
            </button>
            <span class="px-4 text-sm font-bold text-stone-900">{{ quantity }}</span>
            <button
              @click="quantity < (selectedVariant?.stockQuantity || 1) ? quantity++ : null"
              class="px-3 py-2 text-stone-600 hover:text-stone-900 font-bold"
            >
              +
            </button>
          </div>

          <!-- Add to cart -->
          <button
            @click="addToCart"
            :disabled="!selectedVariant || selectedVariant.stockQuantity <= 0"
            class="flex-1 py-3.5 px-6 rounded-xl text-sm font-semibold text-white transition-all shadow-md flex items-center justify-center gap-2"
            :class="
              selectedVariant && selectedVariant.stockQuantity > 0
                ? 'bg-stone-900 hover:bg-gold-600 hover:shadow-lg'
                : 'bg-stone-400 cursor-not-allowed'
            "
          >
            <span>🛍️</span>
            <span>Ajouter au Panier</span>
          </button>

          <!-- Buy Now direct checkout -->
          <button
            @click="buyNow"
            :disabled="!selectedVariant || selectedVariant.stockQuantity <= 0"
            class="py-3.5 px-6 rounded-xl text-sm font-semibold bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-stone-950 transition-all shadow-md"
          >
            Acheter Immédiatement
          </button>
        </div>

        <!-- Payment assurance badge -->
        <div class="bg-stone-50 border border-stone-200 rounded-2xl p-4 mt-6 flex items-center justify-between text-xs text-stone-600">
          <div class="flex items-center gap-3">
            <span class="text-lg">🔒</span>
            <div>
              <p class="font-bold text-stone-900">Paiement 100% Sécurisé</p>
              <p class="text-[11px] text-stone-500">Validation instantanée via Wave & Orange Money</p>
            </div>
          </div>
          <div class="flex items-center gap-2 font-bold text-stone-800">
            <span>Wave</span> • <span>Orange Money</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ProductService } from '../services/api';
import { useCartStore } from '../stores/cart';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const product = ref<any>(null);
const loading = ref(true);
const activeImage = ref('');
const selectedVariant = ref<any>(null);
const quantity = ref(1);

const isShoe = computed(() => {
  return product.value?.category?.type === 'CHAUSSURE' || product.value?.categoryId.includes('shoe');
});

const currentPrice = computed(() => {
  if (!product.value) return 0;
  const base = product.value.basePrice || 0;
  const adj = selectedVariant.value?.priceAdjustment || 0;
  return base + adj;
});

const uniqueColors = computed(() => {
  if (!product.value?.variants) return [];
  const set = new Set<string>();
  product.value.variants.forEach((v: any) => set.add(v.color));
  return Array.from(set);
});

const availableSizesForColor = computed(() => {
  if (!product.value?.variants || !selectedVariant.value) return [];
  return product.value.variants.filter((v: any) => v.color === selectedVariant.value.color);
});

const selectColor = (color: string) => {
  const match = product.value.variants.find((v: any) => v.color === color);
  if (match) selectedVariant.value = match;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(price);
};

const addToCart = () => {
  if (!selectedVariant.value || !product.value) return;
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

const buyNow = () => {
  addToCart();
  router.push('/checkout');
};

onMounted(async () => {
  loading.value = true;
  try {
    const slug = route.params.slug as string;
    const res = await ProductService.getByIdOrSlug(slug);
    product.value = res.data.data;

    if (product.value.images && product.value.images.length > 0) {
      activeImage.value = product.value.images[0].minioUrl;
    }

    if (product.value.variants && product.value.variants.length > 0) {
      selectedVariant.value = product.value.variants[0];
    }
  } catch (err) {
    console.error('Erreur chargement détail produit:', err);
  } finally {
    loading.value = false;
  }
});
</script>
