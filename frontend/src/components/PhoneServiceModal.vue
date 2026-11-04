<template>
  <div
    v-if="phoneStore.isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm transition-all"
    @click.self="phoneStore.closeModal"
  >
    <div
      class="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-stone-200 transform transition-all animate-in fade-in zoom-in-95 duration-200"
    >
      <!-- Modal Header -->
      <div class="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 p-6 text-white relative">
        <button
          @click="phoneStore.closeModal"
          class="absolute top-5 right-5 text-stone-400 hover:text-white w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm transition-colors"
        >
          ✕
        </button>

        <div class="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-widest mb-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Service Téléphonie & Commandes Express</span>
        </div>

        <h3 class="font-serif text-2xl font-extrabold text-white">
          Maison Jumelles Store Dakar
        </h3>
        <p class="text-xs text-stone-300 mt-1 font-light">
          Assistance clientèle, commandes directes et conseils pointures & maroquinerie 7j/7.
        </p>
      </div>

      <!-- Modal Body -->
      <div class="p-6 sm:p-8 space-y-6">
        <!-- Numéro de Téléphone Principal en Grand -->
        <div class="bg-stone-50 border-2 border-gold-400/50 rounded-2xl p-5 text-center space-y-2 relative shadow-inner">
          <span class="text-[11px] uppercase tracking-wider text-stone-500 font-bold block">
            Ligne Téléphonique Directe
          </span>
          <div class="font-serif text-3xl sm:text-4xl font-black text-stone-950 tracking-tight select-all">
            +221 77 208 78 20
          </div>
          <div class="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-700">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Conseillères disponibles actuellement (08h00 - 22h00 GMT)</span>
          </div>
        </div>

        <!-- Contexte Article si ouvert depuis une fiche -->
        <div v-if="phoneStore.productContext" class="bg-gold-50/70 border border-gold-200 rounded-xl p-3 text-xs flex items-center gap-2">
          <ShoppingBag class="w-4 h-4 text-gold-700 shrink-0" />
          <div>
            <span class="font-bold text-stone-900">Article sélectionné :</span>
            <span class="text-stone-700 ml-1">{{ phoneStore.productContext }}</span>
          </div>
        </div>

        <!-- 3 Boutons d'Action Directe avec vrais icones -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <!-- Appeler Directement -->
          <button
            @click="phoneStore.callNow"
            class="w-full py-3.5 px-4 bg-stone-950 hover:bg-stone-900 border border-[#d7b966] text-white font-bold text-xs rounded-full shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
          >
            <IconPhoneSolid className="w-4 h-4 text-[#e02f75] group-hover:scale-110 transition-transform" />
            <span>Appeler le 77 208 78 20</span>
          </button>

          <!-- WhatsApp Direct -->
          <button
            @click="phoneStore.openWhatsApp()"
            class="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-full shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
          >
            <IconWhatsApp className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            <span>Discuter sur WhatsApp</span>
          </button>
        </div>

        <!-- Bouton Copier le Numéro -->
        <button
          @click="phoneStore.copyPhoneNumber"
          class="w-full py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl border border-stone-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <component :is="phoneStore.copied ? Check : Copy" class="w-3.5 h-3.5" />
          <span v-if="phoneStore.copied" class="text-emerald-700 font-bold">Numéro copié dans le presse-papier !</span>
          <span v-else>Copier le numéro (+221 77 208 78 20)</span>
        </button>

        <!-- Divider -->
        <div class="relative flex py-1 items-center">
          <div class="flex-grow border-t border-stone-200"></div>
          <span class="flex-shrink mx-3 text-stone-400 text-xs uppercase tracking-wider font-semibold">Ou être rappelé(e)</span>
          <div class="flex-grow border-t border-stone-200"></div>
        </div>

        <!-- Formulaire de rappel rapide -->
        <div v-if="!phoneStore.callbackSuccess" class="space-y-3">
          <p class="text-xs text-stone-500 text-center">
            Laissez votre numéro, une conseillère de vente vous rappelle dans les 5 minutes.
          </p>

          <form @submit.prevent="handleCallbackSubmit" class="space-y-2.5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                v-model="form.name"
                type="text"
                placeholder="Votre prénom ou nom"
                class="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:ring-2 focus:ring-gold-500/40"
              />
              <input
                v-model="form.phone"
                type="tel"
                placeholder="Votre téléphone (ex: 77 123 45 67) *"
                class="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:ring-2 focus:ring-gold-500/40 font-bold"
                required
              />
            </div>

            <button
              type="submit"
              :disabled="phoneStore.isSubmittingCallback"
              class="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-stone-950 font-black text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
            >
              <span v-if="phoneStore.isSubmittingCallback">Envoi en cours...</span>
              <span v-else>🔔 Me faire rappeler par Jumelles Store</span>
            </button>
          </form>
        </div>

        <!-- Message de succès après demande de rappel -->
        <div v-else class="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-1 text-xs">
          <CheckCircle2 class="w-8 h-8 text-emerald-600 mx-auto" />
          <p class="font-bold text-emerald-900">Demande de rappel enregistrée !</p>
          <p class="text-emerald-700">Notre équipe prépare votre appel au <strong>{{ form.phone }}</strong>.</p>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="bg-stone-50 border-t border-stone-100 px-6 py-3 text-[11px] text-stone-500 flex items-center justify-between">
        <span>📍 Dakar, Sénégal • Livraison Express 24h</span>
        <span class="font-bold text-stone-700">Commande Directe WhatsApp</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { ShoppingBag, Copy, Check, CheckCircle2 } from 'lucide-vue-next';
import IconPhoneSolid from './icons/IconPhoneSolid.vue';
import IconWhatsApp from './icons/IconWhatsApp.vue';
import { usePhoneStore } from '../stores/phone';

const phoneStore = usePhoneStore();

const form = reactive({
  name: '',
  phone: '',
});

const handleCallbackSubmit = async () => {
  if (!form.phone) return;
  const success = await phoneStore.submitCallback(form.name, form.phone);
  if (success) {
    form.name = '';
  }
};
</script>

