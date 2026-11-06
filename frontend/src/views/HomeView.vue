<template>
  <div class="home">
    <!-- ================= HÉROS ================= -->
    <section class="hero wrap" aria-labelledby="hero-title">
      <div class="hero-txt">
        <span class="eyebrow"><i></i>Collection 2026 · Dakar</span>
        <h1 id="hero-title">L’élégance du sac, <em>la grâce</em> du soulier.</h1>
        <p class="lead">
          Maroquinerie sélectionnée et chaussures pour toutes vos occasions. Commandez en 2 minutes, confirmez sur
          WhatsApp, recevez chez vous.
        </p>
        <div class="cta">
          <router-link to="/catalog?type=SAC" class="btn gold lg">
            Découvrir les sacs
            <ArrowRight aria-hidden="true" />
          </router-link>
          <router-link to="/catalog?type=CHAUSSURE" class="btn line lg">Voir les chaussures</router-link>
        </div>
      </div>

      <div class="hero-vis">
        <router-link to="/product/sac-main-cuir-graine-cadenas" class="tile t1">
          <img src="/products/sac-cadenas-camel.jpg" alt="Sac prestige cuir et cadenas" fetchpriority="high" />
          <span class="tile-cap">
            <small>Coup de cœur</small>
            Sac à main à cadenas
          </span>
        </router-link>
        <router-link to="/product/mules-stiletto-brides-coeur-diamant-strass" class="tile t2">
          <img src="/products/mules-talon-coeur-noir.jpg" alt="Mules stiletto brides cœur" />
          <span class="tile-cap">
            <small>Pointures 37–42</small>
            Mules stiletto brides cœur
          </span>
        </router-link>
      </div>
    </section>

    <!-- ================= ENGAGEMENTS ================= -->
    <section class="wrap" aria-label="Nos engagements">
      <ul class="perks">
        <li v-for="(p, i) in perks" :key="p.title" class="perk" :style="{ animationDelay: `${i * 70}ms` }">
          <span class="perk-ic"><component :is="p.icon" aria-hidden="true" /></span>
          <span class="perk-t">
            <b>{{ p.title }}</b>
            <span>{{ p.text }}</span>
          </span>
        </li>
      </ul>
    </section>

    <div class="wrap">
      <!-- ================= UNIVERS ================= -->
      <section class="sec rv" aria-labelledby="univ-title">
        <div class="sec-hd">
          <div>
            <h2 id="univ-title">Deux univers</h2>
            <p class="sub">Choisissez par où commencer.</p>
          </div>
        </div>
        <div class="cats">
          <router-link to="/catalog?type=SAC" class="cat">
            <img src="/products/sac-cadenas-camel.jpg" alt="" loading="lazy" />
            <span class="cat-txt">
              <b>Sacs</b>
              <span>À main, cabas, pochettes</span>
            </span>
            <span class="cat-go" aria-hidden="true"><ArrowUpRight /></span>
          </router-link>
          <router-link to="/catalog?type=CHAUSSURE" class="cat">
            <img src="/products/mules-jacquard-bordeaux-coffret.jpg" alt="" loading="lazy" />
            <span class="cat-txt">
              <b>Chaussures</b>
              <span>Mules, escarpins, sandales</span>
            </span>
            <span class="cat-go" aria-hidden="true"><ArrowUpRight /></span>
          </router-link>
        </div>
      </section>

      <!-- ================= PIÈCES DU MOMENT ================= -->
      <section class="sec rv" aria-labelledby="rail-title">
        <div class="sec-hd">
          <div>
            <h2 id="rail-title">Pièces du moment</h2>
            <p class="sub">Faites glisser pour voir la suite.</p>
          </div>
          <div class="rail-nav">
            <button type="button" class="ib" aria-label="Articles précédents" @click="scrollRail(-1)">
              <ChevronLeft aria-hidden="true" />
            </button>
            <button type="button" class="ib" aria-label="Articles suivants" @click="scrollRail(1)">
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        </div>

        <div ref="railRef" class="rail" tabindex="0" aria-label="Produits du moment">
          <article v-for="(item, idx) in railProducts" :key="item.id || idx" class="rc">
            <router-link :to="`/product/${item.slug}`" class="rc-img" :aria-label="item.name">
              <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name" loading="lazy" decoding="async" />
            </router-link>
            <div class="rc-in">
              <router-link :to="`/product/${item.slug}`" class="rc-name" :title="item.name">{{ shortName(item.name) }}</router-link>
              <span class="rc-price tnum">{{ formatFcfa(item.price) }}</span>
              <button type="button" class="btn line sm block rc-add" @click="quickAddToCart(item)">
                <component :is="item.needsChoice ? ArrowRight : Plus" aria-hidden="true" />
                {{ item.needsChoice ? 'Choisir taille / coloris' : 'Ajouter au panier' }}
              </button>
            </div>
          </article>
          <router-link to="/catalog" class="rc rc-all">
            <span class="rc-all-ic"><ArrowRight aria-hidden="true" /></span>
            Toute la collection
          </router-link>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Plus,
  Truck,
  Repeat,
  Banknote,
  ShieldCheck,
  MessageCircle,
} from 'lucide-vue-next';
import { shortName } from '../utils/text';
import { ProductService } from '../services/api';
import { useCartStore } from '../stores/cart';
import { useToastStore } from '../stores/toast';
import { useReveal } from '../composables/useReveal';

const router = useRouter();
const cartStore = useCartStore();
const toastStore = useToastStore();
const { rescan } = useReveal();

const products = ref<any[]>([]);
const railRef = ref<HTMLElement | null>(null);

const perks = [
  { icon: Truck, title: 'Livraison 24 h à Dakar', text: 'Suivie par numéro et téléphone' },
  { icon: Repeat, title: 'Échange de pointure 48 h', text: 'Une pointure qui ne va pas : on la change' },
  { icon: MessageCircle, title: 'Confirmation sur WhatsApp', text: 'Commande vérifiée avec vous, sans surprise' },
  { icon: ShieldCheck, title: 'Règlement à la livraison', text: 'Payez à la remise de votre colis' },
];

const fallbackRail = [
  {
    id: 'prod-sac-1',
    variantId: 'var-birk-1',
    name: 'Sac prestige cuir et cadenas',
    price: 15000,
    slug: 'sac-main-cuir-graine-cadenas',
    imageUrl: '/products/sac-cadenas-camel.jpg',
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
    imageUrl: '/products/sandales-plates-verni-collection.jpg',
    color: 'Bordeaux Verni',
    sizeOrShoeSize: '38',
    maxStock: 10,
  },
];

const railProducts = computed(() => {
  // API injoignable : vitrine statique, chaque carte renvoie vers la fiche article
  // (stock et identifiants de variante inconnus, l'ajout direct au panier serait refusé)
  if (products.value.length === 0) return fallbackRail.map((f) => ({ ...f, needsChoice: true }));
  return products.value.map((p) => {
    const inStock = (p.variants || []).filter((x: any) => x.stockQuantity > 0);
    const v = inStock[0] || p.variants?.[0];
    return {
      // Plusieurs pointures / coloris (ou rupture) : choix sur la fiche article
      needsChoice: inStock.length !== 1,
      id: p.id,
      variantId: v?.id || p.id,
      name: p.name,
      price: p.basePrice + (v?.priceAdjustment || 0),
      slug: p.slug,
      imageUrl: p.images?.[0]?.minioUrl || '',
      color: v?.color || 'Unique',
      sizeOrShoeSize: v?.sizeOrShoeSize || 'Standard',
      maxStock: v?.stockQuantity || 0,
    };
  });
});

const formatFcfa = (n: number) => `${new Intl.NumberFormat('fr-FR').format(n)} FCFA`;

const scrollRail = (dir: number) => {
  const el = railRef.value;
  if (!el) return;
  el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
};

const quickAddToCart = (item: any) => {
  if (item.needsChoice || item.maxStock <= 0) {
    router.push(`/product/${item.slug}`);
    return;
  }
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
  toastStore.show(`Ajouté : ${item.name}`, 'success');
};

onMounted(async () => {
  try {
    const res = await ProductService.getAll();
    if (Array.isArray(res.data?.data)) {
      products.value = res.data.data;
      rescan();
    }
  } catch {
    // fallbackRail utilisé si l'API est hors ligne
  }
});
</script>

<style scoped>
/* ================= HÉROS ================= */
.hero {
  display: grid;
  gap: var(--s-8);
  padding-top: var(--s-8);
  padding-bottom: var(--s-6);
}
.hero-txt {
  animation: rise-in var(--dur-4) var(--ease-out) both;
}
.hero h1 {
  font-size: var(--fs-4xl);
  line-height: 1.04;
  font-weight: 400;
  letter-spacing: -0.025em;
  margin: var(--s-3) 0 var(--s-4);
  max-width: 12ch;
  font-variation-settings: 'opsz' 144;
}
.hero h1 em {
  font-style: italic;
  color: var(--accent-text);
}
.lead {
  margin: 0;
  max-width: 34em;
  color: var(--text-muted);
  font-size: var(--fs-base);
}
.cta {
  display: grid;
  gap: var(--s-3);
  margin-top: var(--s-6);
}
.hero-proof {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-2) var(--s-5);
  list-style: none;
  margin: var(--s-6) 0 0;
  padding: 0;
  font-size: var(--fs-sm);
  font-weight: 500;
  color: var(--text-muted);
}
.hero-proof li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.hero-proof svg {
  width: 16px;
  height: 16px;
  color: var(--accent-text);
}

.hero-vis {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--s-3);
}
.tile {
  position: relative;
  display: flex;
  align-items: flex-end;
  aspect-ratio: 3 / 4;
  padding: var(--s-4);
  border-radius: var(--r-lg);
  overflow: hidden;
  isolation: isolate;
  color: #fff;
  background: var(--bg-sunken);
  box-shadow: var(--sh-2);
  animation: rise-in 0.7s var(--ease-out) both;
}
.t1 {
  animation-delay: 80ms;
}
.t2 {
  margin-top: var(--s-8);
  animation-delay: 180ms;
}
.tile img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
  transition: transform 0.9s var(--ease-out);
}
.tile::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(to top, rgb(var(--c-sand-950) / 0.72), transparent 55%);
}
.tile:hover img {
  transform: scale(1.05);
}
.tile-cap {
  font-family: var(--font-display);
  font-size: 15px;
  line-height: 1.25;
}
.tile-cap small {
  display: block;
  margin-bottom: 4px;
  font: 700 10px/1 var(--font-sans);
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--accent-on-ink);
}

/* ================= ENGAGEMENTS ================= */
.perks {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  list-style: none;
  margin: var(--s-6) 0 var(--s-2);
  padding: 0;
  border-radius: var(--r-lg);
  overflow: hidden;
  background: var(--border);
  border: 1px solid var(--border);
}
.perk {
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
  padding: var(--s-4);
  background: var(--surface);
  animation: rise-in var(--dur-4) var(--ease-out) both;
  transition: background-color var(--dur-3);
}
.perk:hover {
  background: var(--surface-2);
}
.perk-ic {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  flex: none;
  border-radius: 50%;
  background: var(--accent-soft);
  color: var(--accent-text);
  box-shadow: inset 0 0 0 1px rgb(var(--c-gold-200));
  transition: transform var(--dur-3) var(--ease-spring);
}
.perk:hover .perk-ic {
  transform: scale(1.08) rotate(-4deg);
}
.perk-ic svg {
  width: 20px;
  height: 20px;
  stroke-width: 1.6;
}
.perk-t {
  display: grid;
  gap: 2px;
}
.perk-t b {
  font-size: var(--fs-sm);
  font-weight: 700;
  line-height: var(--lh-snug);
}
.perk-t span {
  font-size: var(--fs-xs);
  line-height: 1.4;
  color: var(--text-muted);
}

/* ================= SECTIONS ================= */
.sec {
  padding: var(--s-10) 0 var(--s-2);
}
.sec-hd {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--s-4);
  margin-bottom: var(--s-5);
}
.sec h2 {
  margin: 0;
  font-size: var(--fs-2xl);
  line-height: var(--lh-tight);
}
.sub {
  margin: 6px 0 0;
  color: var(--text-muted);
  font-size: var(--fs-sm);
}

/* ----- Univers ----- */
.cats {
  display: grid;
  gap: var(--s-3);
}
.cat {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--s-3);
  min-height: 180px;
  padding: var(--s-5);
  border-radius: var(--r-lg);
  overflow: hidden;
  isolation: isolate;
  color: #fff;
  background: var(--ink);
  box-shadow: var(--sh-2);
}
.cat img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
  opacity: 0.78;
  transition: transform 0.9s var(--ease-out), opacity var(--dur-3);
}
.cat::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(to top, rgb(var(--c-sand-950) / 0.78), transparent 70%);
}
.cat:hover img {
  transform: scale(1.04);
  opacity: 0.9;
}
.cat-txt b {
  display: block;
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 450;
  line-height: 1.1;
}
.cat-txt span {
  font-size: var(--fs-sm);
  opacity: 0.85;
}
.cat-go {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex: none;
  border-radius: 50%;
  background: rgb(255 255 255 / 0.16);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: background-color var(--dur-2), transform var(--dur-3) var(--ease-out);
}
.cat-go svg {
  width: 20px;
  height: 20px;
}
.cat:hover .cat-go {
  background: var(--accent);
  color: var(--ink);
  transform: rotate(45deg);
}

/* ----- Rail ----- */
.rail-nav {
  display: none;
  gap: var(--s-1);
}
.rail-nav .ib {
  border: 1px solid var(--border);
  border-radius: 50%;
}
.rail {
  display: flex;
  gap: var(--s-3);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: var(--gutter);
  padding: 4px var(--gutter) var(--s-4);
  margin: 0 calc(-1 * var(--gutter));
  scrollbar-width: none;
}
.rail::-webkit-scrollbar {
  display: none;
}
.rc {
  flex: 0 0 68%;
  max-width: 270px;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
  box-shadow: var(--sh-1);
  transition: transform var(--dur-3) var(--ease-out), box-shadow var(--dur-3) var(--ease-out);
}
.rc:hover {
  transform: translateY(-3px);
  box-shadow: var(--sh-2);
}
.rc-img {
  display: block;
  aspect-ratio: 4 / 5;
  background: var(--bg-sunken);
  overflow: hidden;
}
.rc-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s var(--ease-out);
}
.rc:hover .rc-img img {
  transform: scale(1.04);
}
.rc-in {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: var(--s-3) var(--s-4) var(--s-4);
}
.rc-name {
  font-size: 15px;
  line-height: var(--lh-snug);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rc-price {
  font-weight: 700;
  font-size: var(--fs-sm);
}
.rc-add {
  margin-top: auto;
  white-space: normal;
}
.rc-add:hover {
  --btn-bg: var(--ink);
  --btn-fg: var(--on-ink);
  --btn-bd: var(--ink);
}
.rc-all {
  flex-basis: 44%;
  align-items: center;
  justify-content: center;
  gap: var(--s-3);
  padding: var(--s-5);
  text-align: center;
  font-family: var(--font-display);
  font-size: var(--fs-md);
  background: var(--surface-2);
  border-style: dashed;
  box-shadow: none;
}
.rc-all-ic {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--ink);
  color: var(--on-ink);
  transition: transform var(--dur-3) var(--ease-out);
}
.rc-all:hover .rc-all-ic {
  transform: translateX(4px);
}
.rc-all svg {
  width: 20px;
  height: 20px;
}


/* ================= TABLETTE ================= */
@media (min-width: 720px) {
  .hero {
    grid-template-columns: 1.1fr 1fr;
    align-items: center;
    gap: var(--s-12);
    padding-top: var(--s-16);
    padding-bottom: var(--s-10);
  }
  .cta {
    display: flex;
    flex-wrap: wrap;
  }
  .tile-cap {
    font-size: 17px;
  }
  .cats {
    grid-template-columns: 1fr 1fr;
    gap: var(--s-4);
  }
  .cat {
    min-height: 300px;
    padding: var(--s-6);
  }
  .cat-txt b {
    font-size: 34px;
  }
  .rail-nav {
    display: flex;
  }
  .rc {
    flex-basis: 250px;
  }
  .rc-all {
    flex-basis: 200px;
  }
  .perks {
    grid-template-columns: repeat(4, 1fr);
  }
  .perk {
    flex-direction: row;
    align-items: center;
    padding: var(--s-5);
  }
  .sec {
    padding-top: var(--s-16);
  }
}

@media (min-width: 1024px) {
  .cat {
    min-height: 380px;
  }
}

</style>
