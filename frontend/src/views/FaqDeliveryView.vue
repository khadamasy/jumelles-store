<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
    <!-- Breadcrumb -->
    <nav class="text-xs text-stone-400 flex items-center gap-2">
      <router-link to="/" class="hover:text-stone-700 transition-colors">Accueil</router-link>
      <span>/</span>
      <span class="text-stone-900 font-bold">FAQ & Guide Livraison</span>
    </nav>

    <!-- Header -->
    <div class="text-center space-y-4">
      <span class="text-xs font-bold text-gold-700 uppercase tracking-widest bg-gold-50 px-4 py-1.5 rounded-full border border-gold-200 shadow-2xs">
        Service Client & Logistique Dakar
      </span>
      <h1 class="font-serif text-3xl sm:text-5xl font-normal text-stone-950">
        Foire Aux Questions & Livraison
      </h1>
      <p class="text-stone-600 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
        Découvrez toutes les réponses concernant les délais de livraison à Dakar, les échanges de pointures et les commandes directes sur WhatsApp.
      </p>
    </div>

    <!-- 4 Cartes Récapitulatives des Garanties -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-sm text-center space-y-2">
        <span class="text-3xl block">⚡</span>
        <h4 class="font-bold text-stone-900 text-sm">Livraison 24h</h4>
        <p class="text-xs text-stone-500">Dakar, Almadies, Mermoz, Plateau & Banlieue</p>
      </div>

      <div class="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-sm text-center space-y-2">
        <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
          <Sparkles class="w-5 h-5 text-amber-600" />
        </div>
        <h4 class="font-bold text-stone-900 text-sm">Échange 48h</h4>
        <p class="text-xs text-stone-500">Pointures échangeables facilement de 37 à 42</p>
      </div>

      <div class="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-sm text-center space-y-2">
        <div class="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto p-1">
          <IconWhatsApp className="w-5 h-5 text-[#25D366]" />
        </div>
        <h4 class="font-bold text-stone-900 text-sm">Commande WhatsApp</h4>
        <p class="text-xs text-stone-500">Confirmation directe au +221 77 208 78 20</p>
      </div>

      <div class="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-sm text-center space-y-2">
        <div class="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto">
          <IconPhoneSolid className="w-5 h-5 text-[#e02f75]" />
        </div>
        <h4 class="font-bold text-stone-900 text-sm">Assistance 7j/7</h4>
        <p class="text-xs text-stone-500">Conseillères disponibles de 08h à 22h GMT</p>
      </div>
    </div>

    <!-- FAQ Accordion -->
    <div class="space-y-4">
      <div
        v-for="(item, index) in faqList"
        :key="index"
        class="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden transition-all"
      >
        <button
          @click="toggleFaq(index)"
          class="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-serif font-bold text-base sm:text-lg text-stone-900 hover:text-gold-700 transition-colors cursor-pointer"
        >
          <span class="flex items-center gap-3">
            <span class="text-xl shrink-0">{{ item.icon }}</span>
            <span>{{ item.question }}</span>
          </span>
          <span class="text-xl text-stone-400 font-mono transition-transform duration-200 shrink-0" :class="openIndex === index ? 'rotate-45' : ''">
            +
          </span>
        </button>

        <div
          v-if="openIndex === index"
          class="px-5 sm:px-6 pb-6 pt-1 text-sm text-stone-600 leading-relaxed border-t border-stone-100 font-light"
        >
          <p class="whitespace-pre-line">{{ item.answer }}</p>
        </div>
      </div>
    </div>

    <!-- Contact & Assistance WhatsApp -->
    <div class="bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 rounded-3xl p-8 sm:p-10 text-white text-center space-y-5 shadow-2xl border border-gold-500/30">
      <div class="w-14 h-14 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center mx-auto shadow-sm">
        <IconWhatsApp className="w-8 h-8 text-[#25D366]" />
      </div>
      <div class="space-y-2">
        <h3 class="font-serif text-2xl sm:text-3xl font-normal text-white">
          Vous avez une question particulière ?
        </h3>
        <p class="text-xs sm:text-sm text-stone-300 max-w-md mx-auto font-light">
          Notre équipe commerciale à Dakar vous répond immédiatement sur WhatsApp ou par téléphone.
        </p>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-4 pt-2">
        <a
          href="https://wa.me/221772087820?text=Bonjour%20Jumelles%20Store%2C%20j%27ai%20une%20question%20concernant%20une%20commande"
          target="_blank"
          rel="noopener noreferrer"
          class="px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-bold text-xs rounded-full shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          <IconWhatsApp className="w-4 h-4 text-white" />
          <span>Écrire sur WhatsApp (+221 77 208 78 20)</span>
        </a>

        <a
          href="tel:+221772087820"
          class="px-6 py-3.5 bg-stone-900 hover:bg-stone-850 active:scale-95 text-white font-bold text-xs rounded-full border border-[#d7b966] transition-all flex items-center gap-2 cursor-pointer shadow"
        >
          <IconPhoneSolid className="w-4 h-4 text-[#e02f75]" />
          <span>Appeler le service client</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Sparkles } from 'lucide-vue-next';
import IconWhatsApp from '../components/icons/IconWhatsApp.vue';
import IconPhoneSolid from '../components/icons/IconPhoneSolid.vue';

const openIndex = ref<number | null>(0);

const toggleFaq = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const faqList = [
  {
    icon: '⚡',
    question: 'En combien de temps ma commande est-elle livrée à Dakar ?',
    answer:
      'Toutes les commandes passées avant 14h00 sont livrées le jour même à Dakar. Pour les commandes passées en fin de journée, la livraison s\'effectue le lendemain matin en moins de 24 heures.\n\nNos livreurs se déplacent dans tous les quartiers : Plateau, Almadies, Mermoz, Ouakam, Ngor, Fann, Point E, Sacré-Cœur, Maristes, Yoff, Grand-Dakar, etc.',
  },
  {
    icon: '📍',
    question: 'Livrez-vous dans la banlieue et dans les régions du Sénégal ?',
    answer:
      'Oui, absolument !\n• Banlieue de Dakar (Pikine, Guédiawaye, Keur Massar, Rufisque, Diamniadio) : livraison assurée sous 24h par nos coursiers moto.\n• Régions du Sénégal (Thiès, Mbour, Saly, Saint-Louis, Touba, Kaolack, Ziguinchor) : expédition sécurisée via transport express / La Poste / GP sous 24h à 48h maximum.',
  },
  {
    icon: '📞',
    question: 'Est-ce que le livreur m\'appelle avant d\'arriver ?',
    answer:
      'Oui, obligatoirement. Notre coursier vous contacte par appel téléphonique environ 30 à 45 minutes avant son arrivée pour vérifier votre disponibilité et convenir du lieu exact de remise (domicile ou bureau).',
  },
  {
    icon: '💰',
    question: 'Combien coûtent les frais de livraison ?',
    answer:
      'Actuellement, la livraison est 100% GRATUITE à Dakar dans le cadre de notre offre spéciale de lancement ! Profitez-en pour commander vos sacs et souliers sans aucuns frais additionnels.',
  },
  {
    icon: '👠',
    question: 'Que se passe-t-il si la pointure de chaussure ne me va pas ?',
    answer:
      'Pas d\'inquiétude ! Vous disposez de 48 heures après la réception de votre colis pour demander un échange gratuit de taille. Nos souliers sont disponibles du 37 au 42. Contactez simplement notre service sur WhatsApp au 77 208 78 20 et nous organiserons l\'échange de votre paire.',
  },
  {
    icon: '📱',
    question: 'Comment se passe la confirmation et le règlement de ma commande ?',
    answer:
      'Lorsque vous validez votre panier sur le site, votre commande est enregistrée et vous êtes redirigée directement sur WhatsApp (+221 77 208 78 20) avec un message récapitulatif complet de vos articles.\n\nLe règlement s\'effectue simplement à la livraison lors de la remise de votre colis par notre livreur.',
  },
  {
    icon: '🎁',
    question: 'Mes articles sont-ils emballés pour offrir en cadeau ?',
    answer:
      'Oui ! Chaque sac et chaque paire de chaussures Jumelles Store est emballé avec le plus grand soin dans son pochon protecteur de soie, accompagné d\'un ruban cadeau chic Maison Jumelles Store, prêt à être offert.',
  },
];
</script>

