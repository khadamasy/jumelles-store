<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-center space-y-8">
    <!-- Badge de Succès -->
    <div class="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg ring-8 ring-emerald-50">
      <CheckCircle2 class="w-10 h-10 text-emerald-600" />
    </div>

    <!-- Titres -->
    <div class="space-y-3">
      <span class="text-xs uppercase tracking-widest text-[#25D366] font-extrabold bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
        <IconWhatsApp className="w-4 h-4 text-[#25D366]" />
        <span>Commande Enregistrée & Transmise sur WhatsApp</span>
      </span>
      <h1 class="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900">
        Merci pour votre commande !
      </h1>
      <p class="text-stone-600 text-xs sm:text-sm">
        Numéro de suivi officiel : <strong class="text-stone-950 font-mono font-black text-base">{{ displayOrderNumber }}</strong>
      </p>
    </div>

    <!-- Carte Principale WhatsApp & Récapitulatif -->
    <div class="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xl max-w-xl mx-auto space-y-6 text-left">
      <!-- Gros Bouton d'Ouverture WhatsApp -->
      <div class="space-y-3">
        <a
          :href="whatsappUrl"
          target="_blank"
          class="w-full py-4 px-5 bg-[#25D366] hover:bg-[#20ba59] active:scale-98 text-white font-black text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer group"
        >
          <IconWhatsApp className="w-6 h-6 text-white shrink-0 group-hover:scale-110 transition-transform" />
          <span>Ouvrir la discussion WhatsApp (+221 77 208 78 20)</span>
        </a>
        <p class="text-[11px] text-stone-500 text-center font-light">
          Si votre application WhatsApp ne s'est pas ouverte automatiquement, cliquez sur le bouton vert ci-dessus pour envoyer votre commande.
        </p>
      </div>

      <!-- Informations de Commande & Articles -->
      <div class="border-t border-stone-100 pt-5 space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-xs uppercase font-bold tracking-wider text-stone-400">Articles Commandés</span>
          <span class="font-serif font-black text-stone-950 text-base text-gold-700">
            Total : {{ formatPrice(displayAmount) }}
          </span>
        </div>

        <!-- Liste des articles si disponibles dans la session -->
        <div v-if="orderItems.length > 0" class="space-y-3 divide-y divide-stone-100">
          <div
            v-for="(item, idx) in orderItems"
            :key="idx"
            class="flex items-center gap-3 text-xs pt-3 first:pt-0"
          >
            <img
              v-if="item.imageUrl"
              :src="item.imageUrl"
              :alt="item.productName"
              class="w-12 h-12 object-cover rounded-xl bg-stone-100 border border-stone-200 shrink-0"
            />
            <div class="flex-1 min-w-0">
              <p class="font-bold text-stone-900 truncate">{{ item.productName }}</p>
              <p class="text-stone-500 text-[11px]">
                {{ item.color }}
                <span v-if="item.sizeOrShoeSize">• Pointure/Taille : {{ item.sizeOrShoeSize }}</span>
                <span>(x{{ item.quantity }})</span>
              </p>
            </div>
            <span class="font-bold text-stone-950 text-xs">
              {{ formatPrice(item.price * item.quantity) }}
            </span>
          </div>
        </div>

        <!-- Coordonnées Cliente enregistrées -->
        <div v-if="customerDetails.name" class="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5 text-xs">
          <p class="font-bold text-stone-900">Coordonnées de livraison :</p>
          <p class="text-stone-600">Cliente : <strong>{{ customerDetails.name }}</strong></p>
          <p class="text-stone-600">Téléphone : <strong class="font-mono">{{ customerDetails.phone }}</strong></p>
          <p class="text-stone-600">Adresse : {{ customerDetails.address }} ({{ customerDetails.city }})</p>
        </div>

        <!-- Note Règlement à la Livraison -->
        <div class="p-4 bg-amber-50/80 border border-amber-200/90 rounded-2xl flex items-start gap-3 text-xs">
          <Truck class="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <div class="space-y-0.5">
            <p class="font-bold text-amber-950">Règlement à la réception du colis :</p>
            <p class="text-stone-700 text-[11px] leading-relaxed">
              Vous réglerez directement auprès du livreur à Dakar, en espèces ou par transfert Wave / Orange Money sur le numéro officiel <strong>77 208 78 20 (Fary Dione)</strong> lors de la remise de votre paquet.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Secondaire -->
    <div class="flex flex-wrap items-center justify-center gap-4 pt-2">
      <router-link
        to="/catalog"
        class="px-6 py-3 bg-stone-900 hover:bg-gold-600 text-white text-xs font-bold rounded-xl transition-all shadow"
      >
        Continuer mes achats
      </router-link>
      <router-link
        to="/"
        class="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-all"
      >
        Retour à l'accueil
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { CheckCircle2, Truck } from 'lucide-vue-next';
import IconWhatsApp from '../components/icons/IconWhatsApp.vue';
import { useCurrencyStore } from '../stores/currency';

const route = useRoute();
const currencyStore = useCurrencyStore();

const displayOrderNumber = ref('');
const displayAmount = ref(0);
const whatsappUrl = ref('');
const orderItems = ref<any[]>([]);
const customerDetails = ref({
  name: '',
  phone: '',
  city: '',
  address: '',
});

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
      displayAmount.value = data.totalAmount || Number(route.query.amount) || 0;
      whatsappUrl.value = data.whatsappUrl || '';
      orderItems.value = data.items || [];
      customerDetails.value = {
        name: data.customerName || '',
        phone: data.customerPhone || '',
        city: data.shippingCity || '',
        address: data.shippingAddress || '',
      };
    } catch (e) {
      console.warn('Erreur parsing last order', e);
    }
  }

  if (!displayOrderNumber.value) {
    displayOrderNumber.value = (route.query.orderNumber as string) || 'CMD-JUMELLES';
  }
  if (!displayAmount.value) {
    displayAmount.value = Number(route.query.amount) || 0;
  }
  if (!whatsappUrl.value) {
    const defaultMsg = `Bonjour Maison Jumelles ✨, je souhaite confirmer ma commande ${displayOrderNumber.value}.`;
    whatsappUrl.value = `https://wa.me/221772087820?text=${encodeURIComponent(defaultMsg)}`;
  }
});
</script>
