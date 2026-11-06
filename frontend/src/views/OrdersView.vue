<template>
  <div class="trk wrap">
    <!-- En-tête -->
    <header class="trk-head">
      <span class="eyebrow"><i></i>Suivi en temps réel</span>
      <h1>Où en est ma commande ?</h1>
      <p class="lead">
        Saisissez votre numéro de commande et le téléphone utilisé lors de l’achat pour voir où en est votre colis.
      </p>
    </header>

    <!-- Recherche (numéro + téléphone : personne d'autre ne peut consulter vos commandes) -->
    <form novalidate class="card trk-form" @submit.prevent="loadOrders">
      <div class="trk-fields">
        <div class="field">
          <label for="track-order-number" class="label">Numéro de commande</label>
          <input
            id="track-order-number"
            v-model="orderNumberInput"
            type="text"
            maxlength="30"
            autocomplete="off"
            autocapitalize="characters"
            spellcheck="false"
            placeholder="JUM-2026-7KQ9X2MD"
            class="input trk-mono"
            :aria-invalid="fieldError === 'order'"
          />
        </div>
        <div class="field">
          <label for="track-phone" class="label">Téléphone de la commande</label>
          <input
            id="track-phone"
            v-model="phoneInput"
            type="tel"
            inputmode="tel"
            maxlength="25"
            autocomplete="tel"
            placeholder="77 123 45 67"
            class="input"
            :aria-invalid="fieldError === 'phone'"
          />
        </div>
      </div>

      <Transition name="slide-down">
        <div v-if="errorMessage" role="alert" class="note danger">
          <AlertCircle aria-hidden="true" />
          <p>{{ errorMessage }}</p>
        </div>
      </Transition>

      <button type="submit" class="btn dark lg block" :class="{ loading }" :disabled="loading">
        <Search aria-hidden="true" />
        Suivre ma commande
      </button>

      <details class="trk-help">
        <summary>Où trouver mon numéro de commande ?<ChevronDown aria-hidden="true" /></summary>
        <p>
          Il commence par <strong class="trk-mono">JUM-</strong> et figure en haut du message WhatsApp envoyé lors de
          votre commande (« RÉFÉRENCE COMMANDE »), ainsi que sur la page de confirmation. Vous ne le retrouvez pas ?
          Écrivez-nous sur WhatsApp avec votre nom : nous le retrouvons pour vous.
        </p>
      </details>
    </form>

    <!-- Chargement -->
    <div v-if="loading" class="trk-list" aria-hidden="true">
      <div v-for="n in 2" :key="n" class="skel trk-sk"></div>
    </div>

    <!-- Aucune commande correspondante -->
    <UiEmpty
      v-else-if="searched && orders.length === 0"
      class="card"
      title="Aucune commande trouvée"
      text="Le numéro de commande et le téléphone doivent correspondre exactement à ceux de l’achat. Vérifiez-les, ou contactez-nous : nous vous répondons rapidement."
    >
      <template #icon><PackageSearch /></template>
      <a :href="helpWhatsAppUrl(orderNumberInput)" target="_blank" rel="noopener noreferrer" class="btn wa">
        <IconWhatsApp className="w-4 h-4" />
        Demander de l’aide sur WhatsApp
      </a>
    </UiEmpty>

    <!-- Résultats -->
    <section v-else-if="orders.length > 0" class="trk-list stagger" aria-live="polite">
      <p v-if="orders.length > 1" class="trk-count">
        {{ orders.length }} commandes associées à ce numéro de téléphone.
      </p>

      <article
        v-for="order in sortedOrders"
        :key="order.orderNumber"
        class="card trk-order"
        :class="{ hl: order.orderNumber === searchedNumber }"
      >
        <!-- En-tête de la commande -->
        <header class="trk-oh">
          <div>
            <span class="trk-k">Commande</span>
            <p class="trk-num trk-mono">{{ order.orderNumber }}</p>
            <p class="trk-date">Passée le {{ formatDate(order.createdAt) }}</p>
          </div>
          <span class="pill" :class="statusInfo(order.status).tone">{{ statusInfo(order.status).label }}</span>
        </header>

        <div class="trk-ob">
          <!-- Progression -->
          <div v-if="order.status !== 'CANCELLED'">
            <p class="trk-msg">{{ statusInfo(order.status).message }}</p>
            <ol
              class="trk-steps"
              :style="{ '--p': Math.max(0, stepIndex(order.status)) / (STEPS.length - 1) }"
              :aria-label="`Avancement : ${statusInfo(order.status).label}`"
            >
              <li
                v-for="(step, idx) in STEPS"
                :key="step.label"
                :class="{ done: idx < stepIndex(order.status), cur: idx === stepIndex(order.status) }"
                :aria-current="idx === stepIndex(order.status) ? 'step' : undefined"
              >
                <span class="trk-dot">
                  <Check v-if="idx < stepIndex(order.status)" aria-hidden="true" />
                  <component :is="step.icon" v-else aria-hidden="true" />
                </span>
                <span class="trk-sl">{{ step.label }}</span>
              </li>
            </ol>
          </div>

          <!-- Commande annulée -->
          <div v-else class="note danger">
            <XCircle aria-hidden="true" />
            <p>
              Cette commande a été annulée (annulation de votre part, ou commande non confirmée sur WhatsApp dans les 48
              heures). Les articles ont été remis en vente. Pour la relancer, contactez-nous sur WhatsApp.
            </p>
          </div>

          <!-- Articles -->
          <div>
            <h3 class="trk-k">Articles</h3>
            <ul class="trk-items">
              <li v-for="(item, idx) in order.items" :key="item.id || idx">
                <div>
                  <p>{{ item.productName }}</p>
                  <span>{{ item.variantDetails }} · Quantité : {{ item.quantity }}</span>
                </div>
                <b class="tnum">{{ formatPrice(item.totalPrice) }}</b>
              </li>
            </ul>
          </div>

          <!-- Total, livraison -->
          <footer class="trk-of">
            <div class="trk-meta">
              <p><MapPin aria-hidden="true" />Livraison : <strong>{{ order.shippingCity }}</strong></p>
              <p><Banknote aria-hidden="true" />Règlement à la livraison</p>
            </div>
            <div class="trk-total">
              <span class="trk-k">Total articles</span>
              <strong class="tnum">{{ formatPrice(order.totalAmount) }}</strong>
            </div>
          </footer>

          <a
            :href="helpWhatsAppUrl(order.orderNumber)"
            target="_blank"
            rel="noopener noreferrer"
            class="btn ghost block trk-wa"
          >
            <IconWhatsApp className="w-4 h-4" />
            Une question sur cette commande ? Écrivez-nous
          </a>
        </div>
      </article>
    </section>

    <!-- Avant la première recherche : rappel des étapes -->
    <section v-else class="trk-intro" aria-label="Étapes d'une commande">
      <div v-for="(step, idx) in STEPS" :key="step.label" class="trk-ic">
        <span class="trk-ic-n tnum">{{ idx + 1 }}</span>
        <component :is="step.icon" aria-hidden="true" />
        <p>{{ step.label }}</p>
        <span>{{ step.hint }}</span>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  Package,
  PackageSearch,
  Search,
  Check,
  ClipboardCheck,
  Truck,
  Home,
  Clock,
  XCircle,
  MapPin,
  Banknote,
  AlertCircle,
  ChevronDown,
} from 'lucide-vue-next';
import IconWhatsApp from '../components/icons/IconWhatsApp.vue';
import UiEmpty from '../components/ui/UiEmpty.vue';
import { OrderService } from '../services/api';
import { buildWhatsAppSendUrl } from '../stores/phone';

const ORDER_NUMBER_PATTERN = /^JUM-\d{4}-[A-Z0-9]{4,12}$/;

/** Étapes visibles par la cliente (PAID et PREPARING sont regroupés : « confirmée ») */
const STEPS = [
  { label: 'Reçue', icon: Clock, hint: 'Enregistrée sur le site, en attente de confirmation WhatsApp' },
  { label: 'Confirmée', icon: ClipboardCheck, hint: 'Validée par la boutique et préparée avec soin' },
  { label: 'En livraison', icon: Truck, hint: 'Remise au livreur, sous 24h à Dakar' },
  { label: 'Livrée', icon: Home, hint: 'Réglée à la réception du colis' },
];

const STATUS: Record<string, { label: string; message: string; tone: string; icon: any; step: number }> = {
  PENDING: {
    label: 'En attente de confirmation',
    message: 'Commande reçue. Envoyez le message WhatsApp (si ce n\'est pas déjà fait) pour que nous la confirmions.',
    tone: 'warning',
    icon: Clock,
    step: 0,
  },
  PAID: {
    label: 'Confirmée',
    message: 'Commande confirmée par la boutique. Nous la préparons pour l\'expédition.',
    tone: 'success',
    icon: ClipboardCheck,
    step: 1,
  },
  PREPARING: {
    label: 'En préparation',
    message: 'Votre colis est en cours de préparation.',
    tone: 'success',
    icon: Package,
    step: 1,
  },
  SHIPPED: {
    label: 'En cours de livraison',
    message: 'Votre colis est en route : le livreur vous appelle avant de passer.',
    tone: 'info',
    icon: Truck,
    step: 2,
  },
  DELIVERED: {
    label: 'Livrée',
    message: 'Colis livré. Merci pour votre confiance !',
    tone: '',
    icon: Home,
    step: 3,
  },
  CANCELLED: {
    label: 'Annulée',
    message: '',
    tone: 'danger',
    icon: XCircle,
    step: -1,
  },
};

const statusInfo = (status: string) => STATUS[status] || STATUS.PENDING;
const stepIndex = (status: string) => statusInfo(status).step;

const route = useRoute();
const orderNumberInput = ref('');
const phoneInput = ref('');
const errorMessage = ref('');
const fieldError = ref<'' | 'order' | 'phone'>('');
const orders = ref<any[]>([]);
const loading = ref(false);
const searched = ref(false);
const searchedNumber = ref('');

/** Commande recherchée en premier, puis les autres de la plus récente à la plus ancienne */
const sortedOrders = computed(() =>
  [...orders.value].sort((a, b) => {
    if (a.orderNumber === searchedNumber.value) return -1;
    if (b.orderNumber === searchedNumber.value) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  })
);

/** Tolère les espaces et l'absence de tirets : « jum 2026 7kq9x2md » → « JUM-2026-7KQ9X2MD » */
const normalizeOrderNumber = (raw: string) => {
  const compact = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const m = compact.match(/^JUM(\d{4})([A-Z0-9]{4,12})$/);
  return m ? `JUM-${m[1]}-${m[2]}` : raw.trim().toUpperCase();
};

const loadOrders = async () => {
  if (loading.value) return;
  errorMessage.value = '';
  fieldError.value = '';

  const orderNumber = normalizeOrderNumber(orderNumberInput.value);
  if (!ORDER_NUMBER_PATTERN.test(orderNumber)) {
    fieldError.value = 'order';
    errorMessage.value = 'Numéro de commande invalide : il ressemble à JUM-2026-7KQ9X2MD.';
    return;
  }
  const phone = phoneInput.value.trim();
  const digits = phone.replace(/\D/g, '');
  if (!/^[\d\s+\-().]+$/.test(phone) || digits.length < 8 || digits.length > 15) {
    fieldError.value = 'phone';
    errorMessage.value = 'Numéro de téléphone invalide (ex : 77 123 45 67).';
    return;
  }

  orderNumberInput.value = orderNumber;
  loading.value = true;
  try {
    const res = await OrderService.track(orderNumber, phone);
    orders.value = Array.isArray(res.data?.data) ? res.data.data : [];
    searchedNumber.value = orderNumber;
    searched.value = true;
  } catch (error: any) {
    orders.value = [];
    searched.value = false;
    errorMessage.value =
      error.response?.data?.message || 'Recherche impossible pour le moment. Vérifiez votre connexion et réessayez.';
  } finally {
    loading.value = false;
  }
};

// Lien « Suivre ma commande » depuis la page de confirmation : numéro pré-rempli
onMounted(() => {
  const fromQuery = route.query.orderNumber;
  if (typeof fromQuery === 'string') {
    const normalized = normalizeOrderNumber(fromQuery);
    if (ORDER_NUMBER_PATTERN.test(normalized)) orderNumberInput.value = normalized;
  }
});

const helpWhatsAppUrl = (orderNumber?: string) => {
  const subject =
    orderNumber && ORDER_NUMBER_PATTERN.test(normalizeOrderNumber(orderNumber))
      ? ` concernant ma commande ${normalizeOrderNumber(orderNumber)}`
      : ' concernant le suivi de ma commande';
  return buildWhatsAppSendUrl(`Bonjour Jumelles Store, j'ai une question${subject}.`);
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const formatPrice = (price: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(price || 0);
</script>
<style scoped>
.trk {
  max-width: 980px;
  padding-top: var(--s-8);
  padding-bottom: var(--s-12);
}
.trk-mono {
  font-family: var(--font-mono);
  letter-spacing: 0.02em;
}

.trk-head {
  text-align: center;
}
.trk-head h1 {
  margin: var(--s-3) 0 var(--s-2);
  font-size: var(--fs-3xl);
  line-height: var(--lh-tight);
  font-weight: 400;
}
.trk-head .lead {
  margin: 0 auto;
  max-width: 34em;
  color: var(--text-muted);
  font-size: var(--fs-sm);
}

/* ----- Formulaire ----- */
.trk-form {
  display: grid;
  gap: var(--s-4);
  margin-top: var(--s-8);
  padding: var(--s-5);
}
.trk-fields {
  display: grid;
  gap: var(--s-4);
}
.trk-fields .trk-mono {
  text-transform: uppercase;
}
.trk-help summary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 36px;
  font-size: var(--fs-sm);
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  list-style: none;
}
.trk-help summary::-webkit-details-marker {
  display: none;
}
.trk-help summary:hover {
  color: var(--text);
}
.trk-help summary svg {
  width: 16px;
  height: 16px;
  transition: transform var(--dur-3) var(--ease-out);
}
.trk-help[open] summary svg {
  transform: rotate(180deg);
}
.trk-help p {
  margin: var(--s-2) 0 0;
  font-size: var(--fs-sm);
  color: var(--text-muted);
  line-height: 1.6;
  animation: rise-in var(--dur-3) var(--ease-out);
}

/* ----- Liste ----- */
.trk-list {
  display: grid;
  gap: var(--s-5);
  margin-top: var(--s-6);
}
.trk-sk {
  height: 220px;
  border-radius: var(--r-lg);
}
.trk-count {
  margin: 0;
  text-align: center;
  font-size: var(--fs-sm);
  color: var(--text-muted);
}
.trk-list > .card,
.trk-list ~ .card {
  margin-top: 0;
}
:deep(.empty.card) {
  margin-top: var(--s-6);
}

.trk-order {
  overflow: hidden;
}
.trk-order.hl {
  border-color: rgb(var(--c-gold-300));
  box-shadow: 0 0 0 3px rgb(var(--c-gold-100)), var(--sh-1);
}
.trk-oh {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--s-3);
  padding: var(--s-5);
  background: var(--surface-2);
  border-bottom: 1px solid var(--border);
}
.trk-k {
  display: block;
  margin: 0 0 4px;
  font: 700 var(--fs-2xs) / 1.2 var(--font-sans);
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--text-muted);
}
.trk-num {
  margin: 0;
  font-size: var(--fs-md);
  font-weight: 700;
}
.trk-date {
  margin: 2px 0 0;
  font-size: var(--fs-xs);
  color: var(--text-muted);
}
.trk-ob {
  display: grid;
  gap: var(--s-6);
  padding: var(--s-5);
}
.trk-msg {
  margin: 0 0 var(--s-5);
  font-size: var(--fs-sm);
}

/* Frise d'avancement */
.trk-steps {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  list-style: none;
  margin: 0;
  padding: 0;
}
.trk-steps::before,
.trk-steps::after {
  content: '';
  position: absolute;
  top: 17px;
  left: 12.5%;
  right: 12.5%;
  height: 2px;
  border-radius: 2px;
  background: var(--border);
}
.trk-steps::after {
  background: var(--accent);
  transform-origin: left;
  transform: scaleX(var(--p));
  animation: grow 0.9s var(--ease-out) 0.2s both;
}
.trk-steps li {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-2);
  text-align: center;
}
.trk-dot {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--surface);
  border: 2px solid var(--border);
  color: var(--text-faint);
  transition: background-color var(--dur-3), border-color var(--dur-3);
}
.trk-dot svg {
  width: 16px;
  height: 16px;
}
.trk-steps li.done .trk-dot {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--ink);
}
.trk-steps li.cur .trk-dot {
  border-color: var(--accent);
  color: var(--accent-text);
  box-shadow: 0 0 0 5px rgb(var(--c-gold-100));
}
.trk-sl {
  font-size: var(--fs-2xs);
  font-weight: 600;
  line-height: 1.25;
  color: var(--text-faint);
}
.trk-steps li.done .trk-sl,
.trk-steps li.cur .trk-sl {
  color: var(--text);
}

.trk-items {
  list-style: none;
  margin: 0;
  padding: 0;
}
.trk-items li {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--s-3);
  padding: var(--s-3) 0;
  border-bottom: 1px solid var(--border);
  font-size: var(--fs-sm);
}
.trk-items li:last-child {
  border-bottom: 0;
}
.trk-items p {
  margin: 0;
  font-weight: 600;
}
.trk-items span {
  font-size: var(--fs-xs);
  color: var(--text-muted);
}
.trk-items b {
  flex: none;
}

.trk-of {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--s-4);
  padding-top: var(--s-4);
  border-top: 1px solid var(--border);
}
.trk-meta p {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 4px;
  font-size: var(--fs-xs);
  color: var(--text-muted);
}
.trk-meta strong {
  color: var(--text);
}
.trk-meta svg {
  width: 14px;
  height: 14px;
}
.trk-total {
  text-align: right;
}
.trk-total strong {
  font-family: var(--font-display);
  font-size: var(--fs-xl);
  font-weight: 500;
}
.trk-wa {
  color: var(--wa);
  font-size: var(--fs-sm);
  background: var(--wa-soft);
}
.trk-wa:hover {
  --btn-bg: rgb(var(--c-wa-50));
  filter: brightness(0.97);
}

/* ----- Avant recherche ----- */
.trk-intro {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--s-3);
  margin-top: var(--s-6);
}
.trk-ic {
  position: relative;
  padding: var(--s-4);
  border-radius: var(--r-lg);
  background: var(--surface);
  border: 1px solid var(--border);
  animation: rise-in var(--dur-4) var(--ease-out) both;
}
.trk-ic:nth-child(2) {
  animation-delay: 60ms;
}
.trk-ic:nth-child(3) {
  animation-delay: 120ms;
}
.trk-ic:nth-child(4) {
  animation-delay: 180ms;
}
.trk-ic-n {
  position: absolute;
  top: var(--s-3);
  right: var(--s-4);
  font-family: var(--font-display);
  font-size: var(--fs-lg);
  color: var(--border-strong);
}
.trk-ic > svg {
  width: 22px;
  height: 22px;
  color: var(--accent-text);
}
.trk-ic p {
  margin: var(--s-2) 0 2px;
  font-size: var(--fs-sm);
  font-weight: 700;
}
.trk-ic > span:last-child {
  font-size: var(--fs-xs);
  line-height: 1.4;
  color: var(--text-muted);
}

@keyframes grow {
  from {
    transform: scaleX(0);
  }
}

@media (min-width: 720px) {
  .trk {
    padding-top: var(--s-12);
  }
  .trk-form {
    padding: var(--s-8);
  }
  .trk-fields {
    grid-template-columns: 1fr 1fr;
  }
  .trk-oh,
  .trk-ob {
    padding: var(--s-6) var(--s-8);
  }
  .trk-sl {
    font-size: var(--fs-xs);
  }
  .trk-intro {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
