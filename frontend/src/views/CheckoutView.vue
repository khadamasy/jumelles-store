<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <h1 class="font-serif text-3xl font-bold text-stone-900 mb-8">
      Finalisation de Votre Commande
    </h1>

    <div v-if="cartStore.items.length === 0" class="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
      <div class="text-5xl">🛍️</div>
      <h3 class="font-serif text-xl font-bold text-stone-900">Votre panier est vide.</h3>
      <p class="text-sm text-stone-500">Ajoutez des articles avant de procéder au règlement.</p>
      <router-link to="/catalog" class="inline-block px-6 py-3 bg-stone-900 text-white text-xs font-semibold rounded-xl hover:bg-gold-600 transition-colors">
        Aller à la boutique
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <!-- Checkout Form -->
      <div class="lg:col-span-7 space-y-6">
        <!-- Bandeau Mode Commande Rapide & Connexion Habituée -->
        <div class="bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 text-white p-5 rounded-2xl border border-gold-500/30 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <span class="text-2xl">⚡</span>
            <div>
              <p class="text-xs font-black text-gold-400 uppercase tracking-wider">Commande Express Sans Mot de Passe</p>
              <p class="text-xs text-stone-300">Renseignez simplement vos coordonnées ci-dessous pour régler immédiatement avec Wave ou Orange Money.</p>
            </div>
          </div>
          <div v-if="!authStore.isAuthenticated" class="shrink-0">
            <button
              type="button"
              @click="handleQuickLogin"
              class="px-4 py-2 bg-white/10 hover:bg-gold-500 hover:text-stone-950 border border-white/20 hover:border-gold-400 text-xs font-bold text-white rounded-xl transition-all shadow"
            >
              Déjà cliente ? Se connecter
            </button>
          </div>
          <div v-else class="shrink-0 flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold">
            <span>✓</span> Connectée : {{ authStore.userName }}
          </div>
        </div>

        <!-- 1. Coordonnées de Livraison -->
        <div class="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          <div class="flex items-center gap-3 border-b border-stone-100 pb-4">
            <span class="w-8 h-8 rounded-full bg-stone-900 text-gold-400 font-bold flex items-center justify-center text-sm">1</span>
            <div>
              <h2 class="font-serif text-lg font-bold text-stone-900">Coordonnées de Livraison</h2>
              <p class="text-xs text-stone-500">Renseignez vos coordonnées pour la réception de votre commande</p>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-stone-700 mb-1">Votre Nom complet *</label>
              <input
                v-model="form.customerName"
                type="text"
                placeholder="Ex: Awa Diop"
                class="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 outline-none"
                required
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-stone-700 mb-1">Votre Numéro de Téléphone (Appels / WhatsApp) *</label>
              <input
                v-model="form.customerPhone"
                type="tel"
                placeholder="Ex: 77 123 45 67 ou 78 234 56 78"
                class="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 outline-none"
                required
              />
              <p class="text-[11px] text-stone-500 mt-1">Le livreur vous appellera sur ce numéro avant la livraison.</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-stone-700 mb-1">Ville de Livraison *</label>
                <select
                  v-model="form.shippingCity"
                  class="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 outline-none bg-white"
                >
                  <option value="Dakar">Dakar (Plateau, Almadies, Mermoz...)</option>
                  <option value="Banlieue Dakar">Banlieue (Pikine, Guédiawaye, Rufisque)</option>
                  <option value="Thiès">Thiès</option>
                  <option value="Saint-Louis">Saint-Louis</option>
                  <option value="Mbour / Saly">Mbour / Saly</option>
                  <option value="Autre région">Autre Région du Sénégal</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-stone-700 mb-1">Quartier & Précisions *</label>
                <input
                  v-model="form.shippingAddress"
                  type="text"
                  placeholder="Ex: Almadies, face pharmacie ou Mermoz"
                  class="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 outline-none"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Choix du Mode de Paiement Mobile -->
        <div class="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          <div class="flex items-center gap-3 border-b border-stone-100 pb-4">
            <span class="w-8 h-8 rounded-full bg-stone-900 text-gold-400 font-bold flex items-center justify-center text-sm">2</span>
            <div>
              <h2 class="font-serif text-lg font-bold text-stone-900">Mode de Paiement Sécurisé</h2>
              <p class="text-xs text-stone-500">Paiement direct sécurisé Wave ou Orange Money</p>
            </div>
          </div>

          <!-- Encadré fixe et rassurant : numéro officiel de réception de la boutique -->
          <div class="bg-amber-50/80 border border-amber-200/90 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div class="flex items-center gap-3">
              <span class="text-2xl">📱</span>
              <div>
                <p class="font-bold text-amber-950 text-sm">Numéro Officiel de Transfert de la Boutique :</p>
                <p class="text-stone-700 text-xs mt-0.5">
                  Numéro : <strong class="text-stone-950 font-mono text-sm">77 208 78 20</strong>
                  <span class="mx-1 text-stone-400">•</span>
                  Titulaire (Wave & Orange Money) : <strong class="text-stone-950 font-bold">Fary Dione</strong>
                </p>
              </div>
            </div>
            <span class="self-start sm:self-center shrink-0 text-[10px] font-bold bg-amber-200/70 text-amber-900 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Compte Vérifié
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Option Wave -->
            <div
              @click="selectedProvider = 'WAVE'"
              class="cursor-pointer p-5 rounded-2xl border-2 transition-all flex flex-col justify-between"
              :class="selectedProvider === 'WAVE' ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20' : 'border-stone-200 hover:border-stone-300'"
            >
              <div class="flex items-center justify-between mb-3">
                <span class="text-2xl">🌊</span>
                <span class="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">Recommandé</span>
              </div>
              <div>
                <p class="font-bold text-stone-900">Wave Sénégal</p>
                <p class="text-xs text-stone-500 mt-1">Paiement instantané par QR code ou application mobile.</p>
              </div>
            </div>

            <!-- Option Orange Money -->
            <div
              @click="selectedProvider = 'ORANGE_MONEY'"
              class="cursor-pointer p-5 rounded-2xl border-2 transition-all flex flex-col justify-between"
              :class="selectedProvider === 'ORANGE_MONEY' ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20' : 'border-stone-200 hover:border-stone-300'"
            >
              <div class="flex items-center justify-between mb-3">
                <span class="text-2xl">🍊</span>
                <span class="text-xs font-bold text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-full">Orange Money</span>
              </div>
              <div>
                <p class="font-bold text-stone-900">Orange Money</p>
                <p class="text-xs text-stone-500 mt-1">Validation sécurisée par code secret OTP / WebPay.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary Card -->
      <div class="lg:col-span-5">
        <div class="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm relative lg:sticky lg:top-28 space-y-6">
          <h3 class="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-4">
            Récapitulatif de la Commande
          </h3>

          <!-- Articles List -->
          <div class="space-y-3 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
            <div
              v-for="item in cartStore.items"
              :key="item.variantId"
              class="flex items-center gap-3 text-xs"
            >
              <img :src="item.imageUrl" class="w-12 h-12 object-cover rounded-lg bg-stone-100 shrink-0" />
              <div class="flex-1 min-w-0">
                <p class="font-bold text-stone-900 truncate">{{ item.productName }}</p>
                <p class="text-stone-500">{{ item.color }} • {{ item.sizeOrShoeSize }} (x{{ item.quantity }})</p>
              </div>
              <span class="font-bold text-stone-900">{{ formatPrice(item.price * item.quantity) }}</span>
            </div>
          </div>

          <!-- Totals -->
          <div class="border-t border-stone-100 pt-4 space-y-2 text-sm">
            <div class="flex justify-between text-stone-600">
              <span>Sous-total articles :</span>
              <span>{{ cartStore.formattedSubtotal }}</span>
            </div>
            <div class="flex justify-between text-stone-600">
              <span>Frais de livraison :</span>
              <span class="text-emerald-600 font-semibold">Gratuit (Offre Lancement)</span>
            </div>
            <div class="border-t border-stone-200 pt-3 flex justify-between items-baseline font-bold text-stone-950 text-base">
              <span>Total à payer :</span>
              <div class="text-right">
                <span class="font-serif text-2xl text-gold-700 block">{{ currencyStore.toXofOnly(cartStore.subtotal) }}</span>
                <span class="text-xs text-stone-500 font-bold block">≈ {{ currencyStore.toEurOnly(cartStore.subtotal) }}</span>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            @click="handleCheckout"
            :disabled="isSubmitting"
            class="w-full py-4 rounded-xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2"
            :class="
              selectedProvider === 'WAVE'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-orange-600 hover:bg-orange-700'
            "
          >
            <span v-if="isSubmitting">Traitement en cours...</span>
            <span v-else>
              Payer avec {{ selectedProvider === 'WAVE' ? 'Wave' : 'Orange Money' }} ({{ cartStore.formattedSubtotal }})
            </span>
          </button>

          <p class="text-[11px] text-stone-400 text-center">
            En validant votre commande, vous acceptez les conditions de vente de Jumelles Store.
          </p>

          <!-- Assistance direct commande téléphonique -->
          <div class="pt-2 border-t border-stone-100 text-center">
            <p class="text-xs text-stone-500 font-medium">Besoin d'aide pour finaliser ?</p>
            <button
              @click="phoneStore.openModal('Finalisation Commande')"
              class="text-xs font-bold text-stone-900 hover:text-gold-700 underline block mt-0.5 mx-auto cursor-pointer"
            >
              📞 Service Téléphonique & WhatsApp : +221 77 208 78 20
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { useCurrencyStore } from '../stores/currency';
import { usePhoneStore } from '../stores/phone';
import { OrderService, PaymentService } from '../services/api';

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();
const currencyStore = useCurrencyStore();
const phoneStore = usePhoneStore();

const selectedProvider = ref<'WAVE' | 'ORANGE_MONEY'>('WAVE');
const isSubmitting = ref(false);

const form = reactive({
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  shippingCity: 'Dakar',
  shippingAddress: '',
});

const fillUserData = () => {
  if (authStore.user) {
    if (authStore.user.name && !form.customerName) form.customerName = authStore.user.name;
    if (authStore.user.email && !form.customerEmail) form.customerEmail = authStore.user.email;
  }
};

const handleQuickLogin = () => {
  if (authStore.keycloakInstance?.authenticated) {
    authStore.loginKeycloak();
  } else {
    authStore.loginAsDemoClient();
  }
  fillUserData();
};

watch(() => authStore.user, () => {
  fillUserData();
});

onMounted(() => {
  fillUserData();
});

const formatPrice = (price: number) => {
  return currencyStore.formatPrice(price);
};

const handleCheckout = async () => {
  if (!form.customerName || !form.customerPhone || !form.shippingAddress) {
    alert('Veuillez renseigner votre nom, téléphone et adresse de livraison.');
    return;
  }

  isSubmitting.value = true;
  try {
    const cleanPhone = form.customerPhone.replace(/\D/g, '');
    const clientEmail = form.customerEmail?.trim() || `${cleanPhone || 'client'}@client.jumelles.sn`;

    // 1. Création de la commande sur l'API Node.js
    const orderPayload = {
      customerName: form.customerName,
      customerEmail: clientEmail,
      customerPhone: form.customerPhone,
      shippingCity: form.shippingCity,
      shippingAddress: form.shippingAddress,
      items: cartStore.items.map((item) => ({
        productVariantId: item.variantId,
        quantity: item.quantity,
      })),
    };

    const orderRes = await OrderService.create(orderPayload);
    const createdOrder = orderRes.data.data;

    // 2. Initialisation du paiement Wave ou Orange Money
    const paymentRes = await PaymentService.initiate({
      orderId: createdOrder.id,
      provider: selectedProvider.value,
      customerPhone: form.customerPhone,
    });

    const paymentData = paymentRes.data.data;

    // Vider le panier
    cartStore.clearCart();

    // Rediriger vers la page de succès / paiement
    router.push({
      path: '/order-success',
      query: {
        orderId: createdOrder.id,
        orderNumber: createdOrder.orderNumber,
        provider: selectedProvider.value,
        amount: createdOrder.totalAmount,
        qrCodeUrl: paymentData.qrCodeUrl || '',
        paymentUrl: paymentData.paymentUrl || '',
        waveDeepLink: 'wave://',
        boutiquePhone: '+221 77 208 78 20',
      },
    });
  } catch (error: any) {
    console.error('Erreur checkout:', error);
    alert(error.response?.data?.message || 'Une erreur est survenue lors du paiement.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

