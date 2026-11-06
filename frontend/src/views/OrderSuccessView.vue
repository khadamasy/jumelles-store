<template>
  <div class="os wrap">
    <!-- Coche animée -->
    <div class="os-check" aria-hidden="true">
      <svg viewBox="0 0 52 52">
        <circle cx="26" cy="26" r="24" />
        <path d="M15 27l7 7 15-15" />
      </svg>
    </div>

    <header class="os-head">
      <span class="eyebrow">Commande enregistrée</span>
      <h1>Merci pour votre commande&nbsp;!</h1>
      <p class="os-ref">
        Numéro de suivi
        <strong class="tnum">{{ displayOrderNumber }}</strong>
      </p>
    </header>

    <section class="card os-card">
      <!-- Étape suivante : WhatsApp -->
      <div class="os-next">
        <p class="os-next-t">
          <span>Dernière étape</span>Envoyez le message WhatsApp pour que nous confirmions votre commande.
        </p>
        <a :href="whatsappUrl" target="_blank" rel="noopener noreferrer" class="btn wa lg block">
          <IconWhatsApp className="w-5 h-5" />
          Ouvrir WhatsApp
        </a>
        <p class="hint os-hint">
          WhatsApp ne s’est pas ouvert tout seul ? Utilisez le bouton ci-dessus : le message est déjà prêt.
        </p>

        <div v-if="orderItems.length > 0 && orderItems[0]?.imageUrl" class="note info os-photo">
          <ImageIcon aria-hidden="true" />
          <p>
            Le lien de la photo est déjà dans le message. Sur ordinateur, vous pouvez aussi copier l’image puis faire
            <kbd>Ctrl</kbd> + <kbd>V</kbd> dans WhatsApp.
          </p>
          <button type="button" class="btn sm line" @click="handleCopyPhoto(orderItems[0].imageUrl)">
            <component :is="photoCopied ? Check : Copy" aria-hidden="true" />
            {{ photoCopied ? 'Photo copiée' : photoCopyFailed ? 'Copie indisponible' : 'Copier la photo' }}
          </button>
        </div>
      </div>

      <!-- Articles -->
      <div v-if="orderItems.length > 0" class="os-items">
        <div class="os-items-h">
          <h2>Articles commandés</h2>
          <span v-if="displayAmount > 0" class="tnum">{{ formatPrice(displayAmount) }}</span>
        </div>
        <ul>
          <li v-for="(item, idx) in orderItems" :key="idx">
            <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.productName" loading="lazy" decoding="async" />
            <div>
              <p>{{ item.productName }}</p>
              <span>
                {{ item.color }}<template v-if="item.sizeOrShoeSize"> · {{ item.sizeOrShoeSize }}</template> ·
                ×{{ item.quantity }}
              </span>
            </div>
            <b class="tnum">{{ formatPrice(item.price * item.quantity) }}</b>
          </li>
        </ul>
      </div>

      <!-- Coordonnées enregistrées -->
      <div v-if="customerDetails.name" class="os-cust">
        <p><strong>Livraison</strong></p>
        <p>{{ customerDetails.name }} · <span class="tnum">{{ customerDetails.phone }}</span></p>
        <p>{{ customerDetails.address }} ({{ customerDetails.city }})</p>
      </div>

      <div class="note os-pay">
        <Truck aria-hidden="true" />
        <p>
          <strong>Règlement à la réception du colis.</strong> Vous payez directement le livreur. Une question : WhatsApp
          au <span class="tnum">+221 77 208 78 20</span>.
        </p>
      </div>
    </section>

    <nav class="os-acts" aria-label="Et maintenant">
      <router-link :to="{ path: '/orders', query: { orderNumber: displayOrderNumber } }" class="btn line">
        <Package aria-hidden="true" />
        Suivre ma commande
      </router-link>
      <router-link to="/catalog" class="btn dark">
        Continuer mes achats
        <ArrowRight aria-hidden="true" />
      </router-link>
      <router-link to="/" class="btn ghost">Retour à l’accueil</router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Truck, Image as ImageIcon, Check, Package, ArrowRight, Copy } from 'lucide-vue-next';
import IconWhatsApp from '../components/icons/IconWhatsApp.vue';
import { useCurrencyStore } from '../stores/currency';
import { copyPhotoToClipboard, buildWhatsAppSendUrl } from '../stores/phone';

const route = useRoute();
const currencyStore = useCurrencyStore();

const displayOrderNumber = ref('');
const displayAmount = ref(0);
const whatsappUrl = ref('');
const orderItems = ref<any[]>([]);
const photoCopied = ref(false);
const photoCopyFailed = ref(false);
const customerDetails = ref({
  name: '',
  phone: '',
  city: '',
  address: '',
});

const handleCopyPhoto = async (imgUrl: string) => {
  const ok = await copyPhotoToClipboard(imgUrl);
  photoCopyFailed.value = !ok;
  if (ok) {
    photoCopied.value = true;
    setTimeout(() => {
      photoCopied.value = false;
    }, 3000);
  }
};

const formatPrice = (price: number) => {
  return currencyStore.formatPrice(price);
};

onMounted(() => {
  // Récupérer depuis sessionStorage si disponible puis effacer immédiatement
  const saved = sessionStorage.getItem('jumelles_last_order');
  sessionStorage.removeItem('jumelles_last_order');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      displayOrderNumber.value = data.orderNumber || (route.query.orderNumber as string) || 'CMD-JUMELLES';
      displayAmount.value = Number(data.totalAmount) || 0;
      whatsappUrl.value = data.whatsappUrl || '';
      orderItems.value = Array.isArray(data.items) ? data.items : [];
    } catch (e) {
      console.warn('Erreur parsing last order', e);
    }
  }

  if (!displayOrderNumber.value) {
    displayOrderNumber.value = (route.query.orderNumber as string) || 'CMD-JUMELLES';
  }
  if (!whatsappUrl.value) {
    const defaultMsg = `Bonjour Maison Jumelles, je souhaite confirmer ma commande ${displayOrderNumber.value}.`;
    whatsappUrl.value = buildWhatsAppSendUrl(defaultMsg);
  }
});
</script>
<style scoped>
.os {
  max-width: 760px;
  padding-top: var(--s-10);
  padding-bottom: var(--s-12);
  text-align: center;
}

/* ----- Coche animée ----- */
.os-check {
  width: 76px;
  height: 76px;
  margin: 0 auto var(--s-5);
  border-radius: 50%;
  background: var(--success-soft);
  box-shadow: 0 0 0 10px rgb(var(--c-success-50) / 0.5);
  animation: pop-in 0.5s var(--ease-spring) both;
}
.os-check svg {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: var(--success);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.os-check circle {
  stroke-width: 2;
  stroke-dasharray: 151;
  stroke-dashoffset: 151;
  opacity: 0.35;
  animation: draw 0.6s var(--ease-out) 0.15s forwards;
}
.os-check path {
  stroke-dasharray: 36;
  stroke-dashoffset: 36;
  animation: draw 0.4s var(--ease-out) 0.55s forwards;
}

.os-head h1 {
  margin: var(--s-2) 0 var(--s-3);
  font-size: var(--fs-3xl);
  line-height: var(--lh-tight);
  font-weight: 400;
}
.os-ref {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--s-2);
  margin: 0;
  font-size: var(--fs-sm);
  color: var(--text-muted);
}
.os-ref strong {
  padding: 4px 10px;
  border-radius: var(--r-sm);
  background: var(--surface);
  border: 1px solid var(--border);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text);
  user-select: all;
}

/* ----- Carte ----- */
.os-card {
  display: grid;
  gap: var(--s-5);
  margin-top: var(--s-8);
  padding: var(--s-5);
  text-align: left;
  animation: rise-in var(--dur-4) var(--ease-out) 0.2s both;
}
.os-next {
  display: grid;
  gap: var(--s-3);
}
.os-next-t {
  margin: 0;
  font-weight: 600;
}
.os-next-t span {
  display: block;
  margin-bottom: 2px;
  font: 700 var(--fs-2xs) / 1.4 var(--font-sans);
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--wa);
}
.os-hint {
  text-align: center;
}
.os-photo {
  flex-wrap: wrap;
}
.os-photo p {
  flex: 1;
  min-width: 200px;
}
.os-photo .btn {
  flex: none;
}
kbd {
  padding: 1px 5px;
  border-radius: 4px;
  border: 1px solid currentColor;
  font: 600 11px var(--font-mono);
}

.os-items {
  padding-top: var(--s-5);
  border-top: 1px solid var(--border);
}
.os-items-h {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: var(--s-3);
}
.os-items-h h2 {
  margin: 0;
  font: 700 var(--fs-2xs) / 1 var(--font-sans);
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--text-muted);
}
.os-items-h span {
  font-family: var(--font-display);
  font-size: var(--fs-lg);
  font-weight: 500;
}
.os-items ul {
  display: grid;
  gap: var(--s-3);
  list-style: none;
  margin: 0;
  padding: 0;
}
.os-items li {
  display: flex;
  align-items: center;
  gap: var(--s-3);
}
.os-items img {
  width: 48px;
  height: 60px;
  flex: none;
  object-fit: cover;
  border-radius: var(--r-sm);
  background: var(--bg-sunken);
}
.os-items li div {
  flex: 1;
  min-width: 0;
}
.os-items li p {
  margin: 0;
  font-size: var(--fs-sm);
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.os-items li span {
  font-size: var(--fs-xs);
  color: var(--text-muted);
}
.os-items li b {
  font-size: var(--fs-sm);
}

.os-cust {
  padding: var(--s-4);
  border-radius: var(--r-md);
  background: var(--bg-sunken);
  font-size: var(--fs-sm);
}
.os-cust p {
  margin: 0;
}
.os-pay svg {
  color: var(--accent-text);
}

.os-acts {
  display: grid;
  gap: var(--s-2);
  margin-top: var(--s-6);
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes pop-in {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
}

@media (min-width: 720px) {
  .os {
    padding-top: var(--s-16);
  }
  .os-card {
    padding: var(--s-8);
  }
  .os-acts {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
