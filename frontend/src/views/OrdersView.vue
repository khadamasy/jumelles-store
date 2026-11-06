<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
    <!-- En-tête -->
    <header class="space-y-3 text-center">
      <span
        class="text-[11px] uppercase tracking-widest text-gold-700 font-extrabold bg-gold-50 px-3.5 py-1 rounded-full border border-gold-200 inline-flex items-center gap-1.5"
      >
        <Package class="w-3.5 h-3.5 text-gold-600" aria-hidden="true" />
        <span>Suivi en temps réel</span>
      </span>
      <h1 class="font-serif text-3xl sm:text-4xl font-normal text-stone-900">Suivi de vos commandes</h1>
      <p class="text-sm text-stone-500 max-w-xl mx-auto">
        Saisissez votre numéro de commande et le téléphone utilisé lors de l'achat pour voir où en est votre colis.
      </p>
    </header>

    <!-- Formulaire de recherche (numéro + téléphone : personne d'autre ne peut consulter vos commandes) -->
    <form
      novalidate
      @submit.prevent="loadOrders"
      class="bg-white p-5 sm:p-7 rounded-3xl border border-stone-200 shadow-sm space-y-4"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="track-order-number" class="block text-xs font-bold text-stone-700 mb-1">
            Numéro de commande
          </label>
          <input
            id="track-order-number"
            v-model="orderNumberInput"
            type="text"
            maxlength="30"
            autocomplete="off"
            autocapitalize="characters"
            spellcheck="false"
            placeholder="JUM-2026-7KQ9X2MD"
            :aria-invalid="fieldError === 'order'"
            class="w-full px-4 py-3 rounded-xl border text-sm uppercase font-mono outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500"
            :class="fieldError === 'order' ? 'border-rosewood-400 bg-rosewood-50' : 'border-stone-300'"
          />
        </div>
        <div>
          <label for="track-phone" class="block text-xs font-bold text-stone-700 mb-1">
            Téléphone utilisé pour la commande
          </label>
          <input
            id="track-phone"
            v-model="phoneInput"
            type="tel"
            inputmode="tel"
            maxlength="25"
            autocomplete="tel"
            placeholder="77 123 45 67"
            :aria-invalid="fieldError === 'phone'"
            class="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500"
            :class="fieldError === 'phone' ? 'border-rosewood-400 bg-rosewood-50' : 'border-stone-300'"
          />
        </div>
      </div>

      <p v-if="errorMessage" role="alert" class="text-xs font-semibold text-rosewood-700 bg-rosewood-50 border border-rosewood-200 rounded-xl px-3.5 py-2.5">
        {{ errorMessage }}
      </p>

      <button
        type="submit"
        :disabled="loading"
        class="w-full py-3.5 bg-stone-900 hover:bg-gold-600 disabled:bg-stone-400 disabled:cursor-wait text-white font-bold text-sm rounded-xl transition-all shadow flex items-center justify-center gap-2"
      >
        <Loader2 v-if="loading" class="w-4 h-4 animate-spin" aria-hidden="true" />
        <Search v-else class="w-4 h-4" aria-hidden="true" />
        <span>{{ loading ? 'Recherche en cours…' : 'Suivre ma commande' }}</span>
      </button>

      <details class="text-xs text-stone-500 group">
        <summary class="cursor-pointer font-semibold text-stone-600 hover:text-gold-700 select-none">
          Où trouver mon numéro de commande ?
        </summary>
        <p class="mt-2 leading-relaxed">
          Il commence par <strong class="font-mono text-stone-700">JUM-</strong> et figure en haut du message
          WhatsApp envoyé lors de votre commande (« RÉFÉRENCE COMMANDE »), ainsi que sur la page de confirmation.
          Vous ne le retrouvez pas ? Écrivez-nous sur WhatsApp avec votre nom : nous le retrouvons pour vous.
        </p>
      </details>
    </form>

    <!-- Chargement -->
    <div v-if="loading" class="space-y-4" aria-hidden="true">
      <div v-for="n in 2" :key="n" class="h-40 bg-stone-200/70 animate-pulse rounded-3xl"></div>
    </div>

    <!-- Aucune commande correspondante -->
    <div
      v-else-if="searched && orders.length === 0"
      class="bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 text-center space-y-4"
    >
      <div class="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto">
        <PackageSearch class="w-7 h-7 text-stone-500" aria-hidden="true" />
      </div>
      <h2 class="font-serif text-xl font-normal text-stone-900">Aucune commande trouvée</h2>
      <p class="text-sm text-stone-500 max-w-md mx-auto">
        Le numéro de commande et le téléphone doivent correspondre exactement à ceux de l'achat.
        Vérifiez-les, ou contactez-nous : nous vous répondons rapidement.
      </p>
      <a
        :href="helpWhatsAppUrl(orderNumberInput)"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-xl transition-colors"
      >
        <IconWhatsApp className="w-4 h-4 text-white" />
        <span>Demander de l'aide sur WhatsApp</span>
      </a>
    </div>

    <!-- Résultats -->
    <section v-else-if="orders.length > 0" class="space-y-5" aria-live="polite">
      <p v-if="orders.length > 1" class="text-xs text-stone-500 text-center">
        {{ orders.length }} commandes associées à ce numéro de téléphone.
      </p>

      <article
        v-for="order in sortedOrders"
        :key="order.orderNumber"
        class="bg-white rounded-3xl border shadow-sm overflow-hidden"
        :class="order.orderNumber === searchedNumber ? 'border-gold-300 ring-1 ring-gold-200' : 'border-stone-200'"
      >
        <!-- En-tête de la commande -->
        <div class="p-5 sm:p-6 bg-stone-50 border-b border-stone-100 flex flex-wrap items-start justify-between gap-3">
          <div class="space-y-0.5">
            <p class="text-[11px] uppercase tracking-wider text-stone-400 font-bold">Commande</p>
            <p class="font-mono font-black text-stone-900 text-base">{{ order.orderNumber }}</p>
            <p class="text-xs text-stone-500">Passée le {{ formatDate(order.createdAt) }}</p>
          </div>
          <span
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
            :class="statusInfo(order.status).badge"
          >
            <component :is="statusInfo(order.status).icon" class="w-3.5 h-3.5" aria-hidden="true" />
            {{ statusInfo(order.status).label }}
          </span>
        </div>

        <div class="p-5 sm:p-6 space-y-6">
          <!-- Progression -->
          <div v-if="order.status !== 'CANCELLED'">
            <p class="text-sm text-stone-700 mb-4">{{ statusInfo(order.status).message }}</p>
            <ol class="grid grid-cols-4 gap-1" :aria-label="`Avancement : ${statusInfo(order.status).label}`">
              <li v-for="(step, idx) in STEPS" :key="step.label" class="flex flex-col items-center text-center gap-1.5">
                <div class="flex items-center w-full">
                  <span class="flex-1 h-0.5" :class="idx === 0 ? 'bg-transparent' : idx <= stepIndex(order.status) ? 'bg-gold-500' : 'bg-stone-200'"></span>
                  <span
                    class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors"
                    :class="
                      idx < stepIndex(order.status)
                        ? 'bg-gold-500 border-gold-500 text-white'
                        : idx === stepIndex(order.status)
                        ? 'bg-white border-gold-500 text-gold-700 ring-4 ring-gold-100'
                        : 'bg-white border-stone-200 text-stone-300'
                    "
                  >
                    <Check v-if="idx < stepIndex(order.status)" class="w-4 h-4" aria-hidden="true" />
                    <component :is="step.icon" v-else class="w-4 h-4" aria-hidden="true" />
                  </span>
                  <span class="flex-1 h-0.5" :class="idx === STEPS.length - 1 ? 'bg-transparent' : idx < stepIndex(order.status) ? 'bg-gold-500' : 'bg-stone-200'"></span>
                </div>
                <span
                  class="text-[10px] sm:text-[11px] leading-tight font-semibold"
                  :class="idx <= stepIndex(order.status) ? 'text-stone-800' : 'text-stone-400'"
                >
                  {{ step.label }}
                </span>
              </li>
            </ol>
          </div>

          <!-- Commande annulée -->
          <div v-else class="p-4 rounded-2xl bg-rosewood-50 border border-rosewood-200 text-xs text-rosewood-900 leading-relaxed">
            Cette commande a été annulée (annulation de votre part, ou commande non confirmée sur WhatsApp dans les
            48 heures). Les articles ont été remis en vente. Pour la relancer, contactez-nous sur WhatsApp.
          </div>

          <!-- Articles -->
          <div>
            <h3 class="text-[11px] uppercase tracking-wider text-stone-400 font-bold mb-2">Articles</h3>
            <ul class="divide-y divide-stone-100">
              <li
                v-for="(item, idx) in order.items"
                :key="item.id || idx"
                class="py-3 flex items-start justify-between gap-3 text-sm"
              >
                <div class="min-w-0">
                  <p class="font-bold text-stone-900">{{ item.productName }}</p>
                  <p class="text-xs text-stone-500">{{ item.variantDetails }} · Quantité : {{ item.quantity }}</p>
                </div>
                <span class="font-semibold text-stone-800 shrink-0">{{ formatPrice(item.totalPrice) }}</span>
              </li>
            </ul>
          </div>

          <!-- Total, livraison, aide -->
          <div class="pt-4 border-t border-stone-100 flex flex-wrap items-end justify-between gap-4">
            <div class="text-xs text-stone-500 space-y-1">
              <p class="flex items-center gap-1.5">
                <MapPin class="w-3.5 h-3.5 text-stone-400" aria-hidden="true" />
                Livraison : <strong class="text-stone-700">{{ order.shippingCity }}</strong>
              </p>
              <p class="flex items-center gap-1.5">
                <Banknote class="w-3.5 h-3.5 text-stone-400" aria-hidden="true" />
                Règlement à la livraison
              </p>
            </div>
            <div class="text-right">
              <p class="text-[11px] uppercase tracking-wider text-stone-400 font-bold">Total articles</p>
              <p class="font-serif text-xl font-black text-stone-950">{{ formatPrice(order.totalAmount) }}</p>
            </div>
          </div>

          <a
            :href="helpWhatsAppUrl(order.orderNumber)"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full py-3 px-4 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 transition-colors flex items-center justify-center gap-2"
          >
            <IconWhatsApp className="w-4 h-4 text-[#25D366]" />
            <span>Une question sur cette commande ? Écrivez-nous</span>
          </a>
        </div>
      </article>
    </section>

    <!-- Avant la première recherche : rappel des étapes -->
    <section v-else class="grid grid-cols-2 sm:grid-cols-4 gap-3" aria-label="Étapes d'une commande">
      <div
        v-for="step in STEPS"
        :key="step.label"
        class="bg-white rounded-2xl border border-stone-200 p-4 text-center space-y-2"
      >
        <component :is="step.icon" class="w-5 h-5 text-gold-600 mx-auto" aria-hidden="true" />
        <p class="text-xs font-bold text-stone-800">{{ step.label }}</p>
        <p class="text-[11px] text-stone-500 leading-snug">{{ step.hint }}</p>
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
  Loader2,
  Check,
  ClipboardCheck,
  Truck,
  Home,
  Clock,
  XCircle,
  MapPin,
  Banknote,
} from 'lucide-vue-next';
import IconWhatsApp from '../components/icons/IconWhatsApp.vue';
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

const STATUS: Record<string, { label: string; message: string; badge: string; icon: any; step: number }> = {
  PENDING: {
    label: 'En attente de confirmation',
    message: 'Commande reçue. Envoyez le message WhatsApp (si ce n\'est pas déjà fait) pour que nous la confirmions.',
    badge: 'bg-amber-50 text-amber-800 border border-amber-300',
    icon: Clock,
    step: 0,
  },
  PAID: {
    label: 'Confirmée',
    message: 'Commande confirmée par la boutique. Nous la préparons pour l\'expédition.',
    badge: 'bg-emerald-50 text-emerald-800 border border-emerald-300',
    icon: ClipboardCheck,
    step: 1,
  },
  PREPARING: {
    label: 'En préparation',
    message: 'Votre colis est en cours de préparation.',
    badge: 'bg-emerald-50 text-emerald-800 border border-emerald-300',
    icon: Package,
    step: 1,
  },
  SHIPPED: {
    label: 'En cours de livraison',
    message: 'Votre colis est en route : le livreur vous appelle avant de passer.',
    badge: 'bg-blue-50 text-blue-800 border border-blue-300',
    icon: Truck,
    step: 2,
  },
  DELIVERED: {
    label: 'Livrée',
    message: 'Colis livré. Merci pour votre confiance !',
    badge: 'bg-stone-100 text-stone-800 border border-stone-300',
    icon: Home,
    step: 3,
  },
  CANCELLED: {
    label: 'Annulée',
    message: '',
    badge: 'bg-rosewood-50 text-rosewood-800 border border-rosewood-300',
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
