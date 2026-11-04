# 🛍️ Jumelles Store - Plateforme E-Commerce Complète

Plateforme e-commerce haut de gamme spécialisée dans la vente de **sacs (maroquinerie)** et de **chaussures (escarpins, sandales, mules)** à Dakar (Sénégal), intégrant **PostgreSQL** (persistance transactionnelle des commandes et des stocks), **MinIO** (stockage photos), l'authentification par **cookie `HttpOnly`** / **Keycloak** (IAM), et un **tunnel de commande validé côté serveur avec confirmation directe sur WhatsApp**.

---

## 🏗️ Architecture Globale

- **Frontend :** Vue.js 3 (Composition API, Pinia, Vue Router avec découpage dynamique, Tailwind CSS)
- **Backend API :** Node.js & Express (TypeScript, Multer avec vérification par magic bytes, MinIO SDK, PostgreSQL `pg`)
- **Authentification & Rôles :** Session administrateur par cookie `HttpOnly; SameSite=Strict` + protection CSRF `X-Requested-With`, et support OIDC Keycloak 24 (`ROLE_ADMIN`, `ROLE_CLIENT`)
- **Stockage Médias :** MinIO S3 (Bucket `jumelles-products`) + stockage disque local de secours
- **Base de Données :** PostgreSQL 16 (Schéma relationnel complet `init.sql` : `categories`, `products`, `product_variants`, `product_images`, `orders`, `order_items`, `phone_callbacks` avec verrouillage `SELECT ... FOR UPDATE`)
- **Conteneurisation :** Docker & Docker Compose (Nginx reverse-proxy `/api/` et `/jumelles-products/` (photos MinIO), conteneurs non-root et `healthcheck`)

---

## 📁 Structure du Projet

```text
Ecommerce/
├── docker-compose.yml          # Déploiement multi-conteneurs (Postgres, MinIO, Keycloak, Backend, Frontend)
├── .env.example                # Modèle des variables d'environnement
├── docs/
│   ├── DEVIS_ESTIMATIF_JUMELLES_STORE.md      # Devis financier détaillé en FCFA
│   └── CAHIER_DES_CHARGES_JUMELLES_STORE.md   # Spécifications fonctionnelles et techniques
├── keycloak/
│   └── realm-export.json       # Configuration importable du Realm Keycloak
├── backend/                    # API REST Node.js / Express en TypeScript
│   ├── prisma/init.sql         # Schéma SQL PostgreSQL & Indexation
│   ├── src/
│   │   ├── config/             # BDD, MinIO S3, Keycloak JWKS
│   │   ├── controllers/        # Produits, Commandes, Paiements Wave/OM, Upload MinIO
│   │   ├── middlewares/        # Authentification JWT & Vérification des rôles
│   │   ├── routes/             # Routes REST API
│   │   └── services/           # Services passerelles Wave, Orange Money, MinIO
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

Assurez-vous que Docker Desktop est ouvert, puis exécutez à la racine :

```bash
docker compose up --build
```

Les services sont alors immédiatement accessibles :
- **Boutique E-commerce (Vue.js) :** [http://localhost:3000](http://localhost:3000)
- **API REST Backend (Node.js) :** [http://localhost:4000/health](http://localhost:4000/health)
- **Console MinIO S3 (locale) :** [http://127.0.0.1:9001](http://127.0.0.1:9001) (identifiants définis dans `.env`)
- **Console Keycloak (locale) :** [http://127.0.0.1:8080](http://127.0.0.1:8080) (identifiants définis dans `.env`)

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
