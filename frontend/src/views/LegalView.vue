<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
    <!-- Header -->
    <div class="text-center space-y-3">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold uppercase tracking-widest shadow-2xs">
        <ShieldCheck class="w-4 h-4 text-sky-600" />
        <span>Informations Légales & Transparence</span>
      </div>
      <h1 class="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900">
        {{ activeTab === 'terms' ? "Conditions Générales d'Utilisation" : "Politique de Confidentialité" }}
      </h1>
      <p class="text-stone-500 text-xs sm:text-sm max-w-xl mx-auto">
        Maison Jumelles Store Dakar • Conforme aux lois sénégalaises du commerce électronique et de la protection des données.
      </p>
    </div>

    <!-- Onglets de sélection rapides -->
    <div class="flex items-center justify-center gap-2 bg-stone-100 p-1.5 rounded-2xl max-w-md mx-auto border border-stone-200 shadow-2xs">
      <button
        @click="activeTab = 'terms'"
        class="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
        :class="activeTab === 'terms' ? 'bg-white text-stone-950 shadow-sm' : 'text-stone-600 hover:text-stone-950'"
      >
        <FileText class="w-4 h-4" :class="activeTab === 'terms' ? 'text-sky-600' : 'text-stone-400'" />
        <span>Conditions d'utilisation</span>
      </button>

      <button
        @click="activeTab = 'privacy'"
        class="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
        :class="activeTab === 'privacy' ? 'bg-white text-stone-950 shadow-sm' : 'text-stone-600 hover:text-stone-950'"
      >
        <Lock class="w-4 h-4" :class="activeTab === 'privacy' ? 'text-sky-600' : 'text-stone-400'" />
        <span>Confidentialité</span>
      </button>
    </div>

    <!-- Contenu : Conditions d'Utilisation -->
    <div v-if="activeTab === 'terms'" class="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8 text-stone-700 leading-relaxed text-sm">
      <section class="space-y-3">
        <h2 class="font-serif text-xl font-bold text-stone-950 flex items-center gap-2">
          <FileText class="w-5 h-5 text-sky-600" />
          <span>1. Préambule et Présentation de la Maison</span>
        </h2>
        <p>
          Le présent document régit les relations contractuelles entre la boutique <strong>Jumelles Store</strong> (Maison de maroquinerie fine et souliers haut de gamme, basée à Dakar, Sénégal) et toute personne effectuant un achat ou navigant sur la plateforme web.
        </p>
      </section>

      <section class="space-y-3 border-t border-stone-100 pt-6">
        <h2 class="font-serif text-xl font-bold text-stone-950">2. Produits et Disponibilité</h2>
        <p>
          Nos sacs à main, cabas, pochettes de gala et souliers (pointures 37 à 42) sont décrits avec la plus grande précision. Les stocks indiqués sur le site correspondent aux articles physiquement disponibles dans notre entrepôt logistique à Dakar. En cas de rupture simultanée, la cliente est immédiatement notifiée et remboursée sous 24h.
        </p>
      </section>

      <section class="space-y-3 border-t border-stone-100 pt-6">
        <h2 class="font-serif text-xl font-bold text-stone-950">3. Tarifs et Modalités de Paiement Sécurisé</h2>
        <p>
          Les prix sont affichés en Francs CFA (XOF) toutes taxes comprises, avec possibilité d'affichage indicatif en Euros (EUR). Le règlement des commandes s'effectue exclusivement via nos canaux directs sécurisés et vérifiés :
        </p>
        <ul class="list-disc pl-5 space-y-1 text-stone-600">
          <li><strong>Wave Sénégal :</strong> transfert mobile direct sans commission bancaire.</li>
          <li><strong>Orange Money :</strong> règlement via l'application Max it ou par code rapide USSD #144#.</li>
        </ul>
        <p>Le compte officiel récepteur est vérifié au nom de <strong>Fary Dione</strong> (77 208 78 20).</p>
      </section>

      <section class="space-y-3 border-t border-stone-100 pt-6">
        <h2 class="font-serif text-xl font-bold text-stone-950">4. Expédition et Livraison à Dakar</h2>
        <p>
          Toute commande validée avant 14h00 est expédiée et livrée le jour même à Dakar. Les commandes postérieures sont livrées le lendemain matin en moins de 24 heures ouvrées. Les frais de livraison sont calculés en fonction de la commune de destination (Plateau, Almadies, Mermoz, Maristes, Banlieue, etc.).
        </p>
      </section>

      <section class="space-y-3 border-t border-stone-100 pt-6">
        <h2 class="font-serif text-xl font-bold text-stone-950">5. Droit d'Échange de Pointure Garanti 48h</h2>
        <p>
          Conscients de l'importance d'un chaussant parfait, nous accordons un délai de <strong>48 heures après réception</strong> pour demander un échange gratuit de taille pour les souliers (pointures 37 à 42), sous réserve que l'article soit retourné dans son emballage d'origine, neuf et jamais porté en extérieur.
        </p>
      </section>
    </div>

    <!-- Contenu : Politique de Confidentialité -->
    <div v-else class="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8 text-stone-700 leading-relaxed text-sm">
      <section class="space-y-3">
        <h2 class="font-serif text-xl font-bold text-stone-950 flex items-center gap-2">
          <Lock class="w-5 h-5 text-sky-600" />
          <span>1. Collecte et Respect de vos Données Personnelles</span>
        </h2>
        <p>
          Maison Jumelles Store s'engage formellement à protéger la vie privée de ses clientes. Les seules informations collectées sont celles strictement nécessaires au traitement, à la facturation et à la livraison de vos colis :
        </p>
        <ul class="list-disc pl-5 space-y-1 text-stone-600">
          <li>Nom et prénom de la cliente ou destinataire</li>
          <li>Numéro de téléphone mobile (pour la coordination de la livraison par le coursier)</li>
          <li>Adresse de livraison ou quartier à Dakar</li>
          <li>Historique des commandes et justificatifs de transferts Wave / Orange Money</li>
        </ul>
      </section>

      <section class="space-y-3 border-t border-stone-100 pt-6">
        <h2 class="font-serif text-xl font-bold text-stone-950">2. Non-Divulgation à des Tiers</h2>
        <p>
          Vos coordonnées ne sont <strong>jamais vendues, louées ou cédées</strong> à des fins publicitaires. Elles sont uniquement transmises à notre service de livraison interne pour vous remettre vos colis en main propre.
        </p>
      </section>

      <section class="space-y-3 border-t border-stone-100 pt-6">
        <h2 class="font-serif text-xl font-bold text-stone-950">3. Sécurité des Transactions</h2>
        <p>
          Notre plateforme ne stocke aucune coordonnée bancaire sensible. Les paiements Wave et Orange Money s'opèrent directement sur les protocoles sécurisés et chiffrés de leurs opérateurs respectifs.
        </p>
      </section>

      <section class="space-y-3 border-t border-stone-100 pt-6">
        <h2 class="font-serif text-xl font-bold text-stone-950">4. Vos Droits d'Accès et de Rectification</h2>
        <p>
          Conformément aux normes en vigueur, vous pouvez à tout moment solliciter la modification ou la suppression définitive de vos données personnelles en contactant notre service clientèle.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ShieldCheck, FileText, Lock } from 'lucide-vue-next';

const route = useRoute();
const activeTab = ref<'terms' | 'privacy'>('terms');

onMounted(() => {
  if (route.path.includes('confidentialite')) {
    activeTab.value = 'privacy';
  } else {
    activeTab.value = 'terms';
  }
});
</script>
