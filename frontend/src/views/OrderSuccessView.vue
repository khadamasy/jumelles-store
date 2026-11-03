<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center space-y-8">
    <!-- Success Badge -->
    <div class="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-lg ring-8 ring-emerald-50">
      ✓
    </div>

    <div class="space-y-3">
      <span class="text-xs uppercase tracking-widest text-gold-600 font-extrabold bg-gold-50 px-3.5 py-1 rounded-full border border-gold-200">
        Commande Enregistrée avec Succès
      </span>
      <h1 class="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900">
        Merci pour votre commande !
      </h1>
      <p class="text-stone-600 text-sm">
        Numéro de suivi officiel : <strong class="text-stone-950 font-mono font-black text-base">{{ orderNumber }}</strong>
      </p>
    </div>

    <!-- Payment Action Card -->
    <div class="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xl max-w-lg mx-auto space-y-6 text-left">
      <!-- En-tête Montant & Opérateur -->
      <div class="flex items-center justify-between border-b border-stone-100 pb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">{{ provider === 'WAVE' ? '🌊' : '🍊' }}</span>
          <div>
            <span class="font-black text-base text-stone-900 block">{{ provider === 'WAVE' ? 'Règlement Wave' : 'Règlement Orange Money' }}</span>
            <span class="text-[11px] text-stone-400">Paiement direct sans intermédiaire</span>
          </div>
        </div>
        <div class="text-right">
          <span class="text-[10px] text-stone-400 font-bold uppercase block">Montant à régler</span>
          <span class="font-serif font-black text-2xl text-stone-950 block text-gold-700">{{ formatPrice(amount) }}</span>
        </div>
      </div>

      <!-- ============================================== -->
      <!-- SECTION WAVE : OUVERTURE DIRECTE PRÉ-REMPLIE    -->
      <!-- ============================================== -->
      <div v-if="provider === 'WAVE'" class="space-y-5">
        <!-- 1. GROS BOUTON MOBILE PRIORITAIRE : Ouvre Wave et copie le numéro -->
        <div>
          <button
            @click="openWaveApp"
            type="button"
            class="w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 transform active:scale-95 cursor-pointer"
          >
            <span class="text-2xl">📱</span>
            <span>Ouvrir l'application Wave ({{ formatPrice(amount) }})</span>
          </button>
          <div
            v-if="waveNotice"
            class="mt-2.5 p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold text-center shadow-sm"
          >
            {{ waveNotice }}
          </div>
          <p class="text-[11px] text-stone-500 text-center mt-2 font-medium">
            En cliquant, le numéro <strong>{{ boutiquePhone }}</strong> et le montant sont copiés pour votre transfert Wave.
          </p>
        </div>

        <!-- 2. Récapitulatif clair avec boutons de copie en 1 clic -->
        <div class="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 space-y-3">
          <p class="text-[11px] font-black text-blue-900 flex items-center gap-1.5 uppercase tracking-wider">
            <span>💡</span> À renseigner dans Wave :
          </p>

          <!-- 1. Nom dans Wave -->
          <div class="flex items-center justify-between pb-2 border-b border-blue-100 text-xs">
            <span class="font-bold text-stone-600">1. Nom complet :</span>
            <div class="flex items-center gap-2">
              <span class="font-bold text-blue-950 text-xs select-all">{{ boutiqueName }}</span>
              <button
                @click="copyText(boutiqueName, 'name')"
                class="px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer"
                :class="copiedKey === 'name' ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-300' : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-100'"
              >
                {{ copiedKey === 'name' ? '✓ Copié !' : 'Copier Nom' }}
              </button>
            </div>
          </div>

          <!-- 2. Numéro Wave (9 chiffres 772087820 pour coller directement après le +221) -->
          <div class="flex items-center justify-between pb-2 border-b border-blue-100 text-xs">
            <div>
              <span class="font-bold text-stone-600 block">2. Téléphone Wave :</span>
              <span class="text-[10px] text-blue-700 font-semibold">(Wave met déjà le +221)</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-mono font-black text-blue-950 text-sm sm:text-base select-all">77 208 78 20</span>
              <button
                @click="copyText(boutiquePhoneLocal, 'phone')"
                class="px-3 py-1.5 text-xs font-black rounded-lg border transition-all cursor-pointer shadow-sm"
                :class="copiedKey === 'phone' ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-300' : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'"
              >
                {{ copiedKey === 'phone' ? '✓ Copié !' : 'Copier Numéro' }}
              </button>
            </div>
          </div>

          <!-- 3. Montant exact -->
          <div class="flex items-center justify-between pb-2 border-b border-blue-100 text-xs">
            <span class="font-bold text-stone-600">3. Montant exact :</span>
            <div class="flex items-center gap-2">
              <span class="font-serif font-black text-blue-950 text-base select-all">{{ formatPrice(amount) }}</span>
              <button
                @click="copyText(amount.toString(), 'amount')"
                class="px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer"
                :class="copiedKey === 'amount' ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-300' : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-100'"
              >
                {{ copiedKey === 'amount' ? '✓ Copié !' : 'Copier Montant' }}
              </button>
            </div>
          </div>

          <!-- 4. Référence commande -->
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-stone-600">4. Référence commande :</span>
            <div class="flex items-center gap-2">
              <span class="font-mono font-bold text-stone-800 select-all">{{ orderNumber }}</span>
              <button
                @click="copyText(orderNumber, 'ref')"
                class="px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer"
                :class="copiedKey === 'ref' ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-300' : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-100'"
              >
                {{ copiedKey === 'ref' ? '✓ Copié !' : 'Copier' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 3. Option QR Code pour les clientes sur ordinateur -->
        <div class="text-center pt-1 border-t border-stone-100">
          <button
            @click="showQrCode = !showQrCode"
            class="text-xs text-blue-700 hover:text-blue-900 font-bold underline flex items-center justify-center gap-1.5 mx-auto"
          >
            <span>{{ showQrCode ? '▲ Masquer le QR Code' : '📷 Vous êtes sur PC ? Afficher le QR Code à scanner' }}</span>
          </button>

          <div v-if="showQrCode" class="mt-4 p-4 bg-stone-50 rounded-2xl border border-stone-200 inline-block shadow-inner">
            <img :src="qrCodeUrl" alt="QR Code Wave" class="w-48 h-48 mx-auto rounded-xl shadow" />
            <p class="text-[10px] text-stone-500 mt-2">Scannez ce QR Code depuis l'appareil photo de votre application Wave.</p>
          </div>
        </div>
      </div>

      <!-- ============================================== -->
      <!-- SECTION ORANGE MONEY                           -->
      <!-- ============================================== -->
      <div v-else class="space-y-5">
        <a
          :href="paymentUrl"
          target="_blank"
          class="w-full py-4 px-6 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-800 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3"
        >
          <span class="text-2xl">📱</span>
          <span>Valider avec Orange Money ({{ formatPrice(amount) }})</span>
        </a>

        <div class="bg-orange-50/70 border border-orange-200 rounded-2xl p-4 space-y-3 text-xs">
          <p class="font-bold text-orange-950">Option Transfert direct Orange Money :</p>
          <div class="flex items-center justify-between pb-2 border-b border-orange-100">
            <span class="text-stone-600">Numéro Boutique :</span>
            <div class="flex items-center gap-2">
              <span class="font-mono font-black text-orange-950">{{ boutiquePhone }}</span>
              <button
                @click="copyText(boutiquePhoneClean, 'phone')"
                class="px-2 py-0.5 text-[10px] font-bold bg-white text-orange-800 border border-orange-300 rounded"
              >
                {{ copiedKey === 'phone' ? '✓ Copié' : 'Copier' }}
              </button>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-stone-600">Montant :</span>
            <span class="font-serif font-black text-orange-950">{{ formatPrice(amount) }}</span>
          </div>
        </div>
      </div>

      <!-- ============================================== -->
      <!-- BOUTON WHATSAPP : ENVOYER LE REÇU EN 1 CLIC    -->
      <!-- ============================================== -->
      <div class="pt-2 border-t border-stone-100 space-y-3">
        <a
          :href="whatsappConfirmationUrl"
          target="_blank"
          class="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <span>💬</span>
          <span>Confirmer le paiement sur WhatsApp (+221 77 208 78 20)</span>
        </a>
      </div>

      <!-- Simulation pour environnement de test local -->
      <div class="pt-3 border-t border-stone-100 bg-stone-50 p-3 rounded-xl text-center">
        <p class="text-[10px] text-stone-400 font-bold uppercase mb-1.5">Test immédiat :</p>
        <button
          @click="simulatePayment"
          :disabled="isSimulating || isPaid"
          class="w-full py-2 px-3 text-xs font-bold rounded-lg transition-all"
          :class="isPaid ? 'bg-emerald-700 text-white' : 'bg-stone-900 hover:bg-gold-600 text-white shadow'"
        >
          <span v-if="isPaid">✓ Paiement Marqué comme Réglé !</span>
          <span v-else-if="isSimulating">Validation en cours...</span>
          <span v-else>Simuler la confirmation automatique (Test)</span>
        </button>
      </div>
    </div>

    <!-- Secondary Navigation -->
    <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
      <router-link
        to="/orders"
        class="px-6 py-3 bg-stone-900 hover:bg-gold-600 text-white text-xs font-bold rounded-xl transition-all shadow"
      >
        Consulter mes commandes
      </router-link>
      <router-link
        to="/catalog"
        class="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-all"
      >
        Continuer mes achats
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { PaymentService } from '../services/api';

const route = useRoute();

const orderId = ref((route.query.orderId as string) || '');
const orderNumber = ref((route.query.orderNumber as string) || 'JUM-2026');
const provider = ref((route.query.provider as string) || 'WAVE');
const amount = ref(parseFloat(route.query.amount as string) || 0);
const qrCodeUrl = ref((route.query.qrCodeUrl as string) || '');
const paymentUrl = ref((route.query.paymentUrl as string) || '');

const boutiqueName = ref('Jumelles Store');
const boutiquePhone = ref('+221 77 208 78 20');
const boutiquePhoneLocal = ref('772087820');
const boutiquePhoneClean = ref('221772087820');

const waveNotice = ref('');
const copiedKey = ref<string | null>(null);

const fallbackCopy = (text: string): boolean => {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.setAttribute('readonly', '');

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, 99999);

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.warn('Erreur fallback copy:', err);
    return false;
  }
};

const executeCopy = async (text: string): Promise<boolean> => {
  // 1. Essayer avec l'API standard navigator.clipboard si disponible et autorisée
  if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // Passer au fallback ci-dessous
    }
  }
  // 2. Méthode universelle de secours (fonctionne 100% sur mobile en Wi-Fi HTTP 192.168.x.x et Safari)
  return fallbackCopy(text);
};

const copyText = async (text: string, key: string) => {
  await executeCopy(text);
  copiedKey.value = key;
  setTimeout(() => {
    copiedKey.value = null;
  }, 2500);
};

const openWaveApp = async () => {
  // Copier le numéro local à 9 chiffres (772087820) pour qu'il soit directement valide à côté du drapeau +221 dans Wave
  await executeCopy(boutiquePhoneLocal.value);
  copiedKey.value = 'phone';
  waveNotice.value = `✓ Numéro 77 208 78 20 copié ! Collez-le directement dans Wave.`;

  // Ouvrir l'application Wave native sur le téléphone
  setTimeout(() => {
    window.location.href = 'wave://';
  }, 180);
};

const showQrCode = ref(false);

const whatsappConfirmationUrl = computed(() => {
  const msg = encodeURIComponent(
    `Bonjour Jumelles Store, je viens d'effectuer le paiement Wave de ${formatPrice(amount.value)} pour ma commande n° ${orderNumber.value}. Pouvez-vous confirmer la réception ?`
  );
  return `https://wa.me/${boutiquePhoneClean.value}?text=${msg}`;
});

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

