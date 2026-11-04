# 🛍️ Jumelles Store - Plateforme E-Commerce Complète

Plateforme e-commerce haut de gamme spécialisée dans la vente de **sacs (maroquinerie)** et de **chaussures (escarpins, sandales, baskets)**, intégrant **Keycloak** (IAM), **MinIO** (stockage photos), **PostgreSQL**, et les paiements mobiles **Wave** et **Orange Money**.

---

## 🏗️ Architecture Globale

- **Frontend :** Vue.js 3 (Composition API, Pinia, Vue Router, Tailwind CSS, Keycloak-js)
- **Backend API :** Node.js & Express (TypeScript, Multer, MinIO SDK, Wave API, Orange Money API)
- **Authentification & Rôles :** Keycloak 24 (Realm `jumelles-store`, rôles `ROLE_ADMIN`, `ROLE_CLIENT`)
- **Stockage Médias :** MinIO S3 (Buckets `jumelles-products` et `jumelles-invoices`)
- **Base de Données :** PostgreSQL 16 (Schéma relationnel avec catégories, variantes de pointures, commandes, transactions)
- **Conteneurisation :** Docker & Docker Compose

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

1. Définissez les variables `ADMIN_PASSWORD` et `JWT_SECRET` dans `backend/.env` (voir `.env.example`).
2. Rendez-vous sur [http://localhost:3000/admin](http://localhost:3000/admin) et saisissez le mot de passe de gérance :
   - La session est stockée dans un **cookie `HttpOnly; SameSite=Strict`** (aucun jeton exposé dans `localStorage` ni `sessionStorage`).
   - Suivi du chiffre d'affaires, des commandes et des rappels téléphoniques.
   - Création/modification d'articles et gestion des stocks par pointure/couleur.
