<template>
  <footer class="jm-footer">
    <div class="wrap cols">
      <div>
        <div class="serif" style="font-size: 22px; letter-spacing: 0.14em">
          JUMELLES
        </div>
        <p>Sacs et chaussures à Dakar. Ouvert 7j/7, de 08h à 22h.</p>
        <div id="social" aria-label="Réseaux sociaux">
          <a
            href="https://www.tiktok.com/@khadamasy6"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="tiktok"
            title="TikTok @khadamasy6"
          >
            <svg viewBox="0 0 24 24">
              <path
                d="M16.5 2h-3.2v13.2a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.4a5.8 5.8 0 1 0 5 5.8V8.6a7 7 0 0 0 4 1.3V6.7a4 4 0 0 1-4-4.7z"
              />
            </svg>
          </a>
        </div>
      </div>

      <div class="col-links">
        <h4>Boutique</h4>
        <router-link to="/catalog?type=SAC">Sacs</router-link>
        <router-link to="/catalog?category=pochettes-matelassees">Pochettes</router-link>
        <router-link to="/catalog?type=CHAUSSURE">Chaussures</router-link>
        <router-link to="/catalog?category=sandales-plates">Sandales</router-link>
      </div>

      <div class="col-links">
        <h4>Aide</h4>
        <router-link to="/orders">Suivre ma commande</router-link>
        <router-link to="/faq-livraison">Livraison et échanges</router-link>
        <router-link to="/conditions-utilisation">Conditions</router-link>
        <router-link to="/politique-confidentialite">Confidentialité</router-link>
        <router-link to="/admin">Espace Gérance (Admin)</router-link>
      </div>
    </div>
  </footer>
</template>
