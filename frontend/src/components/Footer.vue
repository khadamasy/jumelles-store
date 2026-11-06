<template>
  <footer class="ftr">
    <div class="wrap">
      <div class="ftr-grid">
        <div class="ftr-brand">
          <router-link to="/" class="ftr-logo" aria-label="Jumelles Store, accueil">Jumelles</router-link>
          <p>Sacs et chaussures sélectionnés pour toutes vos occasions, livrés en 24 h à Dakar.</p>
          <div class="social" aria-label="Réseaux sociaux">
            <a
              href="https://www.tiktok.com/@khadamasy6"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok @khadamasy6"
              title="TikTok @khadamasy6"
            >
              <IconTikTok className="w-5 h-5" />
            </a>
          </div>
        </div>

        <nav class="ftr-col" aria-label="Boutique">
          <h2>Boutique</h2>
          <router-link to="/catalog?type=SAC">Sacs</router-link>
          <router-link to="/catalog?category=pochettes-matelassees">Pochettes</router-link>
          <router-link to="/catalog?type=CHAUSSURE">Chaussures</router-link>
          <router-link to="/catalog?category=sandales-plates">Sandales</router-link>
        </nav>

        <nav class="ftr-col" aria-label="Aide">
          <h2>Aide</h2>
          <router-link to="/orders">Suivre ma commande</router-link>
          <router-link to="/faq-livraison">Livraison et échanges</router-link>
          <router-link to="/conditions-utilisation">Conditions</router-link>
          <router-link to="/politique-confidentialite">Confidentialité</router-link>
        </nav>

        <div class="ftr-col">
          <h2>Contact</h2>
          <a href="tel:+221772087820" class="ftr-tel tnum">+221 77 208 78 20</a>
          <p>Ouvert 7j/7, de 8 h à 22 h.<br />Dakar, Sénégal.</p>
        </div>
      </div>

      <div class="ftr-bottom">
        <span>© {{ year }} Jumelles Store</span>
        <span>Paiement à la livraison · Commande confirmée sur WhatsApp</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import IconTikTok from './icons/IconTikTok.vue';

const year = new Date().getFullYear();
</script>

<style scoped>
.ftr {
  background: var(--ink);
  color: var(--on-ink);
  padding: var(--s-12) 0 var(--s-6);
  margin-top: var(--s-12);
}
.ftr-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--s-8) var(--s-6);
}
.ftr-brand {
  grid-column: 1 / -1;
}
.ftr-logo {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}
.ftr-brand p {
  margin: var(--s-3) 0 0;
  max-width: 30em;
  color: var(--on-ink-muted);
  font-size: var(--fs-sm);
}
.social {
  display: flex;
  gap: var(--s-2);
  margin-top: var(--s-5);
}
.social a {
  display: grid;
  place-items: center;
  width: var(--tap);
  height: var(--tap);
  border-radius: var(--r-md);
  border: 1px solid rgb(255 255 255 / 0.14);
  color: var(--on-ink);
  transition: border-color var(--dur-2), color var(--dur-2), transform var(--dur-2) var(--ease-out);
}
.social a:hover {
  border-color: var(--accent-on-ink);
  color: var(--accent-on-ink);
  transform: translateY(-2px);
}

.ftr-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.ftr-col h2 {
  margin: 0 0 var(--s-2);
  font: 700 var(--fs-2xs) / 1 var(--font-sans);
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--accent-on-ink);
}
.ftr-col a {
  padding: 8px 0;
  color: rgb(231 220 207);
  font-size: var(--fs-sm);
  transition: color var(--dur-2);
}
.ftr-col a:hover {
  color: var(--accent-on-ink);
}
.ftr-col p {
  margin: var(--s-1) 0 0;
  color: var(--on-ink-muted);
  font-size: var(--fs-sm);
}
.ftr-tel {
  font-weight: 600;
  color: var(--on-ink) !important;
}

.ftr-bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--s-2) var(--s-6);
  margin-top: var(--s-10);
  padding-top: var(--s-5);
  border-top: 1px solid rgb(255 255 255 / 0.1);
  font-size: var(--fs-xs);
  color: var(--on-ink-muted);
}

@media (min-width: 1024px) {
  .ftr-grid {
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }
  .ftr-brand {
    grid-column: auto;
  }
}
</style>
