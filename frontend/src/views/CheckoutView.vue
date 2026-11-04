<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    <!-- En-tête -->
    <div class="mb-8 space-y-2">
      <span class="text-xs uppercase tracking-widest text-gold-700 font-extrabold bg-gold-50 px-3.5 py-1 rounded-full border border-gold-200 inline-flex items-center gap-1.5">
        <Sparkles class="w-3.5 h-3.5 text-gold-600" />
        <span>Commande Express Sans Paiement en Ligne</span>
      </span>
      <h1 class="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900">
        Finalisation de Votre Commande
      </h1>
      <p class="text-xs sm:text-sm text-stone-500 max-w-2xl">
        Renseignez vos coordonnées de livraison ci-dessous : votre commande sera immédiatement transmise sur WhatsApp pour validation et expédition rapide sous 24h.
      </p>
    </div>

    <!-- Panier vide -->
    <div v-if="cartStore.items.length === 0" class="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4 shadow-sm">
      <div class="w-16 h-16 rounded-3xl bg-stone-100 flex items-center justify-center mx-auto text-stone-500">
        <ShoppingBag class="w-8 h-8 text-gold-600" />
      </div>
      <h3 class="font-serif text-xl font-bold text-stone-900">Votre panier est vide.</h3>
      <p class="text-sm text-stone-500">Ajoutez des sacs ou des souliers avant de procéder à la commande.</p>
      <router-link to="/catalog" class="inline-block px-6 py-3 bg-stone-900 text-white text-xs font-semibold rounded-xl hover:bg-gold-600 transition-colors shadow">
        Découvrir la boutique
      </router-link>
    </div>

    <!-- Formulaire de commande + Récapitulatif -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
      <!-- Colonne Gauche : Coordonnées de Livraison & Confirmation WhatsApp -->
      <div class="lg:col-span-7 space-y-6">
        <!-- 1. Coordonnées de Livraison -->
        <div class="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
          <div class="flex items-center gap-3 border-b border-stone-100 pb-4">
            <span class="w-8 h-8 rounded-full bg-stone-900 text-gold-400 font-bold flex items-center justify-center text-sm">1</span>
            <div>
              <h2 class="font-serif text-lg font-bold text-stone-900">Coordonnées de Livraison</h2>
              <p class="text-xs text-stone-500">Indiquez vos informations exactes pour la réception du colis</p>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">Votre Nom complet *</label>
              <input
                v-model="form.customerName"
                type="text"
                placeholder="Ex: Awa Diop"
                class="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 outline-none"
                required
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">Votre Numéro de Téléphone (WhatsApp) *</label>
              <input
                v-model="form.customerPhone"
                type="tel"
                placeholder="Ex: 77 123 45 67 ou 78 234 56 78"
                class="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 outline-none"
                required
              />
              <p class="text-[11px] text-stone-400 mt-1">
                Le récapitulatif complet de votre commande sera envoyé sur ce numéro WhatsApp.
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-stone-700 mb-1">Ville de Livraison *</label>
                <select
                  v-model="form.shippingCity"
                  class="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 outline-none bg-white font-medium"
                >
                  <option value="Dakar">Dakar (Plateau, Almadies, Mermoz, Maristes...)</option>
                  <option value="Banlieue Dakar">Banlieue (Pikine, Guédiawaye, Rufisque)</option>
                  <option value="Thiès">Thiès</option>
                  <option value="Saint-Louis">Saint-Louis</option>
                  <option value="Mbour / Saly">Mbour / Saly</option>
                  <option value="Autre région">Autre Région du Sénégal</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-stone-700 mb-1">Quartier & Précisions *</label>
                <input
                  v-model="form.shippingAddress"
                  type="text"
                  placeholder="Ex: Almadies, en face de la pharmacie"
                  class="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">Instructions ou remarques pour le livreur (Optionnel)</label>
              <textarea
                v-model="form.customerNote"
                rows="2"
                placeholder="Ex: Appelez-moi avant de partir, livraison souhaitée l'après-midi..."
                class="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 outline-none"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 2. Mode de Validation Directe via WhatsApp (Sans Paiement en Ligne) -->
        <div class="bg-gradient-to-br from-emerald-950 via-stone-950 to-stone-900 text-white p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-xl space-y-4 relative overflow-hidden">
          <div class="flex items-center gap-3 border-b border-white/10 pb-4">
            <div class="w-10 h-10 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center shrink-0">
              <IconWhatsApp className="w-6 h-6 text-[#25D366]" />
            </div>
            <div>
              <span class="text-[10px] uppercase font-bold tracking-widest text-[#25D366] block">Étape 2 • Confirmation Immédiate</span>
              <h2 class="font-serif text-lg font-bold text-white">Validation Directe sur WhatsApp</h2>
            </div>
          </div>

          <div class="space-y-3 text-xs text-stone-300 leading-relaxed font-light">
            <p>
              <strong class="text-white font-bold">Aucun paiement par carte ni compte en ligne requis :</strong> en cliquant sur le bouton ci-dessous, votre commande est enregistrée et vous basculez automatiquement sur WhatsApp avec la gérance de la boutique (<span class="text-[#25D366] font-bold">+221 77 208 78 20</span>).
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div class="bg-white/5 border border-white/10 rounded-2xl p-3 space-y-1">
                <span class="font-bold text-white text-xs flex items-center gap-1.5">
                  <CheckCircle2 class="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Message Pré-rempli</span>
                </span>
                <p class="text-[11px] text-stone-400">Vos articles, pointures, couleurs et adresse sont automatiquement inclus dans le message.</p>
              </div>
              <div class="bg-white/5 border border-white/10 rounded-2xl p-3 space-y-1">
                <span class="font-bold text-white text-xs flex items-center gap-1.5">
                  <Truck class="w-3.5 h-3.5 text-gold-400" />
                  <span>Règlement à la Livraison</span>
                </span>
                <p class="text-[11px] text-stone-400">Payez tranquillement à la réception du colis (en espèces ou par transfert direct Wave / OM).</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Colonne Droite : Récapitulatif de Commande & CTA WhatsApp -->
      <div class="lg:col-span-5">
        <div class="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs relative lg:sticky lg:top-28 space-y-6">
          <div class="flex items-center justify-between border-b border-stone-100 pb-4">
            <h3 class="font-serif text-lg font-bold text-stone-900">
              Articles Commandés
            </h3>
            <span class="text-xs font-bold bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full">
              {{ cartStore.items.length }} article(s)
            </span>
          </div>

          <!-- Liste des articles -->
          <div class="space-y-3.5 max-h-72 overflow-y-auto pr-1 custom-scrollbar divide-y divide-stone-100">
            <div
              v-for="item in cartStore.items"
              :key="item.variantId"
              class="flex items-center gap-3 text-xs pt-3 first:pt-0"
            >
              <img
                :src="item.imageUrl"
                :alt="item.productName"
                class="w-14 h-14 object-cover rounded-xl bg-stone-100 border border-stone-200 shrink-0"
              />
              <div class="flex-1 min-w-0 space-y-0.5">
                <p class="font-serif font-bold text-stone-900 truncate text-xs sm:text-sm">{{ item.productName }}</p>
                <p class="text-[11px] text-stone-500">
                  <span class="font-medium text-stone-800">{{ item.color }}</span>
                  <span v-if="item.sizeOrShoeSize"> • Pointure / Taille : <strong>{{ item.sizeOrShoeSize }}</strong></span>
                </p>
                <p class="text-[11px] text-stone-400">Qté : x{{ item.quantity }}</p>
              </div>
              <div class="text-right shrink-0">
                <span class="font-serif font-black text-stone-950 text-sm block">
                  {{ formatPrice(item.price * item.quantity) }}
                </span>
                <span v-if="item.quantity > 1" class="text-[10px] text-stone-400 block">
                  ({{ formatPrice(item.price) }}/u)
                </span>
              </div>
            </div>
          </div>

          <!-- Totaux -->
          <div class="border-t border-stone-100 pt-4 space-y-2 text-xs sm:text-sm">
            <div class="flex justify-between text-stone-600">
              <span>Sous-total articles :</span>
              <span class="font-bold text-stone-900">{{ cartStore.formattedSubtotal }}</span>
            </div>
            <div class="flex justify-between text-stone-600">
              <span>Livraison 24h Dakar :</span>
              <span class="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Offerte (Promotion)
              </span>
            </div>
            <div class="border-t border-stone-200 pt-3 flex justify-between items-baseline font-bold text-stone-950 text-base">
              <span>Total Commande :</span>
              <div class="text-right">
                <span class="font-serif text-2xl text-stone-950 block font-black">{{ currencyStore.toXofOnly(cartStore.subtotal) }}</span>
                <span class="text-[11px] text-stone-400 font-medium block">≈ {{ currencyStore.toEurOnly(cartStore.subtotal) }}</span>
              </div>
            </div>
          </div>

          <!-- Message d'erreur intégré à l'interface -->
          <div
            v-if="errorMessage"
            role="alert"
            class="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium"
          >
            {{ errorMessage }}
          </div>

          <!-- GROS BOUTON WHATSAPP -->
          <div class="space-y-3 pt-2">
            <button
              @click="handleCheckoutWhatsApp"
              :disabled="isSubmitting"
              type="button"
              class="w-full py-4 px-4 bg-[#25D366] hover:bg-[#20ba59] active:scale-98 text-white font-black text-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              <IconWhatsApp className="w-5 h-5 text-white shrink-0 group-hover:scale-110 transition-transform" />
              <span v-if="isSubmitting">Enregistrement de la commande...</span>
              <span v-else>
                Confirmer la Commande via WhatsApp
              </span>
            </button>

            <p class="text-[11px] text-stone-400 text-center font-light">
              Cliquez pour enregistrer votre commande et l'envoyer sur WhatsApp avec les montants vérifiés.
            </p>
          </div>

          <!-- Assistance directe -->
          <div class="pt-3 border-t border-stone-100 text-center">
            <p class="text-[11px] text-stone-500">Une question ou hésitation sur une pointure ?</p>
            <p class="text-xs font-bold text-stone-900 pt-0.5">
              Service Client Boutique : <span class="text-gold-700 underline font-mono">+221 77 208 78 20</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ShoppingBag, Sparkles, CheckCircle2, Truck } from 'lucide-vue-next';
import IconWhatsApp from '../components/icons/IconWhatsApp.vue';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { useCurrencyStore } from '../stores/currency';
import { OrderService } from '../services/api';

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();
const currencyStore = useCurrencyStore();

const isSubmitting = ref(false);
const errorMessage = ref('');

const form = reactive({
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  shippingCity: 'Dakar',
  shippingAddress: '',
  customerNote: '',
});

const fillUserData = () => {
  if (authStore.user) {
    if (authStore.user.name && !form.customerName) form.customerName = authStore.user.name;
    if (authStore.user.email && !form.customerEmail) form.customerEmail = authStore.user.email;
  }
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

const handleCheckoutWhatsApp = async () => {
  errorMessage.value = '';
  if (!form.customerName.trim() || !form.customerPhone.trim() || !form.shippingAddress.trim()) {
    errorMessage.value = 'Veuillez renseigner votre nom complet, votre numéro de téléphone et votre adresse de livraison.';
    return;
  }

  isSubmitting.value = true;
  try {
    const cleanPhone = form.customerPhone.replace(/\D/g, '');
    const clientEmail = form.customerEmail?.trim() || `${cleanPhone || 'client'}@client.jumelles.sn`;

    // 1. Enregistrement obligatoire côté serveur (recalcul des prix et vérification du stock)
    const orderPayload = {
      customerName: form.customerName.trim(),
      customerEmail: clientEmail,
      customerPhone: form.customerPhone.trim(),
      shippingCity: form.shippingCity,
      shippingAddress: form.customerNote.trim()
        ? `${form.shippingAddress.trim()} (Note: ${form.customerNote.trim()})`
        : form.shippingAddress.trim(),
      items: cartStore.items.map((item) => ({
        productVariantId: item.variantId,
        quantity: item.quantity,
      })),
    };

    const orderRes = await OrderService.create(orderPayload);
    const serverOrder = orderRes.data?.data;
    if (!serverOrder || !serverOrder.orderNumber) {
      throw new Error('La commande n\'a pas pu être validée par le serveur.');
    }

    const orderNumber: string = serverOrder.orderNumber;
    const serverItems: Array<{
      productName: string;
      variantDetails: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }> = Array.isArray(serverOrder.items) ? serverOrder.items : [];
    const verifiedTotal: number = Number(serverOrder.totalAmount) || 0;

    // 2. Formatage du message WhatsApp exclusivement à partir des montants et articles validés par le serveur
    const itemsListText = serverItems
      .map((item, index) => {
        const lineTotal = currencyStore.toXofOnly(item.totalPrice);
        return `  ${index + 1}. *${item.productName}*\n     ↳ Détails : ${item.variantDetails}\n     ↳ Quantité : x${item.quantity}\n     ↳ Prix vérifié : ${lineTotal}`;
      })
      .join('\n\n');

    const totalFormatted = currencyStore.toXofOnly(verifiedTotal);

    const whatsappMessage =
`Bonjour Maison Jumelles ✨,

Je souhaite confirmer ma commande enregistrée sur votre site internet :

📋 *RÉFÉRENCE COMMANDE :* ${orderNumber}

👤 *COORDONNÉES CLIENTE :*
• Nom : ${form.customerName.trim()}
• Téléphone : ${form.customerPhone.trim()}
• Ville : ${form.shippingCity}
• Adresse de livraison : ${form.shippingAddress.trim()}${form.customerNote.trim() ? '\n• Note spéciale : ' + form.customerNote.trim() : ''}

🛍️ *ARTICLES COMMANDÉS (PRIX SERVEUR) :*
${itemsListText}

💰 *TOTAL COMMANDE :* *${totalFormatted}*
🚚 *LIVRAISON :* 24h Dakar (Offerte)
💵 *RÈGLEMENT :* À la livraison (Espèces ou Transfert Wave/OM)

Merci de me confirmer la prise en compte de ma commande et le créneau de livraison !`;

    const boutiqueWhatsAppPhone = '221772087820';
    const whatsappUrl = `https://wa.me/${boutiqueWhatsAppPhone}?text=${encodeURIComponent(whatsappMessage)}`;

    // 3. Sauvegarder uniquement le récapitulatif non sensible pour la page de confirmation (lu une seule fois puis supprimé)
    const orderDataForSuccess = {
      orderNumber,
      totalAmount: verifiedTotal,
      items: serverItems.map((si) => ({
        productName: si.productName,
        color: si.variantDetails,
        sizeOrShoeSize: '',
        quantity: si.quantity,
        price: si.unitPrice,
      })),
      whatsappUrl,
    };
    sessionStorage.setItem('jumelles_last_order', JSON.stringify(orderDataForSuccess));

    // Vider le panier
    cartStore.clearCart();

    // 4. Ouvrir WhatsApp et afficher la page de confirmation
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    await router.push({
      path: '/order-success',
      query: { orderNumber },
    });
  } catch (error: any) {
    errorMessage.value =
      error?.response?.data?.message ||
      error?.message ||
      'Impossible d\'enregistrer la commande. Vérifiez votre connexion ou contactez-nous au +221 77 208 78 20.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>
