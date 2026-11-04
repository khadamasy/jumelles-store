<template>
  <div>
    <div class="wrap">
      <div class="hero">
        <div>
          <span class="eyebrow"><i></i>Collection 2026 · Dakar</span>
          <h1>L’élégance du sac, la grâce du soulier.</h1>
          <p class="lead">
            Maroquinerie en cuir sélectionné et chaussures pour toutes vos occasions. Commandez en 2 minutes, confirmez sur WhatsApp, recevez chez vous.
          </p>
          <div class="cta">
            <router-link to="/catalog?type=SAC" class="btn gold">Découvrir les sacs</router-link>
            <router-link to="/catalog?type=CHAUSSURE" class="btn line">Voir les chaussures</router-link>
          </div>
        </div>

        <div class="visual">
          <router-link
            to="/product/sac-prestige-cuir-epsom-cadenas"
            class="tile"
            style="--g: linear-gradient(145deg, #c58a4a, #6b3f1f)"
          >
            <img
              src="/products/sac-birkin-camel.jpg"
              alt="Sac prestige cuir et cadenas"
              class="absolute inset-0 w-full h-full object-cover"
            />
            <span><small>Best-seller</small>Sac prestige cuir et cadenas</span>
          </router-link>

          <router-link
            to="/product/mules-stiletto-brides-coeur-diamant-strass"
            class="tile"
            style="--g: linear-gradient(145deg, #3a2b33, #0f0a0d)"
          >
            <img
              src="/products/mules-talon-coeur-noir.jpg"
              alt="Mules stiletto brides cœur"
              class="absolute inset-0 w-full h-full object-cover"
            />
            <span><small>Pointures 37–42</small>Mules stiletto brides cœur</span>
          </router-link>
        </div>
      </div>
    </div>

    <div class="marq" aria-label="Nos engagements">
      <div>
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

    <div class="wrap">
      <section class="jm-section">
        <h2>Deux univers</h2>
        <p class="sub">Choisissez par où commencer.</p>
        <div class="cats">
          <router-link
            to="/catalog?type=SAC"
            class="cat"
            style="--g: linear-gradient(135deg, #b07a3f, #4a2a14)"
          >
            <img
              src="/products/sac-birkin-camel.jpg"
              alt="Sacs"
              loading="lazy"
              class="absolute inset-0 w-full h-full object-cover opacity-55"
            />
            <b>Sacs</b>
            <span>À main, cabas, pochettes</span>
          </router-link>

          <router-link
            to="/catalog?type=CHAUSSURE"
            class="cat"
            style="--g: linear-gradient(135deg, #2d2330, #0d0a0f)"
          >
            <img
              src="/products/mules-h-jacquard-bordeaux-coffret.jpg"
              alt="Chaussures"
              loading="lazy"
              class="absolute inset-0 w-full h-full object-cover opacity-55"
            />
            <b>Chaussures</b>
            <span>Mules, escarpins, sandales</span>
          </router-link>
        </div>
      </section>

      <section class="jm-section">
        <h2>Pièces du moment</h2>
        <p class="sub">Faites glisser pour voir la suite.</p>
        <div class="rail" tabindex="0" aria-label="Produits du moment" id="rail">
          <article
            v-for="(item, idx) in railProducts"
            :key="item.id || idx"
            class="jm-card"
          >
            <router-link :to="`/product/${item.slug}`">
              <div
                class="img"
                :style="`--g: linear-gradient(150deg, ${item.gradient || '#c58a4a,#6b3f1f'})`"
              >
                <img
                  v-if="item.imageUrl"
                  :src="item.imageUrl"
                  :alt="item.name"
                  loading="lazy"
                  class="w-full h-full object-cover"
                />
              </div>
            </router-link>
            <div class="in">
              <div>
                <h3>{{ item.name }}</h3>
                <span class="price">{{ formatFcfa(item.price) }}</span>
              </div>
              <button type="button" @click="quickAddToCart(item)">
                Ajouter au panier
              </button>
            </div>
          </article>
        </div>
      </section>

      <section class="jm-section">
        <h2>Commander en confiance</h2>
        <p class="sub">Simple, local, sans surprise.</p>
        <div class="trust">
          <div class="t">
            <svg viewBox="0 0 24 24">
              <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
              <circle cx="7" cy="17.5" r="1.7" />
              <circle cx="17" cy="17.5" r="1.7" />
            </svg>
            <p style="margin: 0">
              <b>Livraison 24h à Dakar</b>
              <span>Votre commande est suivie par numéro et téléphone.</span>
            </p>
          </div>
          <div class="t">
            <svg viewBox="0 0 24 24">
              <path d="M4 12a8 8 0 0 1 14-5l2 2M20 12a8 8 0 0 1-14 5l-2-2M20 4v5h-5M4 20v-5h5" />
            </svg>
            <p style="margin: 0">
              <b>Échange de pointure 48h</b>
              <span>Une pointure qui ne va pas : on la change.</span>
            </p>
          </div>
          <div class="t">
            <svg viewBox="0 0 24 24">
              <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <p style="margin: 0">
              <b>Règlement à la livraison</b>
              <span>Payez au moment de la remise de votre colis.</span>
            </p>
          </div>
        </div>
      </section>
    </div>

    <div id="toast" :class="{ on: !!toastMessage }" role="status" aria-live="polite">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ProductService } from '../services/api';
import { useCartStore } from '../stores/cart';

const products = ref<any[]>([]);
const toastMessage = ref('');
let toastTimer: any = null;

const cartStore = useCartStore();

const fallbackRail = [
  {
    id: 'prod-sac-1',
    variantId: 'var-birk-1',
    name: 'Sac prestige cuir et cadenas',
    price: 15000,
    slug: 'sac-prestige-cuir-epsom-cadenas',
    gradient: '#c58a4a,#6b3f1f',
    imageUrl: '/products/sac-birkin-camel.jpg',
    color: 'Camel Caramel',
    sizeOrShoeSize: 'Standard',
    maxStock: 10,
  },
  {
    id: 'prod-sac-2',
    variantId: 'var-chan-1',
    name: 'Sac matelassé à rabat et chaîne',
    price: 15000,
    slug: 'sac-matelasse-rabat-iconique-chaine',
    gradient: '#7d3b4b,#2c1119',
    imageUrl: '/products/sac-matelasse-chaine-collection.jpg',
    color: 'Noir Classique',
    sizeOrShoeSize: 'Standard',
    maxStock: 10,
  },
  {
    id: 'prod-shoe-1',
    variantId: 'var-mules-coeur-blk-38',
    name: 'Mules stiletto brides cœur',
    price: 12000,
    slug: 'mules-stiletto-brides-coeur-diamant-strass',
    gradient: '#3a2b33,#0f0a0d',
    imageUrl: '/products/mules-talon-coeur-noir.jpg',
    color: 'Noir Strass',
    sizeOrShoeSize: '38',
    maxStock: 10,
  },
  {
    id: 'prod-shoe-3',
    variantId: 'var-sand-verni-blk-38',
    name: 'Sandales plates cuir verni croisées',
    price: 12000,
    slug: 'sandales-plates-cuir-verni-croise',
    gradient: '#8a6a3a,#33220f',
    imageUrl: '/products/sandales-plates-verni-zara-collection.jpg',
    color: 'Bordeaux Verni',
    sizeOrShoeSize: '38',
    maxStock: 10,
  },
];

const gradients = ['#c58a4a,#6b3f1f', '#7d3b4b,#2c1119', '#3a2b33,#0f0a0d', '#8a6a3a,#33220f'];

const railProducts = computed(() => {
  if (products.value.length === 0) return fallbackRail;
  return products.value.map((p, idx) => {
    const v = p.variants?.find((x: any) => x.stockQuantity > 0) || p.variants?.[0];
    return {
      id: p.id,
      variantId: v?.id || p.id,
      name: p.name,
      price: p.basePrice + (v?.priceAdjustment || 0),
      slug: p.slug,
      gradient: gradients[idx % gradients.length],
      imageUrl: p.images?.[0]?.minioUrl || '',
      color: v?.color || 'Unique',
      sizeOrShoeSize: v?.sizeOrShoeSize || 'Standard',
      maxStock: v?.stockQuantity || 10,
    };
  });
});

const formatFcfa = (n: number) => `${new Intl.NumberFormat('fr-FR').format(n)} FCFA`;

const showToast = (msg: string) => {
  toastMessage.value = msg;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMessage.value = '';
  }, 2200);
};

const quickAddToCart = (item: any) => {
  cartStore.addItem({
    variantId: item.variantId,
    productId: item.id,
    productName: item.name,
    imageUrl: item.imageUrl,
    color: item.color,
    sizeOrShoeSize: item.sizeOrShoeSize,
    price: item.price,
    quantity: 1,
    maxStock: item.maxStock,
  });
  showToast(`Ajouté : ${item.name}`);
};

onMounted(async () => {
  try {
    const res = await ProductService.getAll();
    if (Array.isArray(res.data?.data)) {
      products.value = res.data.data;
    }
  } catch {
    // fallbackRail utilisé si l'API est hors ligne
  }
});
</script>
