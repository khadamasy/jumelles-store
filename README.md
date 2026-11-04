# 🛍️ Jumelles Store - Plateforme E-Commerce Complète

Plateforme e-commerce haut de gamme spécialisée dans la vente de **sacs (maroquinerie)** et de **chaussures (escarpins, sandales, mules)** à Dakar (Sénégal), intégrant **PostgreSQL** (persistance transactionnelle des commandes et des stocks), **MinIO** (stockage photos), l'authentification par **cookie `HttpOnly`**, et un **tunnel de commande validé côté serveur avec confirmation directe sur WhatsApp**.

---

## 🏗️ Architecture Globale

- **Frontend :** Vue.js 3 (Composition API, Pinia, Vue Router avec découpage dynamique, Tailwind CSS)
- **Backend API :** Node.js & Express (TypeScript, Multer avec vérification par magic bytes, MinIO SDK, PostgreSQL `pg`)
- **Authentification & Rôles :** Session administrateur par cookie `HttpOnly; SameSite=Strict` + protection CSRF `X-Requested-With`
- **Stockage Médias :** MinIO S3 (Bucket `jumelles-products`, lecture publique via `/jumelles-products/`)
- **Base de Données :** PostgreSQL 16 (Schéma relationnel complet `init.sql` : `categories`, `products`, `product_variants`, `product_images`, `orders`, `order_items`, `phone_callbacks` avec verrouillage `SELECT ... FOR UPDATE`)
- **Conteneurisation :** Docker & Docker Compose : Caddy (HTTPS automatique Let's Encrypt) → Nginx (site, `/api/`, `/jumelles-products/`, `/sitemap.xml`) → API ; sauvegardes quotidiennes
- **Notifications :** alerte Telegram à chaque nouvelle commande et demande de rappel (optionnel)

---

## 📁 Structure du Projet

```text
Ecommerce/
├── docker-compose.yml          # Déploiement (Postgres, MinIO, Backend, Frontend, Caddy, Sauvegardes)
├── Caddyfile                   # HTTPS automatique (Let's Encrypt)
├── scripts/backup.sh           # Sauvegarde quotidienne base + photos (dossier backups/)
├── .env.example                # Modèle des variables d'environnement
├── docs/
│   ├── DEVIS_ESTIMATIF_JUMELLES_STORE.md      # Devis financier détaillé en FCFA
│   └── CAHIER_DES_CHARGES_JUMELLES_STORE.md   # Spécifications fonctionnelles et techniques
├── backend/                    # API REST Node.js / Express en TypeScript
│   ├── prisma/init.sql         # Schéma SQL PostgreSQL & Indexation
│   ├── src/
│   │   ├── config/             # BDD, MinIO S3, sécurité
│   │   ├── controllers/        # Produits, Commandes, Rappels, Upload MinIO
│   │   ├── middlewares/        # Authentification JWT & Vérification des rôles
│   │   ├── routes/             # Routes REST API
│   │   └── services/           # Notifications Telegram
│   ├── Dockerfile
│   └── package.json
└── frontend/                   # Application Web Client & Back-office (Vue.js 3)
    ├── src/
    │   ├── components/         # Navbar, Footer, ProductCard, CartDrawer
    │   ├── views/              # Home, Catalog, ProductDetail, Checkout, OrderSuccess, Orders, Admin
    │   ├── stores/             # Pinia cart & auth
    │   └── services/           # Client HTTP Axios
    ├── Dockerfile
    ├── nginx.conf
    └── package.json
```

---

## 🚀 Démarrage Rapide

### Option A : Lancement via Docker Compose (Recommandé)

Copiez `.env.example` en `.env`, remplacez toutes les valeurs `CHANGEZ_MOI`, puis exécutez à la racine :

```bash
docker compose up --build -d
```

Les services sont alors accessibles :
- **Boutique (via Caddy, HTTPS) :** `https://SITE_DOMAIN` (pour un essai local : `SITE_DOMAIN=localhost`, certificat auto-signé)
- **Boutique sans HTTPS (serveur uniquement) :** [http://localhost:3000](http://localhost:3000)
- **API REST Backend (Node.js) :** [http://localhost:4000/health](http://localhost:4000/health)
- **Console MinIO S3 (locale) :** [http://127.0.0.1:9001](http://127.0.0.1:9001) (identifiants définis dans `.env`)

---

### Option B : Lancement en Mode Développement Local (Sans Docker)

Vous pouvez lancer le Backend et le Frontend directement sur votre machine :

#### 1. Lancer le Backend Node.js
```bash
cd backend
npm run dev
# L'API démarre sur le port 4000 (avec jeu de données de démonstration complet)
```

#### 2. Lancer le Frontend Vue.js 3
```bash
cd frontend
npm run dev
# L'interface Vue.js démarre sur http://localhost:3000
```

---

## 🛍️ Tunnel de Commande & Confirmation WhatsApp

1. Ouvrez l'application web sur [http://localhost:3000](http://localhost:3000).
2. Choisissez un sac ou une paire de chaussures, sélectionnez la **pointure** (ex: 38) ou la **couleur**, et ajoutez au panier.
3. Allez dans le panier et cliquez sur **« Valider et Commander »**.
4. Renseignez vos coordonnées et votre adresse de livraison à Dakar ou en région, puis validez pour confirmer directement sur **WhatsApp**.

---

## 🔒 Accéder à l'Espace Administration (`/admin`)

1. Définissez les variables `ADMIN_PASSWORD` (12 caractères minimum) et `JWT_SECRET` dans `backend/.env` (voir `.env.example`). Optionnel : `ADMIN_EMAIL` pour imposer aussi l'adresse email. Sans `ADMIN_PASSWORD`, la connexion gérance est désactivée.
2. Rendez-vous sur [http://localhost:3000/admin](http://localhost:3000/admin) et connectez-vous avec ce mot de passe. Vous pouvez ensuite le remplacer depuis l'Espace Gérance (le mot de passe actuel est demandé) : `ADMIN_PASSWORD` n'est alors plus accepté et toutes les autres sessions sont déconnectées.
   - La session est stockée dans un **cookie `HttpOnly; SameSite=Strict`** (aucun jeton exposé dans `localStorage` ni `sessionStorage`).
   - Suivi du chiffre d'affaires, des commandes et des rappels téléphoniques.
   - Création/modification d'articles et gestion des stocks par pointure/couleur.

## 💾 Persistance des données

- Chaque écriture est d'abord enregistrée sur disque (`backend/data/store.json`, volume Docker `backend_data`), puis dans PostgreSQL.
- Si PostgreSQL est indisponible, le fichier `backend/data/pg-pending` est créé et la synchronisation est relancée toutes les 30 s ; au redémarrage, le disque (plus récent) est recopié dans PostgreSQL. Aucune commande n'est perdue.
- En production, si PostgreSQL est injoignable au démarrage et qu'aucune sauvegarde disque n'existe, le serveur refuse de démarrer (pour ne jamais écraser la vraie base avec le catalogue de démonstration).


---

## 🌍 Mise en ligne sur un serveur (VPS)

1. **Serveur :** un VPS Linux (2 vCPU / 4 Go RAM suffisent) avec Docker installé. Ouvrez les ports **80** et **443**.
2. **Domaine :** créez chez votre registraire deux enregistrements DNS de type `A` vers l'IP du serveur : `jumelles-store.sn` et `www.jumelles-store.sn`.
3. **Configuration :** copiez `.env.example` en `.env` et renseignez au minimum `SITE_DOMAIN`, `ADMIN_PASSWORD`, `JWT_SECRET`, `POSTGRES_PASSWORD`, `MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD`.
4. **Lancement :** `docker compose up --build -d`. Caddy obtient seul le certificat HTTPS (quelques secondes) et le renouvelle automatiquement.
5. **Vérification :** ouvrez `https://SITE_DOMAIN`, connectez-vous à `/admin`, passez une commande test, puis annulez-la depuis l'admin.

> Sans HTTPS, la connexion à l'Espace Gérance est impossible en production (cookie de session `Secure`). Passez toujours par Caddy.

## 🔔 Alertes de nouvelles commandes (Telegram, gratuit)

1. Sur Telegram, écrivez à **@BotFather** → `/newbot` → notez le **jeton** (`123456:ABC...`).
2. Envoyez un message quelconque à votre nouveau bot, puis ouvrez `https://api.telegram.org/bot<JETON>/getUpdates` : notez le nombre `"chat":{"id": ...}`.
3. Dans `.env` : `TELEGRAM_BOT_TOKEN=<jeton>` et `TELEGRAM_CHAT_ID=<id>`, puis `docker compose up -d backend`.

Vous recevez alors chaque nouvelle commande (cliente, adresse, articles, total) et chaque demande de rappel, même si la cliente n'envoie pas son message WhatsApp.

## ⏱️ Commandes non confirmées

Une commande restée **En attente** plus de `PENDING_ORDER_TTL_HOURS` heures (48 par défaut) est annulée automatiquement et son stock remis en rayon (motif visible dans l'admin). Mettez `0` pour désactiver. Pensez à passer les commandes confirmées au statut **Payée** ou **En préparation**.

## 💾 Sauvegardes

- Le service `backup` crée chaque jour dans `./backups/` un export de la base (`base-AAAAMMJJ-HHMM.dump`) et une archive des photos (`photos-....tar.gz`), conservés `BACKUP_RETENTION_DAYS` jours (14 par défaut).
- **Copiez régulièrement ce dossier hors du serveur** (ordinateur, Google Drive...).
- Restaurer la base :

```bash
docker compose exec -T postgres pg_restore --clean --if-exists -U "$POSTGRES_USER" -d "$POSTGRES_DB" < backups/base-AAAAMMJJ-HHMM.dump
docker compose restart backend
```

## 🔎 Référencement

Titre, description, lien canonique et image de partage propres à chaque page ; données structurées `Product` (prix, disponibilité) sur les fiches articles ; `sitemap.xml` et `robots.txt` générés automatiquement à partir du catalogue. Déclarez `https://SITE_DOMAIN/sitemap.xml` dans Google Search Console.
