<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Breadcrumb Navigation -->
    <nav class="text-xs text-stone-400 mb-8 flex items-center gap-2">
      <router-link to="/" class="hover:text-stone-700 transition-colors">Accueil</router-link>
      <span>/</span>
      <router-link to="/catalog" class="hover:text-stone-700 transition-colors">Catalogue</router-link>
      <span>/</span>
      <span class="text-stone-900 font-bold truncate max-w-xs">{{ product?.name || 'Article' }}</span>
    </nav>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
      <div class="aspect-square bg-stone-200 rounded-3xl"></div>
      <div class="space-y-4">
        <div class="h-8 bg-stone-200 rounded w-3/4"></div>
        <div class="h-6 bg-stone-200 rounded w-1/4"></div>
        <div class="h-24 bg-stone-200 rounded w-full"></div>
      </div>
    </div>

    <!-- Product Layout -->
    <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
      <!-- Media Gallery (MinIO Images) -->
      <div class="space-y-4 relative lg:sticky lg:top-28">
        <!-- Main Image -->
        <div class="aspect-[4/5] bg-stone-100 rounded-3xl overflow-hidden border border-stone-200 shadow-xl relative group">
          <img
            :src="activeImage"
            :alt="product.name"
            class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div class="absolute bottom-4 right-4 bg-stone-950/80 backdrop-blur-md text-gold-400 text-[10px] font-bold px-3 py-1.5 rounded-full border border-gold-400/30 shadow-md">
            ✨ Maison Jumelles • Dakar
          </div>
        </div>

        <!-- Thumbnails Gallery -->
        <div v-if="product.images && product.images.length > 1" class="flex gap-2.5 overflow-x-auto pb-2 pt-1 custom-scrollbar">
          <button
            v-for="img in product.images"
            :key="img.id"
            @click="activeImage = img.minioUrl"
            class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 shadow-sm"
            :class="activeImage === img.minioUrl ? 'border-gold-600 ring-2 ring-gold-400/50' : 'border-stone-200 opacity-60 hover:opacity-100'"
          >
            <img :src="img.minioUrl" :alt="img.altText" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <!-- Info & Variant Configuration -->
      <div class="space-y-7">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs uppercase tracking-widest text-gold-700 font-black bg-gold-50 px-3 py-0.5 rounded-full border border-gold-200">
              {{ product.category?.name || 'Maroquinerie & Souliers' }}
            </span>
            <span class="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              ✓ En Stock à Dakar
            </span>
          </div>

          <h1 class="font-serif text-3xl sm:text-4xl font-extrabold text-stone-950 leading-tight">
            {{ product.name }}
          </h1>

          <!-- Bloc Prix Épuré & Prestigieux -->
          <div class="mt-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/90 flex flex-wrap items-baseline justify-between gap-3 shadow-xs">
            <div class="flex items-baseline gap-3">
              <span class="font-serif text-3xl sm:text-4xl font-black text-stone-950">
                {{ currencyStore.isEur ? currencyStore.toEurOnly(currentPrice) : currencyStore.toXofOnly(currentPrice) }}
              </span>
              <span
                v-if="product.originalPrice && product.originalPrice > product.basePrice"
                class="text-base text-stone-400 line-through font-bold"
              >
                {{ currencyStore.isEur ? currencyStore.toEurOnly(product.originalPrice) : currencyStore.toXofOnly(product.originalPrice) }}
              </span>
              <span
                v-if="product.originalPrice && product.originalPrice > product.basePrice"
                class="text-xs bg-rosewood-600 text-white font-extrabold px-2.5 py-0.5 rounded-full shadow"
              >
                -{{ Math.round((1 - product.basePrice / product.originalPrice) * 100) }}%
              </span>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-xs font-extrabold text-gold-800 bg-gold-100/60 border border-gold-300 px-3 py-1 rounded-xl shadow-2xs">
                {{ currencyStore.isEur ? currencyStore.toXofOnly(currentPrice) : '≈ ' + currencyStore.toEurOnly(currentPrice) }}
              </span>
            </div>
          </div>
        </div>

        <p class="text-stone-600 text-sm leading-relaxed border-t border-stone-100 pt-4 font-light">
          {{ product.description }}
        </p>

        <!-- Variants Selection: Color -->
        <div class="space-y-3 pt-2">
          <label class="text-xs font-bold uppercase tracking-wider text-stone-600 block">
            Coloris sélectionné : <span class="text-stone-950 font-black">{{ selectedVariant?.color }}</span>
          </label>
          <div class="flex flex-wrap gap-2.5">
            <button
              v-for="v in uniqueColors"
              :key="v"
              @click="selectColor(v)"
              class="px-4 py-2.5 rounded-xl text-xs font-bold border transition-all"
              :class="selectedVariant?.color === v ? 'bg-stone-900 text-white border-stone-900 shadow-md' : 'bg-white border-stone-300 text-stone-700 hover:border-stone-400'"
            >
              {{ v }}
            </button>
          </div>
        </div>

        <!-- Variants Selection: Shoe Size or Bag Format -->
        <div class="space-y-3 pt-2">
          <div class="flex items-center justify-between">
            <label class="text-xs font-bold uppercase tracking-wider text-stone-600 block">
              {{ isShoe ? 'Pointure disponible (37-42) :' : 'Taille / Format :' }}
              <span class="text-stone-950 font-black ml-1">{{ selectedVariant?.sizeOrShoeSize }}</span>
            </label>
            <span v-if="isShoe" class="text-xs text-gold-700 font-bold hover:underline cursor-pointer">
              📏 Guide des correspondances
            </span>
          </div>

          <div class="flex flex-wrap gap-2.5">
            <button
              v-for="v in availableSizesForColor"
              :key="v.id"
              @click="selectedVariant = v"
              :disabled="v.stockQuantity <= 0"
              class="px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center min-w-[55px]"
              :class="[
                selectedVariant?.id === v.id
                  ? 'bg-gold-600 text-white border-gold-600 shadow-lg'
                  : v.stockQuantity > 0
                  ? 'bg-white border-stone-300 text-stone-900 hover:border-gold-500 hover:bg-gold-50/30'
                  : 'bg-stone-100 border-stone-200 text-stone-400 line-through cursor-not-allowed'
              ]"
            >
              {{ v.sizeOrShoeSize }}
            </button>
          </div>
        </div>

        <!-- Stock Indicator -->
        <div class="pt-2 flex items-center gap-2 text-xs font-semibold">
          <span
            class="w-2.5 h-2.5 rounded-full"
            :class="selectedVariant && selectedVariant.stockQuantity > 0 ? 'bg-emerald-500' : 'bg-rosewood-500'"
          ></span>
          <span v-if="selectedVariant && selectedVariant.stockQuantity > 0" class="text-emerald-800">
            En stock dans notre boutique de Dakar ({{ selectedVariant.stockQuantity }} disponible(s))
          </span>
          <span v-else class="text-rosewood-600 font-bold">
            Rupture temporaire de stock sur cette variante
          </span>
        </div>

        <!-- Quantity & Add to Cart & Buy Now -->
        <div class="pt-4 border-t border-stone-100 space-y-4">
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <!-- Stepper -->
            <div class="flex items-center border border-stone-300 rounded-2xl bg-white w-fit shadow-xs">
              <button
                @click="quantity > 1 ? quantity-- : null"
                class="px-4 py-3 text-stone-600 hover:text-stone-900 font-bold text-sm flex items-center justify-center cursor-pointer"
                aria-label="Diminuer la quantité"
              >
                <Minus class="w-3.5 h-3.5" />
              </button>
              <span class="px-3 text-sm font-black text-stone-900">{{ quantity }}</span>
              <button
                @click="quantity < (selectedVariant?.stockQuantity || 1) ? quantity++ : null"
                class="px-4 py-3 text-stone-600 hover:text-stone-900 font-bold text-sm flex items-center justify-center cursor-pointer"
                aria-label="Augmenter la quantité"
              >
                <Plus class="w-3.5 h-3.5" />
              </button>
            </div>

            <!-- Add to Bag -->
            <button
              @click="addToCart"
              :disabled="!selectedVariant || selectedVariant.stockQuantity <= 0"
              class="flex-1 py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-wider text-white transition-all shadow-md flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              :class="
                selectedVariant && selectedVariant.stockQuantity > 0
                  ? 'bg-stone-950 hover:bg-gold-600 hover:shadow-xl'
                  : 'bg-stone-400 cursor-not-allowed'
              "
            >
              <ShoppingBag class="w-4 h-4 text-gold-400" />
              <span>Ajouter au Panier</span>
            </button>

            <!-- Buy Now -->
            <button
              @click="buyNow"
              :disabled="!selectedVariant || selectedVariant.stockQuantity <= 0"
              class="py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-stone-950 transition-all shadow-lg active:scale-98 cursor-pointer"
            >
              Acheter Immédiatement
            </button>
          </div>

          <!-- Commander par Téléphone / WhatsApp avec lien photo -->
          <button
            type="button"
            @click="orderProductByPhone"
            :disabled="!selectedVariant || selectedVariant.stockQuantity <= 0"
            class="w-full py-3.5 px-5 rounded-2xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <IconWhatsApp className="w-4 h-4 text-[#25D366]" />
            <span>Commander cet article sur WhatsApp (avec photo)</span>
          </button>

          <p class="text-center text-[11px] text-stone-500 pt-1">
            Livraison express sous 24h à Dakar • Confirmation directe sur WhatsApp
          </p>
        </div>

        <!-- Reassurance & Contact Card -->
        <div class="bg-gradient-to-br from-stone-50 to-stone-100/70 border border-stone-200 rounded-3xl p-5 space-y-4 shadow-sm">
          <div class="flex items-center justify-between font-bold text-stone-900 pb-3 border-b border-stone-200">
            <div class="flex items-center gap-2">
              <ShoppingBag class="w-4 h-4 text-gold-600" />
              <span class="text-xs uppercase tracking-wider text-stone-700 font-bold">Garanties Maison Jumelles</span>
            </div>
            <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Stock Vérifié à Dakar
            </span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-stone-700">
            <div class="flex items-center gap-2">
              <Truck class="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Livraison express à Dakar sous 24h</span>
            </div>
            <div class="flex items-center gap-2">
              <IconWhatsApp className="w-4 h-4 text-[#25D366] shrink-0" />
              <span>Confirmation directe WhatsApp</span>
            </div>
            <div class="flex items-center gap-2">
              <Gift class="w-4 h-4 text-gold-600 shrink-0" />
              <span>Emballage soigné & Ruban cadeau</span>
            </div>
            <div class="flex items-center gap-2">
              <RefreshCw class="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Échange de pointure sous 48h</span>
            </div>
          </div>
          <div class="pt-1 text-center">
            <router-link to="/faq-livraison" class="text-[11px] text-stone-500 hover:text-gold-700 font-bold underline">
              Consulter la FAQ & les conditions complètes de livraison →
            </router-link>
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
import { useCurrencyStore } from '../stores/currency';
import { usePhoneStore } from '../stores/phone';
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  RefreshCw,
  Gift,
  Minus,
  Plus,
} from 'lucide-vue-next';
import IconWhatsApp from '../components/icons/IconWhatsApp.vue';
import IconPhoneSolid from '../components/icons/IconPhoneSolid.vue';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const currencyStore = useCurrencyStore();
const phoneStore = usePhoneStore();

const product = ref<any>(null);
const loading = ref(true);
const activeImage = ref('');
const selectedVariant = ref<any>(null);
const quantity = ref(1);

const isShoe = computed(() => {
  return product.value?.category?.type === 'CHAUSSURE' || product.value?.categoryId?.includes('shoe');
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

const whatsappOrderUrl = computed(() => {
  if (!product.value || !selectedVariant.value) {
    return 'https://wa.me/221772087820';
  }
  const photoUrl = phoneStore.toAbsolutePhotoUrl(activeImage.value);
  const text = encodeURIComponent(
    `Bonjour Jumelles Store, je souhaite commander par téléphone l'article suivant : ${product.value.name} (${selectedVariant.value.color} / ${selectedVariant.value.sizeOrShoeSize} x${quantity.value}) - Total: ${currencyStore.toXofOnly(currentPrice.value * quantity.value)}${photoUrl ? `\n📷 Photo : ${photoUrl}` : ''}`
  );
  return `https://wa.me/221772087820?text=${text}`;
});

const orderProductByPhone = () => {
  if (!product.value || !selectedVariant.value) return;
  const photoUrl = phoneStore.toAbsolutePhotoUrl(activeImage.value);
  const summary = `${product.value.name} (${selectedVariant.value.color} / ${selectedVariant.value.sizeOrShoeSize} x${quantity.value})${photoUrl ? `\n📷 Photo : ${photoUrl}` : ''} - Total: ${currencyStore.toXofOnly(currentPrice.value * quantity.value)}`;
  phoneStore.openModal(summary, activeImage.value);
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
