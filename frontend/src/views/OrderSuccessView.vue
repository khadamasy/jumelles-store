<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-8">
    <!-- Success Badge -->
    <div class="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-md animate-bounce">
      ✓
    </div>

    <div class="space-y-3">
      <span class="text-xs uppercase tracking-widest text-gold-600 font-bold">Commande Enregistrée</span>
      <h1 class="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
        Merci pour votre commande chez Jumelles Store !
      </h1>
      <p class="text-stone-600 text-sm">
        Numéro de commande : <strong class="text-stone-950 font-mono">{{ orderNumber }}</strong>
      </p>
    </div>

    <!-- Payment Action Card -->
    <div class="bg-white p-8 rounded-3xl border border-stone-200 shadow-xl max-w-lg mx-auto space-y-6">
      <div class="flex items-center justify-between border-b border-stone-100 pb-4">
        <div class="flex items-center gap-2">
          <span class="text-2xl">{{ provider === 'WAVE' ? '🌊' : '🍊' }}</span>
          <span class="font-bold text-stone-900">{{ provider === 'WAVE' ? 'Paiement Wave' : 'Paiement Orange Money' }}</span>
        </div>
        <span class="font-serif font-bold text-xl text-stone-900">{{ formatPrice(amount) }}</span>
      </div>

      <!-- Wave QR Code or Launch -->
      <div v-if="provider === 'WAVE'" class="space-y-4">
        <p class="text-xs text-stone-500">
          Scannez le QR code ci-dessous avec votre application Wave ou cliquez sur le bouton de redirection :
        </p>
        <div v-if="qrCodeUrl" class="p-3 bg-stone-50 rounded-2xl border border-stone-200 inline-block shadow-inner">
          <img :src="qrCodeUrl" alt="QR Code Wave" class="w-48 h-48 mx-auto rounded-lg" />
        </div>
        <div>
          <a
            :href="paymentUrl"
            target="_blank"
            class="inline-block w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all"
          >
            📱 Ouvrir l'application Wave pour valider
          </a>
        </div>
      </div>

      <!-- Orange Money Action -->
      <div v-else class="space-y-4">
        <p class="text-xs text-stone-500">
          Un SMS de demande de paiement a été initié ou vous pouvez régler via le portail sécurisé Orange Money :
        </p>
        <div>
          <a
            :href="paymentUrl"
            target="_blank"
            class="inline-block w-full py-3 px-6 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all"
          >
            📱 Accéder à la page sécurisée Orange Money
          </a>
        </div>
      </div>

      <!-- Demo Simulator Button -->
      <div class="pt-4 border-t border-stone-100 bg-stone-50 p-4 rounded-xl">
        <p class="text-xs text-stone-500 mb-2 font-medium">Environnement de Démonstration :</p>
        <button
          @click="simulatePayment"
          :disabled="isSimulating || isPaid"
          class="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow transition-all flex items-center justify-center gap-2"
        >
          <span v-if="isPaid">✓ Paiement Validé avec Succès !</span>
          <span v-else-if="isSimulating">Validation de la transaction en cours...</span>
          <span v-else>Simuler la confirmation du paiement (Test)</span>
        </button>
      </div>
    </div>

    <!-- Secondary Links -->
    <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
      <router-link
        to="/orders"
        class="px-6 py-3 bg-stone-900 hover:bg-gold-600 text-white text-xs font-semibold rounded-xl transition-all shadow"
      >
        Consulter mes commandes
      </router-link>
      <router-link
        to="/catalog"
        class="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-all"
      >
        Continuer mes achats
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { PaymentService } from '../services/api';

const route = useRoute();

const orderId = ref((route.query.orderId as string) || '');
const orderNumber = ref((route.query.orderNumber as string) || 'JUM-2026');
const provider = ref((route.query.provider as string) || 'WAVE');
const amount = ref(parseFloat(route.query.amount as string) || 0);
const qrCodeUrl = ref((route.query.qrCodeUrl as string) || '');
const paymentUrl = ref((route.query.paymentUrl as string) || '');

const isSimulating = ref(false);
const isPaid = ref(false);

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(price);
};

const simulatePayment = async () => {
  if (!orderId.value) return;
  isSimulating.value = true;
  try {
    await PaymentService.simulateSuccess(orderId.value);
    isPaid.value = true;
  } catch (error) {
    console.error('Erreur simulation:', error);
  } finally {
    isSimulating.value = false;
  }
};
</script>
