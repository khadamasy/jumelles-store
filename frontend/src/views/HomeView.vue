<template>
  <div class="bg-[#faf7f2] text-[#241d19]">
    <div class="max-w-[1080px] mx-auto px-4 md:px-7">
      <!-- 1. HERO MOBILE-FIRST (jumelles-accueil-mobile-first.html) -->
      <div class="pt-7 pb-2 md:py-14 grid grid-cols-1 md:grid-cols-[1.15fr_1fr] items-center gap-5 md:gap-10">
        <div>
          <span class="inline-flex items-center gap-2 font-sans font-bold text-[11px] tracking-[0.18em] uppercase text-[#b8893a]">
            <i class="w-2 h-2 rounded-full bg-[#b8893a] animate-ping"></i>
            Collection 2026 · Dakar
          </span>

          <h1 class="font-serif font-bold text-[clamp(34px,9vw,54px)] leading-[1.08] tracking-tight text-[#241d19] mt-2.5 mb-3">
            L’élégance du sac, la grâce du soulier.
          </h1>

          <p class="text-[#6f625a] text-base leading-relaxed max-w-[34em]">
            Maroquinerie en cuir sélectionné et chaussures pour toutes vos occasions. Commandez en 2 minutes, confirmez sur WhatsApp, recevez chez vous.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-[auto_auto] justify-start gap-2.5 mt-5">
            <router-link
              to="/catalog?type=SAC"
              class="min-h-[52px] px-6 rounded-2xl font-bold text-base flex items-center justify-center bg-gradient-to-br from-[#d9ad5c] to-[#b8893a] text-[#17110e] shadow-[0_8px_24px_rgba(36,29,25,.12)] active:scale-97 transition-transform"
            >
              Découvrir les sacs
            </router-link>
            <router-link
              to="/catalog?type=CHAUSSURE"
              class="min-h-[52px] px-6 rounded-2xl font-bold text-base flex items-center justify-center border-[1.5px] border-[#e9e0d6] text-[#241d19] hover:bg-[#e9e0d6]/40 active:scale-97 transition-all"
            >
              Voir les chaussures
            </router-link>
          </div>
        </div>

        <!-- Visuel 2 Tuiles Décalées -->
        <div class="grid grid-cols-2 gap-3">
          <router-link
            to="/product/sac-prestige-cuir-epsom-cadenas"
            class="group relative rounded-[22px] overflow-hidden aspect-[3/4] text-white flex items-end p-3.5 shadow-[0_8px_24px_rgba(36,29,25,.14)] bg-gradient-to-br from-[#c58a4a] to-[#6b3f1f]"
          >
            <img
              src="/products/sac-birkin-camel.jpg"
              alt="Sac prestige cuir et cadenas"
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-106 transition-transform duration-700"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
            <span class="relative z-10 font-serif font-semibold text-[15px] leading-snug">
              <small class="block font-sans font-semibold text-[11px] text-[#d9ad5c] tracking-[0.1em] uppercase mb-0.5">
                Best-seller
              </small>
              Sac prestige cuir et cadenas
            </span>
          </router-link>

          <router-link
            to="/product/mules-stiletto-brides-coeur-diamant-strass"
            class="group relative rounded-[22px] overflow-hidden aspect-[3/4] text-white flex items-end p-3.5 shadow-[0_8px_24px_rgba(36,29,25,.14)] bg-gradient-to-br from-[#3a2b33] to-[#0f0a0d] mt-7"
          >
            <img
              src="/products/mules-talon-coeur-noir.jpg"
              alt="Mules stiletto brides cœur"
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-106 transition-transform duration-700"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
            <span class="relative z-10 font-serif font-semibold text-[15px] leading-snug">
              <small class="block font-sans font-semibold text-[11px] text-[#d9ad5c] tracking-[0.1em] uppercase mb-0.5">
                Pointures 37–42
              </small>
              Mules stiletto brides cœur
            </span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 2. BANDEAU DÉFILANT (.marq) -->
    <div class="overflow-hidden bg-[#17110e] text-[#d9ad5c] my-6" aria-label="Nos engagements">
      <div class="animate-marquee flex items-center gap-9 py-3 font-sans font-bold text-xs tracking-[0.16em] uppercase whitespace-nowrap">
        <span>Livraison 24h à Dakar</span><span>·</span>
        <span>Échange de pointure 48h</span><span>·</span>
        <span>Confirmation sur WhatsApp</span><span>·</span>
        <span>Règlement à la livraison</span><span>·</span>
        <span aria-hidden="true">Livraison 24h à Dakar</span><span aria-hidden="true">·</span>
        <span aria-hidden="true">Échange de pointure 48h</span><span aria-hidden="true">·</span>
        <span aria-hidden="true">Confirmation sur WhatsApp</span><span aria-hidden="true">·</span>
        <span aria-hidden="true">Règlement à la livraison</span><span aria-hidden="true">·</span>
      </div>
    </div>

    <div class="max-w-[1080px] mx-auto px-4 md:px-7">
      <!-- 3. DEUX UNIVERS (.cats) -->
      <section class="py-6">
        <h2 class="font-serif font-bold text-[26px] text-[#241d19] mb-1">Deux univers</h2>
        <p class="text-[#6f625a] text-base mb-4">Choisissez par où commencer.</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <router-link
            to="/catalog?type=SAC"
            class="group relative rounded-[22px] overflow-hidden min-h-[160px] md:min-h-[240px] p-5 text-white flex flex-col justify-end shadow-[0_8px_24px_rgba(36,29,25,.12)] bg-gradient-to-br from-[#b07a3f] to-[#4a2a14]"
          >
            <img
              src="/products/sac-birkin-camel.jpg"
              alt="Sacs"
              loading="lazy"
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent"></div>
            <b class="relative z-10 font-serif font-bold text-[22px]">Sacs</b>
            <span class="relative z-10 text-sm opacity-90">À main, cabas, pochettes</span>
          </router-link>

          <router-link
            to="/catalog?type=CHAUSSURE"
            class="group relative rounded-[22px] overflow-hidden min-h-[160px] md:min-h-[240px] p-5 text-white flex flex-col justify-end shadow-[0_8px_24px_rgba(36,29,25,.12)] bg-gradient-to-br from-[#2d2330] to-[#0d0a0f]"
          >
            <img
              src="/products/mules-h-jacquard-bordeaux-coffret.jpg"
              alt="Chaussures"
              loading="lazy"
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent"></div>
            <b class="relative z-10 font-serif font-bold text-[22px]">Chaussures</b>
            <span class="relative z-10 text-sm opacity-90">Mules, escarpins, sandales</span>
          </router-link>
        </div>
      </section>

      <!-- 4. PIÈCES DU MOMENT (.rail + Grille Catalogue) -->
      <section class="py-6">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
          <div>
            <h2 class="font-serif font-bold text-[26px] text-[#241d19] mb-1">Pièces du moment</h2>
            <p class="text-[#6f625a] text-base">Faites glisser pour voir la suite ou filtrez par univers.</p>
          </div>

          <div class="inline-flex bg-[#e9e0d6]/60 p-1 rounded-2xl border border-[#e9e0d6] self-start">
            <button
              @click="activeCategory = 'ALL'"
              class="px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              :class="activeCategory === 'ALL' ? 'bg-[#17110e] text-[#d9ad5c]' : 'text-[#6f625a] hover:text-[#241d19]'"
            >
              Tout ({{ products.length }})
            </button>
            <button
              @click="activeCategory = 'SAC'"
              class="px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              :class="activeCategory === 'SAC' ? 'bg-[#17110e] text-[#d9ad5c]' : 'text-[#6f625a] hover:text-[#241d19]'"
            >
              Sacs
            </button>
            <button
              @click="activeCategory = 'CHAUSSURE'"
              class="px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              :class="activeCategory === 'CHAUSSURE' ? 'bg-[#17110e] text-[#d9ad5c]' : 'text-[#6f625a] hover:text-[#241d19]'"
            >
              Chaussures
            </button>
          </div>
        </div>

        <!-- Rail Horizontal Mobile-First (scroll-snap) -->
        <div
          v-if="highlightProducts.length > 0"
          class="flex gap-3 overflow-x-auto snap-x snap-mandatory py-1 px-4 -mx-4 md:px-0 md:mx-0 pb-4 mb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          tabindex="0"
          aria-label="Produits du moment"
        >
          <article
            v-for="item in highlightProducts"
            :key="'rail-' + item.id"
            class="flex-[0_0_72%] sm:flex-[0_0_260px] max-w-[280px] snap-start bg-white border border-[#e9e0d6] rounded-[20px] overflow-hidden shadow-[0_8px_24px_rgba(36,29,25,.08)] active:scale-98 transition-transform flex flex-col"
          >
            <router-link :to="`/product/${item.slug}`" class="block aspect-[4/5] bg-[#f3ece2] overflow-hidden">
              <img
                v-if="item.images?.[0]?.minioUrl"
                :src="item.images[0].minioUrl"
                :alt="item.name"
                loading="lazy"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </router-link>
            <div class="p-3.5 flex-1 flex flex-col justify-between">
              <div>
                <router-link :to="`/product/${item.slug}`">
                  <h3 class="font-serif font-semibold text-base text-[#241d19] leading-snug line-clamp-2 mb-1">
                    {{ item.name }}
                  </h3>
                </router-link>
                <span class="font-extrabold text-[#b8893a] text-sm block">
                  {{ currencyStore.formatPrice(item.basePrice) }}
                </span>
              </div>
              <button
                @click="quickAddToCart(item)"
                class="mt-2.5 w-full min-h-[44px] rounded-xl border-[1.5px] border-[#e9e0d6] bg-transparent hover:bg-[#b8893a] hover:text-[#17110e] hover:border-[#b8893a] active:bg-[#b8893a] active:text-[#17110e] text-[#241d19] font-bold text-sm transition-colors cursor-pointer"
              >
                Ajouter au panier
              </button>
            </div>
          </article>
        </div>

        <!-- Grille Complète de tous les articles -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="n in 6"
            :key="n"
            class="bg-white rounded-3xl h-96 animate-pulse border border-[#e9e0d6]"
          ></div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard
            v-for="product in visibleProducts"
            :key="product.id"
            :product="product"
          />
        </div>
      </section>

      <!-- 5. COMMANDER EN CONFIANCE (.trust) -->
      <section class="py-6">
        <h2 class="font-serif font-bold text-[26px] text-[#241d19] mb-1">Commander en confiance</h2>
        <p class="text-[#6f625a] text-base mb-4">Simple, local, sans surprise.</p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          <div class="flex gap-3.5 items-start bg-white border border-[#e9e0d6] rounded-[18px] p-4">
            <svg class="w-7 h-7 stroke-[#b8893a] fill-none stroke-[1.7] shrink-0" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
              <circle cx="7" cy="17.5" r="1.7" />
              <circle cx="17" cy="17.5" r="1.7" />
            </svg>
            <p class="m-0">
              <b class="block text-[#241d19] font-bold text-sm">Livraison 24h à Dakar</b>
              <span class="text-[#6f625a] text-sm">Votre commande est suivie par numéro et téléphone.</span>
            </p>
          </div>

          <div class="flex gap-3.5 items-start bg-white border border-[#e9e0d6] rounded-[18px] p-4">
            <svg class="w-7 h-7 stroke-[#b8893a] fill-none stroke-[1.7] shrink-0" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 12a8 8 0 0 1 14-5l2 2M20 12a8 8 0 0 1-14 5l-2-2M20 4v5h-5M4 20v-5h5" />
            </svg>
            <p class="m-0">
              <b class="block text-[#241d19] font-bold text-sm">Échange de pointure 48h</b>
              <span class="text-[#6f625a] text-sm">Une pointure qui ne va pas : on la change.</span>
            </p>
          </div>

          <div class="flex gap-3.5 items-start bg-white border border-[#e9e0d6] rounded-[18px] p-4">
            <svg class="w-7 h-7 stroke-[#b8893a] fill-none stroke-[1.7] shrink-0" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <p class="m-0">
              <b class="block text-[#241d19] font-bold text-sm">Règlement à la livraison</b>
              <span class="text-[#6f625a] text-sm">Payez au moment de la remise de votre colis.</span>
            </p>
          </div>
        </div>
      </section>
    </div>

    <!-- Toast de notification rapide -->
    <div
      role="status"
      aria-live="polite"
      class="fixed left-1/2 bottom-24 md:bottom-7 -translate-x-1/2 bg-[#241d19] text-[#faf7f2] px-4 py-2.5 rounded-xl text-sm font-medium shadow-xl pointer-events-none transition-all duration-250 z-50 max-w-[90vw]"
      :class="toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'"
    >
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ProductService } from '../services/api';
import { useCartStore } from '../stores/cart';
import { useCurrencyStore } from '../stores/currency';
import ProductCard from '../components/ProductCard.vue';

const products = ref<any[]>([]);
const loading = ref(true);
const activeCategory = ref<'ALL' | 'SAC' | 'CHAUSSURE'>('ALL');
const toastMessage = ref('');
let toastTimer: any = null;

const cartStore = useCartStore();
const currencyStore = useCurrencyStore();

const showToast = (msg: string) => {
  toastMessage.value = msg;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMessage.value = '';
  }, 2200);
};

const quickAddToCart = (product: any) => {
  const availableVariant =
    product.variants?.find((v: any) => v.stockQuantity > 0) || product.variants?.[0];
  if (!availableVariant) return;

  cartStore.addItem({
    variantId: availableVariant.id,
    productId: product.id,
    productName: product.name,
    imageUrl: product.images?.[0]?.minioUrl || '',
    color: availableVariant.color,
    sizeOrShoeSize: availableVariant.sizeOrShoeSize,
    price: product.basePrice + (availableVariant.priceAdjustment || 0),
    quantity: 1,
    maxStock: availableVariant.stockQuantity,
  });
  showToast(`Ajouté : ${product.name}`);
};

onMounted(async () => {
  try {
    const res = await ProductService.getAll();
    products.value = res.data.data;
  } catch (error) {
    console.error('Erreur chargement produits:', error);
  } finally {
    loading.value = false;
  }
});

const highlightProducts = computed(() => products.value.slice(0, 4));

const visibleProducts = computed(() => {
  if (activeCategory.value === 'ALL') return products.value;
  return products.value.filter((p) => {
    const isSac = p.category?.type === 'SAC' || p.categoryId?.includes('sac');
    const isShoe = p.category?.type === 'CHAUSSURE' || p.categoryId?.includes('shoe');
    if (activeCategory.value === 'SAC') return isSac;
    if (activeCategory.value === 'CHAUSSURE') return isShoe;
    return true;
  });
});
</script>
