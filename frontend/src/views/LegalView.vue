<template>
  <div class="lg wrap">
    <header class="lg-head">
      <span class="eyebrow"><ShieldCheck aria-hidden="true" />Informations légales</span>
      <Transition name="fade" mode="out-in">
        <h1 :key="activeTab">
          {{ activeTab === 'terms' ? "Conditions générales d'utilisation" : 'Politique de confidentialité' }}
        </h1>
      </Transition>
      <p class="lead">
        Maison Jumelles Store Dakar · Conforme aux lois sénégalaises du commerce électronique et de la protection des
        données.
      </p>
    </header>

    <!-- Onglets -->
    <div class="lg-tabs" role="tablist" aria-label="Documents" :class="{ right: activeTab === 'privacy' }">
      <span class="lg-ind" aria-hidden="true"></span>
      <button
        id="tab-terms"
        type="button"
        role="tab"
        :aria-selected="activeTab === 'terms'"
        aria-controls="panel-legal"
        @click="activeTab = 'terms'"
      >
        <FileText aria-hidden="true" />
        Conditions
      </button>
      <button
        id="tab-privacy"
        type="button"
        role="tab"
        :aria-selected="activeTab === 'privacy'"
        aria-controls="panel-legal"
        @click="activeTab = 'privacy'"
      >
        <Lock aria-hidden="true" />
        Confidentialité
      </button>
    </div>

    <Transition name="fade" mode="out-in">
      <!-- Conditions d'utilisation -->
      <article
        v-if="activeTab === 'terms'"
        id="panel-legal"
        key="terms"
        class="card lg-doc"
        role="tabpanel"
        aria-labelledby="tab-terms"
      >
        <section>
          <h2><span>1</span>Préambule et présentation de la Maison</h2>
          <p>
            Le présent document régit les relations contractuelles entre la boutique <strong>Jumelles Store</strong>
            (Maison de maroquinerie fine et souliers haut de gamme, basée à Dakar, Sénégal) et toute personne effectuant
            un achat ou navigant sur la plateforme web.
          </p>
        </section>

        <section>
          <h2><span>2</span>Produits et disponibilité</h2>
          <p>
            Nos sacs à main, cabas, pochettes de gala et souliers (pointures 37 à 42) sont décrits avec la plus grande
            précision. Les stocks indiqués sur le site correspondent aux articles disponibles à Dakar. Si un article
            venait à manquer, la cliente est prévenue immédiatement sur WhatsApp et la commande est annulée sans aucun
            frais (le règlement n'ayant lieu qu'à la livraison).
          </p>
        </section>

        <section>
          <h2><span>3</span>Tarifs et modalités de commande</h2>
          <p>
            Les prix sont affichés en Francs CFA (XOF) toutes taxes comprises, avec possibilité d'affichage indicatif en
            Euros (EUR). La validation de la commande s'effectue directement via notre canal WhatsApp officiel (+221 77
            208 78 20) et le règlement s'effectue à la réception du colis.
          </p>
        </section>

        <section>
          <h2><span>4</span>Expédition et livraison à Dakar</h2>
          <p>
            Toute commande confirmée sur WhatsApp est livrée sous 24 heures à Dakar. La livraison est offerte à Dakar ;
            pour la banlieue et les régions, les frais dépendent de la destination et sont annoncés à la cliente sur
            WhatsApp avant l'expédition.
          </p>
        </section>

        <section>
          <h2><span>5</span>Droit d'échange de pointure garanti 48 h</h2>
          <p>
            Conscients de l'importance d'un chaussant parfait, nous accordons un délai de
            <strong>48 heures après réception</strong> pour demander un échange gratuit de taille pour les souliers
            (pointures 37 à 42), sous réserve que l'article soit retourné dans son emballage d'origine, neuf et jamais
            porté en extérieur.
          </p>
        </section>
      </article>

      <!-- Politique de confidentialité -->
      <article
        v-else
        id="panel-legal"
        key="privacy"
        class="card lg-doc"
        role="tabpanel"
        aria-labelledby="tab-privacy"
      >
        <section>
          <h2><span>1</span>Collecte et respect de vos données personnelles</h2>
          <p>
            Maison Jumelles Store s'engage formellement à protéger la vie privée de ses clientes. Les seules informations
            collectées sont celles strictement nécessaires au traitement, à la facturation et à la livraison de vos
            colis :
          </p>
          <ul>
            <li>Nom et prénom de la cliente ou destinataire</li>
            <li>Numéro de téléphone mobile (pour la coordination de la livraison par le coursier)</li>
            <li>Adresse de livraison ou quartier à Dakar</li>
            <li>Historique des articles commandés</li>
          </ul>
        </section>

        <section>
          <h2><span>2</span>Non-divulgation à des tiers</h2>
          <p>
            Vos coordonnées ne sont <strong>jamais vendues, louées ou cédées</strong> à des fins publicitaires. Elles
            sont uniquement transmises à notre service de livraison interne pour vous remettre vos colis en main propre.
          </p>
        </section>

        <section>
          <h2><span>3</span>Sécurité des commandes</h2>
          <p>
            Notre plateforme ne stocke aucune coordonnée bancaire sensible. Toutes les commandes sont vérifiées côté
            serveur et confirmées directement via WhatsApp.
          </p>
        </section>

        <section>
          <h2><span>4</span>Vos droits d'accès et de rectification</h2>
          <p>
            Conformément aux normes en vigueur, vous pouvez à tout moment solliciter la modification ou la suppression
            définitive de vos données personnelles en contactant notre service clientèle.
          </p>
        </section>
      </article>
    </Transition>
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

<style scoped>
.lg {
  max-width: 820px;
  padding-top: var(--s-8);
  padding-bottom: var(--s-12);
}
.lg-head {
  text-align: center;
}
.lg-head .eyebrow svg {
  width: 14px;
  height: 14px;
}
.lg-head h1 {
  margin: var(--s-3) 0 var(--s-2);
  font-size: var(--fs-3xl);
  line-height: var(--lh-tight);
  font-weight: 400;
}
.lg-head .lead {
  margin: 0 auto;
  max-width: 36em;
  color: var(--text-muted);
  font-size: var(--fs-sm);
}

/* ----- Onglets à indicateur glissant ----- */
.lg-tabs {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 380px;
  margin: var(--s-8) auto var(--s-6);
  padding: 4px;
  border-radius: var(--r-md);
  background: var(--bg-sunken);
  border: 1px solid var(--border);
}
.lg-ind {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 4px;
  width: calc(50% - 4px);
  border-radius: var(--r-sm);
  background: var(--surface);
  box-shadow: var(--sh-1);
  transition: transform var(--dur-3) var(--ease-out);
}
.lg-tabs.right .lg-ind {
  transform: translateX(100%);
}
.lg-tabs button {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--s-2);
  min-height: 42px;
  border: 0;
  background: none;
  font: 600 var(--fs-sm) var(--font-sans);
  color: var(--text-muted);
  cursor: pointer;
  transition: color var(--dur-2);
}
.lg-tabs button svg {
  width: 16px;
  height: 16px;
}
.lg-tabs button[aria-selected='true'] {
  color: var(--text);
}

/* ----- Document ----- */
.lg-doc {
  padding: var(--s-5);
}
.lg-doc section + section {
  margin-top: var(--s-6);
  padding-top: var(--s-6);
  border-top: 1px solid var(--border);
}
.lg-doc h2 {
  display: flex;
  align-items: baseline;
  gap: var(--s-3);
  margin: 0 0 var(--s-3);
  font-size: var(--fs-lg);
  line-height: var(--lh-snug);
}
.lg-doc h2 span {
  flex: none;
  font-size: var(--fs-sm);
  color: var(--accent-text);
}
.lg-doc p,
.lg-doc li {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--fs-sm);
  line-height: 1.75;
}
.lg-doc strong {
  color: var(--text);
}
.lg-doc ul {
  display: grid;
  gap: 6px;
  margin: var(--s-3) 0 0;
  padding: 0;
  list-style: none;
}
.lg-doc li {
  position: relative;
  padding-left: var(--s-5);
}
.lg-doc li::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 0.7em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
}

@media (min-width: 720px) {
  .lg {
    padding-top: var(--s-12);
  }
  .lg-doc {
    padding: var(--s-10) var(--s-12);
  }
  .lg-doc p,
  .lg-doc li {
    font-size: var(--fs-base);
  }
}
</style>
