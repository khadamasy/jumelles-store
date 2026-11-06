<template>
  <UiModal
    :open="phoneStore.isOpen"
    variant="sheet"
    label="Commander par téléphone ou WhatsApp"
    flush
    @close="phoneStore.closeModal"
  >
    <div class="ps">
      <!-- En-tête -->
      <div class="ps-hd">
        <span class="ps-live"><i aria-hidden="true"></i>Conseillères disponibles · 8 h – 22 h</span>
        <h2>Parlons de votre commande</h2>
        <p>Conseil pointure, disponibilité, commande directe : nous répondons 7j/7.</p>
      </div>

      <div class="ps-bd">
        <!-- Article concerné (ouvert depuis une fiche ou le panier) -->
        <div v-if="phoneStore.productContext" class="ps-ctx">
          <img v-if="phoneStore.productImage" :src="phoneStore.productImage" alt="" class="ps-ctx-img" />
          <span v-else class="ps-ctx-ic"><ShoppingBag aria-hidden="true" /></span>
          <div>
            <span class="ps-ctx-t">Article sélectionné · le lien photo sera joint sur WhatsApp</span>
            <p>{{ phoneStore.productContext }}</p>
          </div>
        </div>

        <!-- Numéro -->
        <div class="ps-num">
          <span>Ligne directe</span>
          <strong class="tnum">+221 77 208 78 20</strong>
          <button type="button" class="ps-copy" @click="phoneStore.copyPhoneNumber">
            <component :is="phoneStore.copied ? Check : Copy" aria-hidden="true" />
            <span v-if="phoneStore.copied">Numéro copié</span>
            <span v-else-if="phoneStore.copyFailed">Copie impossible : notez le numéro</span>
            <span v-else>Copier le numéro</span>
          </button>
        </div>

        <div class="ps-acts">
          <button type="button" class="btn wa lg" @click="phoneStore.openWhatsApp()">
            <IconWhatsApp className="w-5 h-5" />
            Écrire sur WhatsApp
          </button>
          <button type="button" class="btn dark lg" @click="phoneStore.callNow">
            <Phone aria-hidden="true" />
            Appeler
          </button>
        </div>

        <p class="divider">Ou être rappelé(e)</p>

        <!-- Demande de rappel -->
        <Transition name="fade" mode="out-in">
          <form v-if="!phoneStore.callbackSuccess" key="form" class="ps-form" @submit.prevent="handleCallbackSubmit">
            <p class="hint">Laissez votre numéro : une conseillère vous rappelle au plus vite, de 8 h à 22 h.</p>
            <div class="ps-fields">
              <div class="field">
                <label class="label" for="cb-name">Prénom <span class="opt-tag">(facultatif)</span></label>
                <input id="cb-name" v-model="form.name" type="text" class="input" autocomplete="given-name" placeholder="Awa" />
              </div>
              <div class="field">
                <label class="label" for="cb-phone">Téléphone</label>
                <input
                  id="cb-phone"
                  v-model="form.phone"
                  type="tel"
                  inputmode="tel"
                  autocomplete="tel"
                  class="input"
                  placeholder="77 123 45 67"
                  required
                />
              </div>
            </div>

            <div v-if="phoneStore.callbackError" role="alert" class="note danger">
              <AlertCircle aria-hidden="true" />
              <p>{{ phoneStore.callbackError }}</p>
            </div>

            <button
              type="submit"
              class="btn line block"
              :class="{ loading: phoneStore.isSubmittingCallback }"
              :disabled="phoneStore.isSubmittingCallback"
            >
              <BellRing aria-hidden="true" />
              Me faire rappeler
            </button>
          </form>

          <div v-else key="ok" class="note success ps-ok" role="status">
            <CheckCircle2 aria-hidden="true" />
            <div>
              <p><strong>Demande de rappel enregistrée.</strong></p>
              <p>Notre équipe vous appelle au <strong class="tnum">{{ form.phone }}</strong>.</p>
            </div>
          </div>
        </Transition>
      </div>

      <p class="ps-ft"><MapPin aria-hidden="true" />Dakar, Sénégal · Livraison 24 h</p>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { ShoppingBag, Copy, Check, CheckCircle2, Phone, BellRing, AlertCircle, MapPin } from 'lucide-vue-next';
import UiModal from './ui/UiModal.vue';
import IconWhatsApp from './icons/IconWhatsApp.vue';
import { usePhoneStore } from '../stores/phone';

const phoneStore = usePhoneStore();

const form = reactive({
  name: '',
  phone: '',
});

const handleCallbackSubmit = async () => {
  if (!form.phone || phoneStore.isSubmittingCallback) return;
  const success = await phoneStore.submitCallback(form.name, form.phone);
  if (success) {
    form.name = '';
  }
};
</script>

<style scoped>
.ps-hd {
  padding: var(--s-6) var(--s-6) var(--s-5);
  padding-right: 64px;
  background:
    radial-gradient(120% 140% at 100% 0%, rgb(var(--c-gold-500) / 0.22), transparent 55%),
    var(--ink);
  color: var(--on-ink);
}
.ps-live {
  display: inline-flex;
  align-items: center;
  gap: var(--s-2);
  font-size: var(--fs-xs);
  font-weight: 600;
  color: rgb(var(--c-success-200));
}
.ps-live i {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgb(var(--c-wa-500));
}
.ps-live i::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: inherit;
  animation: ping 1.8s var(--ease-out) infinite;
}
.ps-hd h2 {
  margin: var(--s-2) 0 var(--s-1);
  font-size: var(--fs-2xl);
  color: var(--on-ink);
  line-height: var(--lh-tight);
}
.ps-hd p {
  margin: 0;
  font-size: var(--fs-sm);
  color: var(--on-ink-muted);
}

.ps-bd {
  display: grid;
  gap: var(--s-5);
  padding: var(--s-5) var(--s-6) var(--s-6);
}

.ps-ctx {
  display: flex;
  gap: var(--s-3);
  align-items: flex-start;
  padding: var(--s-3);
  border-radius: var(--r-md);
  background: var(--accent-soft);
  border: 1px solid rgb(var(--c-gold-200));
}
.ps-ctx-img {
  width: 52px;
  height: 52px;
  flex: none;
  object-fit: cover;
  border-radius: var(--r-sm);
}
.ps-ctx-ic {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  flex: none;
  color: var(--accent-text);
}
.ps-ctx-ic svg {
  width: 20px;
  height: 20px;
}
.ps-ctx-t {
  display: block;
  font-size: var(--fs-2xs);
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--accent-text);
}
.ps-ctx p {
  margin: 2px 0 0;
  font-size: var(--fs-xs);
  color: var(--text);
  white-space: pre-line;
  word-break: break-word;
  max-height: 7.5em;
  overflow-y: auto;
}

.ps-num {
  display: grid;
  justify-items: center;
  gap: 2px;
  text-align: center;
}
.ps-num > span {
  font-size: var(--fs-2xs);
  font-weight: 700;
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--text-muted);
}
.ps-num strong {
  font-family: var(--font-display);
  font-size: clamp(28px, 8vw, 36px);
  font-weight: 500;
  letter-spacing: -0.01em;
  user-select: all;
}
.ps-copy {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 36px;
  padding: 0 var(--s-3);
  border: 0;
  border-radius: var(--r-full);
  background: transparent;
  color: var(--text-muted);
  font: 600 var(--fs-xs) var(--font-sans);
  cursor: pointer;
  transition: background-color var(--dur-2), color var(--dur-2);
}
.ps-copy:hover {
  background: var(--bg-sunken);
  color: var(--text);
}
.ps-copy svg {
  width: 14px;
  height: 14px;
}

.ps-acts {
  display: grid;
  gap: var(--s-2);
}

.ps-form {
  display: grid;
  gap: var(--s-3);
}
.ps-form .hint {
  text-align: center;
}
.ps-fields {
  display: grid;
  gap: var(--s-3);
}
.ps-ok strong {
  font-weight: 700;
}

.ps-ft {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 0;
  padding: var(--s-3) var(--s-6);
  border-top: 1px solid var(--border);
  background: var(--surface-2);
  font-size: var(--fs-xs);
  color: var(--text-muted);
}
.ps-ft svg {
  width: 14px;
  height: 14px;
}

@keyframes ping {
  75%,
  100% {
    transform: scale(2.4);
    opacity: 0;
  }
}

@media (min-width: 480px) {
  .ps-acts,
  .ps-fields {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
