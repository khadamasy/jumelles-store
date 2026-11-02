<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <div class="border-b border-stone-200 pb-4">
      <h1 class="font-serif text-3xl font-bold text-stone-900">
        Suivi de Vos Commandes
      </h1>
      <p class="text-sm text-stone-500 mt-1">
        Consultez l'historique et l'état d'avancement de vos achats chez Jumelles Store.
      </p>
    </div>

    <!-- Search / Filter by Email -->
    <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
      <div class="flex-1 w-full">
        <label class="block text-xs font-semibold text-stone-600 mb-1">Votre adresse e-mail :</label>
        <input
          v-model="emailInput"
          type="email"
          placeholder="ex: fatou.ndiaye@example.com"
          class="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 outline-none"
        />
      </div>
      <button
        @click="loadOrders"
        class="w-full sm:w-auto mt-auto px-6 py-2.5 bg-stone-900 hover:bg-gold-600 text-white font-semibold text-xs rounded-xl transition-all shadow"
      >
        Rechercher mes commandes
      </button>
    </div>

    <!-- Orders List -->
    <div v-if="loading" class="space-y-4">
      <div v-for="n in 3" :key="n" class="h-32 bg-stone-200 animate-pulse rounded-2xl"></div>
    </div>

    <div v-else-if="orders.length === 0" class="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
      <div class="text-5xl">📦</div>
      <h3 class="font-serif text-xl font-bold text-stone-900">Aucune commande trouvée.</h3>
      <p class="text-sm text-stone-500">Vérifiez l'adresse e-mail saisie ou découvrez notre catalogue.</p>
      <router-link to="/catalog" class="inline-block px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-xl hover:bg-gold-600 transition-colors">
        Découvrir la boutique
      </router-link>
    </div>

    <div v-else class="space-y-6">
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden"
      >
        <!-- Header Commande -->
        <div class="p-6 bg-stone-50 border-b border-stone-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span class="text-xs text-stone-400">Numéro de commande</span>
            <p class="font-mono font-bold text-stone-900 text-base">{{ order.orderNumber }}</p>
          </div>
          <div>
            <span class="text-xs text-stone-400">Date</span>
            <p class="text-xs font-medium text-stone-700">{{ formatDate(order.createdAt) }}</p>
          </div>
          <div>
            <span class="text-xs text-stone-400">Total</span>
            <p class="font-serif font-bold text-stone-950 text-base">{{ formatPrice(order.totalAmount) }}</p>
          </div>
          <div>
            <span
              class="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
              :class="getStatusBadgeClass(order.status)"
            >
              {{ getStatusLabel(order.status) }}
            </span>
          </div>
        </div>

        <!-- Items Commande -->
        <div class="p-6 divide-y divide-stone-100">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="py-3 flex items-center justify-between text-sm"
          >
            <div>
              <p class="font-bold text-stone-900">{{ item.productName }}</p>
              <p class="text-xs text-stone-500">Variante : {{ item.variantDetails }} • Quantité : {{ item.quantity }}</p>
            </div>
            <span class="font-semibold text-stone-800">{{ formatPrice(item.totalPrice) }}</span>
          </div>

          <div class="pt-4 flex flex-col sm:flex-row justify-between text-xs text-stone-500 gap-2">
            <p><strong>Destinataire :</strong> {{ order.customerName }} ({{ order.customerPhone }})</p>
            <p><strong>Adresse :</strong> {{ order.shippingAddress }}, {{ order.shippingCity }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { OrderService } from '../services/api';

const authStore = useAuthStore();
const emailInput = ref('');
const orders = ref<any[]>([]);
const loading = ref(false);

const loadOrders = async () => {
  if (!emailInput.value) return;
  loading.value = true;
  try {
    const res = await OrderService.getMyOrders(emailInput.value);
    orders.value = res.data.data;
  } catch (error) {
    console.error('Erreur chargement commandes:', error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(price);
};

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    PENDING: 'En attente de paiement',
    PAID: 'Payée (En cours)',
    PREPARING: 'En préparation',
    SHIPPED: 'Expédiée',
    DELIVERED: 'Livrée',
    CANCELLED: 'Annulée',
  };
  return map[status] || status;
};

const getStatusBadgeClass = (status: string) => {
  const map: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-800 border border-amber-300',
    PAID: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    PREPARING: 'bg-blue-100 text-blue-800 border border-blue-300',
    SHIPPED: 'bg-purple-100 text-purple-800 border border-purple-300',
    DELIVERED: 'bg-stone-100 text-stone-800 border border-stone-300',
    CANCELLED: 'bg-rosewood-100 text-rosewood-800 border border-rosewood-300',
  };
  return map[status] || 'bg-stone-100 text-stone-700';
};

onMounted(() => {
  if (authStore.user?.email) {
    emailInput.value = authStore.user.email;
    loadOrders();
  } else {
    emailInput.value = 'fatou.ndiaye@example.com';
    loadOrders();
  }
});
</script>

