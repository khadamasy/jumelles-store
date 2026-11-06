<template>
  <div class="co wrap">
    <!-- En-tête et étapes -->
    <header class="co-head">
      <ol class="co-steps" aria-label="Étapes de la commande">
        <li class="done"><Check aria-hidden="true" />Panier</li>
        <li class="cur" aria-current="step"><span>2</span>Coordonnées</li>
        <li><span>3</span>Confirmation WhatsApp</li>
      </ol>
      <h1>Finaliser ma commande</h1>
      <p class="lead">
        Aucun paiement en ligne : votre commande est enregistrée puis confirmée avec nous sur WhatsApp. Vous payez à la
        livraison.
      </p>
    </header>

    <!-- Panier vide -->
    <UiEmpty
      v-if="cartStore.items.length === 0"
      class="card"
      title="Votre panier est vide"
      text="Ajoutez des sacs ou des chaussures avant de passer commande."
    >
      <template #icon><ShoppingBag /></template>
      <router-link to="/catalog" class="btn dark">Découvrir la boutique</router-link>
    </UiEmpty>

    <!-- Formulaire + récapitulatif -->
    <div v-else class="co-grid">
      <div class="co-main">
        <!-- Coordonnées -->
        <section class="card co-card" aria-labelledby="co-ship">
          <div class="co-card-h">
            <span class="co-num">1</span>
            <div>
              <h2 id="co-ship">Où vous livrer ?</h2>
              <p>Ces informations servent uniquement à la livraison de votre colis.</p>
            </div>
          </div>

          <div class="co-fields">
            <div class="field">
              <label class="label" for="co-name">Nom complet</label>
              <input
                id="co-name"
                v-model="form.customerName"
                type="text"
                class="input"
                autocomplete="name"
                placeholder="Awa Diop"
                :aria-invalid="attempted && !form.customerName.trim()"
                required
              />
            </div>

            <div class="field">
              <label class="label" for="co-phone">Téléphone WhatsApp</label>
              <input
                id="co-phone"
                v-model="form.customerPhone"
                type="tel"
                inputmode="tel"
                class="input"
                autocomplete="tel"
                placeholder="77 123 45 67"
                aria-describedby="co-phone-hint"
                :aria-invalid="attempted && !form.customerPhone.trim()"
                required
              />
              <p id="co-phone-hint" class="hint">Le récapitulatif de votre commande vous sera envoyé sur ce numéro.</p>
            </div>

            <div class="co-row">
              <div class="field">
                <label class="label" for="co-city">Ville</label>
                <select id="co-city" v-model="form.shippingCity" class="select">
                  <option value="Dakar">Dakar (Plateau, Almadies, Mermoz, Maristes…)</option>
                  <option value="Banlieue Dakar">Banlieue (Pikine, Guédiawaye, Rufisque)</option>
                  <option value="Thiès">Thiès</option>
                  <option value="Saint-Louis">Saint-Louis</option>
                  <option value="Mbour / Saly">Mbour / Saly</option>
                  <option value="Autre région">Autre région du Sénégal</option>
                </select>
              </div>

              <div class="field">
                <label class="label" for="co-addr">Quartier et précisions</label>
                <input
                  id="co-addr"
                  v-model="form.shippingAddress"
                  type="text"
                  class="input"
                  autocomplete="street-address"
                  placeholder="Almadies, en face de la pharmacie"
                  :aria-invalid="attempted && !form.shippingAddress.trim()"
                  required
                />
              </div>
            </div>

            <Transition name="slide-down" mode="out-in">
              <p :key="delivery.label" class="co-deliv" :class="{ free: delivery.free }">
                <Truck aria-hidden="true" />
                <span>
                  <strong>{{ delivery.label }}</strong>
                  {{ delivery.free ? '· offerte' : '· frais confirmés sur WhatsApp' }}
                </span>
              </p>
            </Transition>
          </div>
        </section>

        <!-- Comment ça se passe -->
        <section class="co-how" aria-labelledby="co-how-t">
          <h2 id="co-how-t">Comment ça se passe</h2>
          <ol>
            <li>
              <span class="co-how-ic"><ClipboardCheck aria-hidden="true" /></span>
              <div>
                <b>Commande enregistrée</b>
                <span>Prix et stock vérifiés par la boutique au moment du clic.</span>
              </div>
            </li>
            <li>
              <span class="co-how-ic wa"><IconWhatsApp className="w-5 h-5" /></span>
              <div>
                <b>Message WhatsApp pré-rempli</b>
                <span>Articles, pointures, couleurs et adresse y sont déjà : il suffit d’envoyer.</span>
              </div>
            </li>
            <li>
              <span class="co-how-ic"><Banknote aria-hidden="true" /></span>
              <div>
                <b>Paiement à la livraison</b>
                <span>Vous réglez le livreur à la remise du colis, en espèces ou mobile money.</span>
              </div>
            </li>
          </ol>
        </section>
      </div>

      <!-- Récapitulatif -->
      <aside class="co-side">
        <section class="card co-sum" aria-labelledby="co-sum-t">
          <div class="co-sum-h">
            <h2 id="co-sum-t">Récapitulatif</h2>
            <span class="pill plain tnum">{{ cartStore.items.length }} article{{ cartStore.items.length > 1 ? 's' : '' }}</span>
          </div>

          <ul class="co-items">
            <li v-for="item in cartStore.items" :key="item.variantId">
              <span class="co-thumb">
                <img :src="item.imageUrl" :alt="item.productName" loading="lazy" decoding="async" />
                <b class="tnum">{{ item.quantity }}</b>
              </span>
              <div class="co-it">
                <p>{{ item.productName }}</p>
                <span>{{ item.color }}<template v-if="item.sizeOrShoeSize"> · {{ item.sizeOrShoeSize }}</template></span>
              </div>
              <div class="co-ip tnum">
                {{ currencyStore.toXofOnly(item.price * item.quantity) }}
                <small v-if="item.quantity > 1">{{ currencyStore.toXofOnly(item.price) }} / u</small>
              </div>
            </li>
          </ul>

          <dl class="co-tot">
            <div>
              <dt>Sous-total</dt>
              <dd class="tnum">{{ cartStore.formattedSubtotal }}</dd>
            </div>
            <div>
              <dt>{{ delivery.label }}</dt>
              <dd>
                <span v-if="delivery.free" class="pill success plain">Offerte</span>
                <span v-else class="co-tbc">Confirmés sur WhatsApp</span>
              </dd>
            </div>
            <div class="co-grand">
              <dt>Total</dt>
              <dd>
                <strong class="tnum">{{ currencyStore.toXofOnly(cartStore.subtotal) }}</strong>
                <small class="tnum">≈ {{ currencyStore.toEurOnly(cartStore.subtotal) }}</small>
              </dd>
            </div>
          </dl>

          <!-- Ajustements du panier (prix, stock, articles retirés depuis l'ajout) -->
          <Transition name="slide-down">
            <div v-if="cartNotices.length > 0" role="status" class="note warning">
              <AlertTriangle aria-hidden="true" />
              <div>
                <p v-for="(notice, idx) in cartNotices" :key="idx">{{ notice }}</p>
              </div>
            </div>
          </Transition>

          <Transition name="slide-down">
            <div v-if="errorMessage" role="alert" class="note danger">
              <AlertCircle aria-hidden="true" />
              <p>{{ errorMessage }}</p>
            </div>
          </Transition>

          <button
            type="button"
            class="btn wa lg block co-cta"
            :class="{ loading: isSubmitting }"
            :disabled="isSubmitting"
            :aria-busy="isSubmitting"
            @click="handleCheckoutWhatsApp"
          >
            <IconWhatsApp className="w-5 h-5" />
            Confirmer sur WhatsApp
          </button>
          <p class="co-legal">
            <Lock aria-hidden="true" />
            Commande enregistrée avec les montants vérifiés, puis envoyée sur WhatsApp.
          </p>

          <div class="co-help">
            <span>Une hésitation sur une pointure ?</span>
            <a href="tel:+221772087820" class="tnum"><Phone aria-hidden="true" />+221 77 208 78 20</a>
          </div>
        </section>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  ShoppingBag,
  Truck,
  Check,
  ClipboardCheck,
  Banknote,
  AlertTriangle,
  AlertCircle,
  Lock,
  Phone,
} from 'lucide-vue-next';
import UiEmpty from '../components/ui/UiEmpty.vue';
import IconWhatsApp from '../components/icons/IconWhatsApp.vue';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { useCurrencyStore } from '../stores/currency';
import { toAbsolutePhotoUrl, copyPhotoToClipboard, buildWhatsAppSendUrl } from '../stores/phone';
import { OrderService } from '../services/api';

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();
const currencyStore = useCurrencyStore();

const isSubmitting = ref(false);
const errorMessage = ref('');
/** Après un premier essai, les champs obligatoires vides sont signalés en rouge */
const attempted = ref(false);
const cartNotices = ref<string[]>([]);

/** Recalage du panier sur le catalogue actuel (prix, stock, articles retirés) */
const refreshCart = async () => {
  try {
    const notices = await cartStore.syncWithServer();
    if (notices.length > 0) cartNotices.value = notices;
  } catch {
    // Hors ligne : la validation serveur de la commande reste le garde-fou
  }
};

const form = reactive({
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  shippingCity: 'Dakar',
  shippingAddress: '',
  customerNote: '',
});

/** Conditions de livraison selon la ville (cf. FAQ : gratuite à Dakar, 24h banlieue, 24-48h régions) */
const delivery = computed(() => {
  if (form.shippingCity === 'Dakar') {
    return { free: true, label: 'Livraison 24h Dakar', message: '24h Dakar (Offerte)' };
  }
  if (form.shippingCity === 'Banlieue Dakar') {
    return {
      free: false,
      label: 'Livraison 24h Banlieue',
      message: '24h Banlieue de Dakar (frais à confirmer)',
    };
  }
  return {
    free: false,
    label: 'Expédition 24h-48h en région',
    message: `Expédition 24h-48h vers ${form.shippingCity} (frais à confirmer)`,
  };
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
  cartStore.toggleDrawer(false);
  void refreshCart();
});

const formatPrice = (price: number) => {
  return currencyStore.formatPrice(price);
};

const handleCheckoutWhatsApp = async () => {
  attempted.value = true;
  errorMessage.value = '';
  if (!form.customerName.trim() || !form.customerPhone.trim() || !form.shippingAddress.trim()) {
    errorMessage.value = 'Veuillez renseigner votre nom complet, votre numéro de téléphone et votre adresse de livraison.';
    return;
  }
  // Même règle que le serveur : vérifiée AVANT d'ouvrir l'onglet WhatsApp (sinon il s'ouvre puis se referme)
  const phoneDigits = form.customerPhone.replace(/\D/g, '');
  if (!/^[\d\s+\-().]+$/.test(form.customerPhone.trim()) || phoneDigits.length < 8 || phoneDigits.length > 15) {
    errorMessage.value = 'Numéro de téléphone invalide (ex : 77 123 45 67).';
    return;
  }
  if (isSubmitting.value || cartStore.items.length === 0) return;

  isSubmitting.value = true;
  cartNotices.value = [];

  // L'onglet WhatsApp est ouvert IMMÉDIATEMENT, pendant le clic : ouvert après les appels réseau,
  // il serait bloqué par Safari iOS et de nombreux navigateurs Android (fenêtre « non sollicitée »).
  // Il est redirigé vers WhatsApp une fois la commande validée, ou refermé en cas d'erreur.
  let whatsappTab: Window | null = null;
  try {
    whatsappTab = window.open('', '_blank');
    if (whatsappTab) {
      whatsappTab.opener = null;
      whatsappTab.document.title = 'Ouverture de WhatsApp…';
      whatsappTab.document.body.innerHTML =
        '<p style="font-family:sans-serif;text-align:center;margin-top:40vh">Enregistrement de votre commande, ouverture de WhatsApp…</p>';
    }
  } catch {
    whatsappTab = null;
  }

  try {
    const cleanPhone = form.customerPhone.replace(/\D/g, '');
    const clientEmail = form.customerEmail?.trim() || `${cleanPhone || 'client'}@client.jumelles.sn`;

    // 1. Enregistrement obligatoire côté serveur (recalcul des prix et vérification du stock)
    const orderPayload = {
      customerName: form.customerName.trim(),
      customerEmail: clientEmail,
      customerPhone: form.customerPhone.trim(),
      shippingCity: form.shippingCity,
      shippingAddress: form.shippingAddress.trim(),
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

    // 2. Formatage du message WhatsApp exclusivement à partir des montants et articles validés par le serveur + lien photo HTTPS public
    const cartPhotosByVariant = new Map(
      cartStore.items.map((ci) => [ci.variantId, toAbsolutePhotoUrl(ci.imageUrl)])
    );
    const cartPhotosByName = new Map(
      cartStore.items.map((ci) => [ci.productName, toAbsolutePhotoUrl(ci.imageUrl)])
    );
    const firstLocalImage = cartStore.items[0]?.imageUrl || '';
    const firstPublicPhotoUrl = firstLocalImage ? toAbsolutePhotoUrl(firstLocalImage) : '';

    // Copier aussi l'image dans le presse-papiers (Ctrl+V dans WhatsApp) — sans bloquer la commande
    if (firstLocalImage) {
      void copyPhotoToClipboard(firstLocalImage);
    }

    const itemsListText = serverItems
      .map((item: any, index: number) => {
        const lineTotal = currencyStore.toXofOnly(item.totalPrice);
        const photoUrl =
          cartPhotosByVariant.get(item.productVariantId) ||
          cartPhotosByName.get(item.productName) ||
          '';
        return `  ${index + 1}. *${item.productName}*\n     ↳ Détails : ${item.variantDetails}\n     ↳ Quantité : x${item.quantity}\n     ↳ Prix vérifié : ${lineTotal}${photoUrl ? `\n     ↳ Photo : ${photoUrl}` : ''}`;
      })
      .join('\n\n');

    const totalFormatted = currencyStore.toXofOnly(verifiedTotal);

    const whatsappMessage =
`${firstPublicPhotoUrl ? firstPublicPhotoUrl + '\n\n' : ''}Bonjour Maison Jumelles,

Je souhaite confirmer ma commande enregistrée sur votre site internet :

*RÉFÉRENCE COMMANDE :* ${orderNumber}

*COORDONNÉES CLIENTE :*
• Nom : ${form.customerName.trim()}
• Téléphone : ${form.customerPhone.trim()}
• Ville : ${form.shippingCity}
• Adresse de livraison : ${form.shippingAddress.trim()}

*ARTICLES COMMANDÉS (PRIX SERVEUR) :*
${itemsListText}

*TOTAL COMMANDE :* *${totalFormatted}*
*LIVRAISON :* ${delivery.value.message}
*RÈGLEMENT :* À la livraison

Merci de me confirmer la prise en compte de ma commande et le créneau de livraison !`;

    const boutiqueWhatsAppPhone = '221772087820';
    const whatsappUrl = buildWhatsAppSendUrl(whatsappMessage, boutiqueWhatsAppPhone);

    const cartLocalImagesByVariant = new Map(
      cartStore.items.map((ci) => [ci.variantId, ci.imageUrl])
    );
    const cartLocalImagesByName = new Map(
      cartStore.items.map((ci) => [ci.productName, ci.imageUrl])
    );

    // 3. Sauvegarder uniquement le récapitulatif non sensible pour la page de confirmation (lu une seule fois puis supprimé)
    const orderDataForSuccess = {
      orderNumber,
      totalAmount: verifiedTotal,
      items: serverItems.map((si: any) => ({
        productName: si.productName,
        color: si.variantDetails,
        sizeOrShoeSize: '',
        quantity: si.quantity,
        price: si.unitPrice,
        imageUrl:
          cartLocalImagesByVariant.get(si.productVariantId) ||
          cartLocalImagesByName.get(si.productName) ||
          firstLocalImage,
      })),
      whatsappUrl,
    };
    sessionStorage.setItem('jumelles_last_order', JSON.stringify(orderDataForSuccess));

    // Vider le panier
    cartStore.clearCart();

    // 4. Basculer l'onglet pré-ouvert sur WhatsApp et afficher la page de confirmation
    //    (si le navigateur a tout de même bloqué l'onglet, la page de confirmation propose le bouton WhatsApp)
    if (whatsappTab && !whatsappTab.closed) {
      whatsappTab.location.href = whatsappUrl;
    }
    await router.push({
      path: '/order-success',
      query: { orderNumber },
    });
  } catch (error: any) {
    if (whatsappTab && !whatsappTab.closed) whatsappTab.close();
    errorMessage.value =
      error?.response?.data?.message ||
      error?.message ||
      'Impossible d\'enregistrer la commande. Vérifiez votre connexion ou contactez-nous au +221 77 208 78 20.';
    // Commande refusée (stock épuisé, article retiré, prix modifié…) : on recale le panier
    // pour que la cliente voie immédiatement ce qui a changé et puisse renvoyer sa commande.
    if (error?.response?.status === 400) await refreshCart();
  } finally {
    isSubmitting.value = false;
  }
};
</script>
<style scoped>
.co {
  padding-top: var(--s-6);
  padding-bottom: var(--s-12);
}

/* ----- En-tête ----- */
.co-steps {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-2) var(--s-4);
  list-style: none;
  margin: 0 0 var(--s-5);
  padding: 0;
  font-size: var(--fs-xs);
  font-weight: 600;
  color: var(--text-faint);
}
.co-steps li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.co-steps li span,
.co-steps li svg {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid currentColor;
  font-size: 11px;
}
.co-steps li svg {
  padding: 3px;
  border: 0;
  background: var(--success);
  color: #fff;
}
.co-steps .done {
  color: var(--success);
}
.co-steps .cur {
  color: var(--text);
}
.co-steps .cur span {
  background: var(--ink);
  border-color: var(--ink);
  color: var(--on-ink);
}
.co-head h1 {
  margin: 0;
  font-size: var(--fs-3xl);
  line-height: var(--lh-tight);
  font-weight: 400;
}
.co-head .lead {
  margin: var(--s-2) 0 0;
  max-width: 40em;
  color: var(--text-muted);
  font-size: var(--fs-sm);
}

/* ----- Grille ----- */
.co-grid {
  display: grid;
  gap: var(--s-5);
  margin-top: var(--s-6);
}
.co-main {
  display: grid;
  gap: var(--s-5);
  align-content: start;
}

.co-card {
  padding: var(--s-5);
}
.co-card-h {
  display: flex;
  gap: var(--s-3);
  align-items: flex-start;
  margin-bottom: var(--s-5);
}
.co-num {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  flex: none;
  border-radius: 50%;
  background: var(--ink);
  color: var(--on-ink);
  font-size: var(--fs-xs);
  font-weight: 700;
}
.co-card-h h2 {
  margin: 0;
  font-size: var(--fs-lg);
}
.co-card-h p {
  margin: 2px 0 0;
  font-size: var(--fs-sm);
  color: var(--text-muted);
}
.co-fields {
  display: grid;
  gap: var(--s-4);
}
.co-row {
  display: grid;
  gap: var(--s-4);
}
.co-deliv {
  display: flex;
  align-items: center;
  gap: var(--s-2);
  margin: 0;
  padding: var(--s-3) var(--s-4);
  border-radius: var(--r-md);
  background: var(--bg-sunken);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}
.co-deliv strong {
  color: var(--text);
}
.co-deliv svg {
  width: 18px;
  height: 18px;
  flex: none;
}
.co-deliv.free {
  background: var(--success-soft);
  color: rgb(var(--c-success-800));
}
.co-deliv.free strong {
  color: inherit;
}

/* ----- Comment ça se passe ----- */
.co-how {
  padding: var(--s-5);
  border-radius: var(--r-lg);
  border: 1px dashed var(--border-strong);
}
.co-how h2 {
  margin: 0 0 var(--s-4);
  font: 700 var(--fs-2xs) / 1 var(--font-sans);
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--text-muted);
}
.co-how ol {
  display: grid;
  gap: var(--s-4);
  list-style: none;
  margin: 0;
  padding: 0;
}
.co-how li {
  display: flex;
  gap: var(--s-3);
  align-items: flex-start;
}
.co-how b {
  display: block;
  font-size: var(--fs-sm);
}
.co-how li span:not(.co-how-ic) {
  font-size: var(--fs-sm);
  color: var(--text-muted);
}
.co-how-ic {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  flex: none;
  border-radius: var(--r-md);
  background: var(--accent-soft);
  color: var(--accent-text);
}
.co-how-ic svg {
  width: 20px;
  height: 20px;
}
.co-how-ic.wa {
  background: var(--wa-soft);
  color: var(--wa);
}

/* ----- Récapitulatif ----- */
.co-sum {
  display: grid;
  gap: var(--s-4);
  padding: var(--s-5);
}
.co-sum-h {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.co-sum-h h2 {
  margin: 0;
  font-size: var(--fs-lg);
}
.co-items {
  display: grid;
  gap: var(--s-3);
  max-height: 320px;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: 6px 0 0;
}
.co-items li {
  display: flex;
  align-items: center;
  gap: var(--s-3);
}
.co-thumb {
  position: relative;
  flex: none;
}
.co-thumb img {
  width: 56px;
  height: 70px;
  object-fit: cover;
  border-radius: var(--r-sm);
  background: var(--bg-sunken);
}
.co-thumb b {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 10px;
  background: var(--ink);
  color: var(--on-ink);
  font-size: 11px;
  line-height: 20px;
  text-align: center;
  box-shadow: 0 0 0 2px var(--surface);
}
.co-it {
  flex: 1;
  min-width: 0;
}
.co-it p {
  margin: 0;
  font-size: var(--fs-sm);
  font-weight: 600;
  line-height: var(--lh-snug);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.co-it span {
  font-size: var(--fs-xs);
  color: var(--text-muted);
}
.co-ip {
  flex: none;
  text-align: right;
  font-size: var(--fs-sm);
  font-weight: 700;
}
.co-ip small {
  display: block;
  font-size: var(--fs-2xs);
  font-weight: 500;
  color: var(--text-faint);
}

.co-tot {
  display: grid;
  gap: var(--s-2);
  margin: 0;
  padding-top: var(--s-4);
  border-top: 1px solid var(--border);
  font-size: var(--fs-sm);
}
.co-tot div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-3);
}
.co-tot dt {
  color: var(--text-muted);
}
.co-tot dd {
  margin: 0;
  font-weight: 600;
  text-align: right;
}
.co-tbc {
  font-size: var(--fs-xs);
  color: var(--text-muted);
}
.co-grand {
  margin-top: var(--s-2);
  padding-top: var(--s-3);
  border-top: 1px solid var(--border);
  align-items: baseline !important;
}
.co-grand dt {
  color: var(--text);
  font-weight: 700;
}
.co-grand strong {
  display: block;
  font-family: var(--font-display);
  font-size: var(--fs-2xl);
  font-weight: 500;
}
.co-grand small {
  font-size: var(--fs-xs);
  font-weight: 500;
  color: var(--text-muted);
}

.co-cta {
  margin-top: var(--s-1);
}
.co-legal {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 6px;
  margin: calc(-1 * var(--s-1)) 0 0;
  font-size: var(--fs-xs);
  color: var(--text-muted);
  text-align: center;
}
.co-legal svg {
  width: 13px;
  height: 13px;
  flex: none;
  margin-top: 2px;
}
.co-help {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-2);
  padding-top: var(--s-4);
  border-top: 1px solid var(--border);
  font-size: var(--fs-xs);
  color: var(--text-muted);
}
.co-help a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 36px;
  font-weight: 700;
  font-size: var(--fs-sm);
  color: var(--text);
}
.co-help a:hover {
  color: var(--accent-text);
}
.co-help svg {
  width: 15px;
  height: 15px;
}

@media (min-width: 720px) {
  .co {
    padding-top: var(--s-10);
  }
  .co-row {
    grid-template-columns: 1fr 1.3fr;
  }
  .co-card,
  .co-sum,
  .co-how {
    padding: var(--s-8);
  }
}

@media (min-width: 1024px) {
  .co-grid {
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    gap: var(--s-8);
    align-items: start;
  }
  .co-side {
    position: sticky;
    top: calc(var(--header-h) + var(--s-5));
  }
}
</style>
