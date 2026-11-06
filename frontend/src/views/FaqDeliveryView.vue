<template>
  <div class="faq wrap">
    <nav class="crumb" aria-label="Fil d'Ariane">
      <router-link to="/">Accueil</router-link>
      <ChevronRight class="crumb-sep" aria-hidden="true" />
      <span aria-current="page">Livraison et FAQ</span>
    </nav>

    <header class="faq-head">
      <span class="eyebrow"><i></i>Service client · Dakar</span>
      <h1>Livraison, échanges &amp; questions</h1>
      <p class="lead">
        Toutes les réponses sur les délais de livraison à Dakar, les échanges de pointure et les commandes sur WhatsApp.
      </p>
    </header>

    <!-- Garanties -->
    <ul class="faq-perks" aria-label="Nos garanties">
      <li>
        <span class="faq-ic"><Zap aria-hidden="true" /></span>
        <b>Livraison 24 h</b>
        <span>Dakar, Almadies, Mermoz, Plateau &amp; banlieue</span>
      </li>
      <li>
        <span class="faq-ic"><Repeat aria-hidden="true" /></span>
        <b>Échange 48 h</b>
        <span>Pointures échangeables facilement de 37 à 42</span>
      </li>
      <li>
        <span class="faq-ic wa"><IconWhatsApp className="w-5 h-5" /></span>
        <b>Commande WhatsApp</b>
        <span>Confirmation directe au +221 77 208 78 20</span>
      </li>
      <li>
        <span class="faq-ic"><Headphones aria-hidden="true" /></span>
        <b>Assistance 7j/7</b>
        <span>Conseillères disponibles de 8 h à 22 h</span>
      </li>
    </ul>

    <!-- Questions -->
    <section class="faq-list" aria-label="Questions fréquentes">
      <div v-for="(item, index) in faqList" :key="index" class="faq-item" :class="{ open: openIndex === index }">
        <h2>
          <button
            :id="`faq-q-${index}`"
            type="button"
            class="faq-q"
            :aria-expanded="openIndex === index"
            :aria-controls="`faq-a-${index}`"
            @click="toggleFaq(index)"
          >
            <span class="faq-q-ic"><component :is="item.icon" aria-hidden="true" /></span>
            <span class="faq-q-t">{{ item.question }}</span>
            <Plus class="faq-plus" aria-hidden="true" />
          </button>
        </h2>
        <div :id="`faq-a-${index}`" class="faq-a" role="region" :aria-labelledby="`faq-q-${index}`">
          <div class="faq-a-in">
            <p>{{ item.answer }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section class="faq-cta" aria-labelledby="faq-cta-t">
      <h2 id="faq-cta-t">Une question particulière ?</h2>
      <p>Notre équipe à Dakar vous répond immédiatement sur WhatsApp ou par téléphone.</p>
      <div class="faq-cta-a">
        <a
          href="https://wa.me/221772087820?text=Bonjour%20Jumelles%20Store%2C%20j%27ai%20une%20question%20concernant%20une%20commande"
          target="_blank"
          rel="noopener noreferrer"
          class="btn wa lg"
        >
          <IconWhatsApp className="w-5 h-5" />
          Écrire sur WhatsApp
        </a>
        <a href="tel:+221772087820" class="btn lg faq-call">
          <Phone aria-hidden="true" />
          Appeler le service client
        </a>
      </div>
      <p class="faq-cta-n tnum">+221 77 208 78 20 · 7j/7, 8 h – 22 h</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  ChevronRight,
  Plus,
  Zap,
  Repeat,
  Headphones,
  Phone,
  MapPin,
  PhoneCall,
  Wallet,
  Footprints,
  Smartphone,
  Gift,
} from 'lucide-vue-next';
import IconWhatsApp from '../components/icons/IconWhatsApp.vue';

const openIndex = ref<number | null>(0);

const toggleFaq = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const faqList = [
  {
    icon: Zap,
    question: 'En combien de temps ma commande est-elle livrée à Dakar ?',
    answer:
      'Votre commande est livrée sous 24 heures à Dakar, une fois confirmée sur WhatsApp.\n\nNos livreurs se déplacent dans tous les quartiers : Plateau, Almadies, Mermoz, Ouakam, Ngor, Fann, Point E, Sacré-Cœur, Maristes, Yoff, Grand-Dakar, etc.',
  },
  {
    icon: MapPin,
    question: 'Livrez-vous dans la banlieue et dans les régions du Sénégal ?',
    answer:
      'Oui, absolument !\n• Banlieue de Dakar (Pikine, Guédiawaye, Keur Massar, Rufisque, Diamniadio) : livraison sous 24h par coursier.\n• Régions du Sénégal (Thiès, Mbour, Saly, Saint-Louis, Touba, Kaolack, Ziguinchor…) : expédition sous 24h à 48h.\n\nLes frais pour la banlieue et les régions vous sont annoncés sur WhatsApp avant l\'expédition.',
  },
  {
    icon: PhoneCall,
    question: 'Est-ce que le livreur m\'appelle avant d\'arriver ?',
    answer:
      'Oui, obligatoirement. Notre coursier vous contacte par appel téléphonique avant son arrivée pour vérifier votre disponibilité et convenir du lieu exact de remise (domicile ou bureau).',
  },
  {
    icon: Wallet,
    question: 'Combien coûtent les frais de livraison ?',
    answer:
      'La livraison est offerte à Dakar. Pour la banlieue et les régions, les frais dépendent de la destination : ils vous sont annoncés sur WhatsApp avant l\'expédition, sans surprise.',
  },
  {
    icon: Footprints,
    question: 'Que se passe-t-il si la pointure de chaussure ne me va pas ?',
    answer:
      'Pas d\'inquiétude ! Vous disposez de 48 heures après la réception de votre colis pour demander un échange gratuit de taille. Nos souliers sont disponibles du 37 au 42. Contactez simplement notre service sur WhatsApp au 77 208 78 20 et nous organiserons l\'échange de votre paire.',
  },
  {
    icon: Smartphone,
    question: 'Comment se passe la confirmation et le règlement de ma commande ?',
    answer:
      'Lorsque vous validez votre panier sur le site, votre commande est enregistrée et vous êtes redirigée directement sur WhatsApp (+221 77 208 78 20) avec un message récapitulatif complet de vos articles.\n\nLe règlement s\'effectue simplement à la livraison lors de la remise de votre colis par notre livreur.',
  },
  {
    icon: Gift,
    question: 'Mes articles sont-ils emballés pour offrir en cadeau ?',
    answer:
      'Oui ! Chaque sac et chaque paire de chaussures est emballé avec soin, prêt à être offert. Précisez sur WhatsApp s\'il s\'agit d\'un cadeau.',
  },
];
</script>

<style scoped>
.faq {
  max-width: 880px;
  padding-top: var(--s-6);
  padding-bottom: var(--s-12);
}
.crumb-sep {
  width: 12px;
  height: 12px;
  opacity: 0.6;
}
.faq-head h1 {
  margin: var(--s-3) 0 var(--s-2);
  font-size: var(--fs-3xl);
  line-height: var(--lh-tight);
  font-weight: 400;
}
.faq-head .lead {
  margin: 0;
  max-width: 38em;
  color: var(--text-muted);
  font-size: var(--fs-sm);
}

/* ----- Garanties ----- */
.faq-perks {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--s-3);
  list-style: none;
  margin: var(--s-8) 0 0;
  padding: 0;
}
.faq-perks li {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: var(--s-4);
  border-radius: var(--r-lg);
  background: var(--surface);
  border: 1px solid var(--border);
}
.faq-perks b {
  margin-top: var(--s-2);
  font-size: var(--fs-sm);
}
.faq-perks li > span:last-child {
  font-size: var(--fs-xs);
  line-height: 1.4;
  color: var(--text-muted);
}
.faq-ic {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: var(--r-md);
  background: var(--accent-soft);
  color: var(--accent-text);
}
.faq-ic svg {
  width: 20px;
  height: 20px;
}
.faq-ic.wa {
  background: var(--wa-soft);
  color: var(--wa);
}

/* ----- Accordéon ----- */
.faq-list {
  margin-top: var(--s-10);
  border-top: 1px solid var(--border);
}
.faq-item {
  border-bottom: 1px solid var(--border);
}
.faq-item h2 {
  margin: 0;
  font: inherit;
}
.faq-q {
  display: flex;
  align-items: center;
  gap: var(--s-3);
  width: 100%;
  min-height: 64px;
  padding: var(--s-4) 0;
  border: 0;
  background: none;
  color: var(--text);
  text-align: left;
  cursor: pointer;
}
.faq-q-ic {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  flex: none;
  border-radius: var(--r-sm);
  background: var(--bg-sunken);
  color: var(--text-muted);
  transition: background-color var(--dur-3), color var(--dur-3);
}
.faq-q-ic svg {
  width: 18px;
  height: 18px;
}
.faq-q-t {
  flex: 1;
  font-family: var(--font-display);
  font-size: var(--fs-md);
  line-height: var(--lh-snug);
  transition: color var(--dur-2);
}
.faq-q:hover .faq-q-t {
  color: var(--accent-text);
}
.faq-plus {
  width: 20px;
  height: 20px;
  flex: none;
  color: var(--text-muted);
  transition: transform var(--dur-3) var(--ease-out);
}
.open .faq-plus {
  transform: rotate(45deg);
}
.open .faq-q-ic {
  background: var(--ink);
  color: var(--accent-on-ink);
}

/* Ouverture fluide (hauteur automatique animée) */
.faq-a {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--dur-3) var(--ease-out);
}
.open .faq-a {
  grid-template-rows: 1fr;
}
.faq-a-in {
  overflow: hidden;
  visibility: hidden;
  transition: visibility 0s var(--dur-3);
}
.open .faq-a-in {
  visibility: visible;
  transition: visibility 0s;
}
.faq-a p {
  margin: 0;
  padding: 0 0 var(--s-5) 48px;
  color: var(--text-muted);
  font-size: var(--fs-sm);
  line-height: 1.7;
  white-space: pre-line;
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity var(--dur-3) var(--ease-out), transform var(--dur-3) var(--ease-out);
}
.open .faq-a p {
  opacity: 1;
  transform: none;
}

/* ----- Contact ----- */
.faq-cta {
  margin-top: var(--s-12);
  padding: var(--s-8) var(--s-5);
  border-radius: var(--r-xl);
  text-align: center;
  color: var(--on-ink);
  background:
    radial-gradient(90% 120% at 50% 0%, rgb(var(--c-gold-500) / 0.2), transparent 60%),
    var(--ink);
}
.faq-cta h2 {
  margin: 0;
  font-size: var(--fs-2xl);
  color: var(--on-ink);
}
.faq-cta > p {
  margin: var(--s-2) auto 0;
  max-width: 32em;
  font-size: var(--fs-sm);
  color: var(--on-ink-muted);
}
.faq-cta-a {
  display: grid;
  gap: var(--s-2);
  margin-top: var(--s-6);
}
.faq-call {
  --btn-bg: rgb(255 255 255 / 0.06);
  --btn-fg: var(--on-ink);
  --btn-bd: rgb(255 255 255 / 0.16);
}
.faq-call:hover {
  --btn-bg: rgb(255 255 255 / 0.12);
  --btn-bd: var(--accent-on-ink);
}
.faq-cta-n {
  margin: var(--s-4) 0 0 !important;
  font-size: var(--fs-xs) !important;
}

@media (min-width: 720px) {
  .faq {
    padding-top: var(--s-10);
  }
  .faq-perks {
    grid-template-columns: repeat(4, 1fr);
  }
  .faq-q-t {
    font-size: var(--fs-lg);
  }
  .faq-cta {
    padding: var(--s-12) var(--s-8);
  }
  .faq-cta-a {
    display: flex;
    justify-content: center;
  }
}
</style>
