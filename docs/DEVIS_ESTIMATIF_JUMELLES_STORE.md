# 📄 DEVIS ESTIMATIF ET FINANCIER DÉTAILLÉ
**Projet :** Plateforme E-commerce Complète « Jumelles Store »  
**Client / Bénéficiaire :** Jumelles Store (Vente de sacs et chaussures)  
**Devise :** Franc CFA (FCFA / XOF)  
**Date d'émission :** 2 Novembre 2026  
**Validité de l'offre :** 60 jours  
**Statut du projet :** Site e-commerce complet clé en main  

---

## 1. Synthèse du Projet

Le projet **Jumelles Store** consiste en la conception, le développement, la sécurisation et le déploiement d'une solution e-commerce complète dédiée à la commercialisation d'articles de maroquinerie (sacs) et de chaussures. 

L'architecture retenue repose sur des technologies de référence industrielle :
- **Frontend :** Vue.js 3 (Vite, Pinia, Tailwind CSS)
- **Backend :** Node.js / Express (TypeScript, validation stricte, architecture en couches)
- **Authentification & IAM :** Keycloak (OpenID Connect / OAuth2, rôles RBAC Client / Admin)
- **Stockage de médias :** MinIO (Stockage objet S3 local/cloud haute performance)
- **Base de données :** PostgreSQL (ACID, intégrité référentielle, indexation avancée)
- **Paiements mobiles :** Intégration Wave API & Orange Money API
- **Infrastructure & Conteneurisation :** Docker & Docker Compose

---

## 2. Décomposition des Prestations & Grille Tarifaire

| Réf | Lot / Phase de Réalisation | Description détaillée des livrables | Charge estimée (J/H) | Montant (FCFA) |
| :--- | :--- | :--- | :---: | :---: |
| **LOT 1** | **Cadrage, Architecture & Modélisation** | • Spécifications fonctionnelles et techniques détaillées<br>• Modélisation de la base PostgreSQL (MCD / MLD)<br>• Définition des schémas d'API REST & contrats d'échanges (OpenAPI/Swagger)<br>• Architecture de sécurité Keycloak & matrice des droits RBAC | 4 jours | **120 000 FCFA** |
| **LOT 2** | **Design UI/UX & Prototypes** | • Charte graphique sur-mesure pour « Jumelles Store »<br>• Wireframes et maquettes interactives (Figma) pour Desktop & Mobile<br>• Parcours d'achat optimisé (Tunnel de commande sans friction)<br>• Maquettes du tableau de bord d'administration | 5 jours | **150 000 FCFA** |
| **LOT 3** | **Infrastructure & Socle Technique Conteneurisé** | • Configuration `docker-compose.yml` multi-services (PostgreSQL, MinIO, Keycloak, Backend, Frontend)<br>• Déploiement et sécurisation de Keycloak (Realm, Clients, Rôles, Scopes)<br>• Configuration des buckets MinIO (politiques d'accès, génération d'URLs pré-signées)<br>• Initialisation de la base PostgreSQL et migrations | 4 jours | **140 000 FCFA** |
| **LOT 4** | **Développement Backend (Node.js / Express / TypeScript)** | • Architecture Clean Architecture / Services-Controllers-Repositories<br>• API REST Produits (sacs, chaussures, pointures, tailles, coloris, stocks)<br>• Gestion du panier d'achat et validation des stocks en temps réel<br>• Moteur de commandes et génération de factures/reçus numériques<br>• Middleware de validation JWT / Introspection Keycloak<br>• Service d'upload et traitement d'images via MinIO SDK | 10 jours | **350 000 FCFA** |
| **LOT 5** | **Intégration Passerelles de Paiement (Wave & Orange Money)** | • Intégration de l'API Wave (Génération QR Code, Deep links mobiles, Webhooks sécurisés)<br>• Intégration de l'API Orange Money (Paiement OTP/Web, notification IPN/Webhook)<br>• Gestion des transactions idempotentes, statuts d'échec/succès et réconciliation | 5 jours | **180 000 FCFA** |
| **LOT 6** | **Développement Frontend Vue.js 3 (Espace Client Public)** | • Catalogue dynamique avec filtres multicritères (Sacs, Chaussures, Pointures, Prix, Marques)<br>• Fiche produit interactive (galerie photos MinIO, sélection pointure/couleur, zoom)<br>• Gestion du panier persistant (Pinia + LocalStorage)<br>• Tunnel de commande fluide (adresse de livraison, choix Wave / OM)<br>• Espace personnel client (historique des commandes, suivi statut, téléchargement factures)<br>• Intégration Keycloak-js (login SSO, redirection fluide) | 9 jours | **320 000 FCFA** |
| **LOT 7** | **Développement Frontend Vue.js 3 (Espace Administration)** | • Dashboard avec KPI clés (Ventes du jour, chiffre d'affaires, stocks faibles)<br>• Module CRUD Produits & Gestion des variantes (tailles, couleurs, stock unitaire)<br>• Upload direct de photos haute définition vers MinIO<br>• Gestion des commandes (Validation, Expédition, Annulation, Remboursement)<br>• Gestion des clients et consultation de l'activité | 6 jours | **240 000 FCFA** |
| **LOT 8** | **Assurance Qualité, Tests & Recette** | • Tests d'intégration des webhooks Wave et Orange Money en Sandbox<br>• Tests de charge et performance (temps de chargement des images MinIO)<br>• Tests d'authentification et d'isolation des rôles Keycloak<br>• Recette fonctionnelle globale sur terminaux Android, iOS et Desktop | 4 jours | **100 000 FCFA** |
| **LOT 9** | **Déploiement, Mise en Production & Formation** | • Déploiement sur serveur VPS (Docker production, SSL Let's Encrypt, Reverse Proxy Nginx)<br>• Sauvegarde automatisée de la base de données PostgreSQL<br>• Guide d'exploitation administrateur et guide utilisateur<br>• Séance de formation à l'administration de la boutique | 3 jours | **100 000 FCFA** |
| **TOTAL** | **PROJET COMPLET CLÉ EN MAIN** | **Durée totale estimée : 50 jours ouvrés** | **50 J/H** | **1 700 000 FCFA** |

---

## 3. Options d'Hébergement & Frais Récurrents Annuels (À la charge du client)

| Poste de Dépense | Fréquence | Fournisseur / Solution recommandée | Estimation annuelle |
| :--- | :--- | :--- | :--- |
| **Nom de Domaine (.com ou .sn)** | Annuelle | OVHcloud, Namecheap ou prestataire local | ~10 000 à 25 000 FCFA / an |
| **Serveur VPS (Docker, MinIO, Keycloak, BDD)** | Mensuelle / Annuelle | VPS 4 vCPU, 8 Go RAM, 100 Go NVMe (Contabo / Hetzner) | ~120 000 à 180 000 FCFA / an |
| **Certificat SSL HTTPS** | Gratuit | Let's Encrypt (renouvellement auto) | 0 FCFA |
| **Compte Marchand Wave & Orange Money** | Par transaction | Frais standards opérateurs (~1% à 2% par transaction encaissée) | Selon volume de vente |

---

## 4. Modalités de Règlement (Échelonnement du Paiement)

Afin d'assurer une progression sécurisée et transparente des développements, la facturation est échelonnée en 4 étapes clés :

1. **Acompte de démarrage (30%) :** **510 000 FCFA**  
   *À la signature du devis et validation du cahier des charges.*
2. **Premier jalon fonctionnel (30%) :** **510 000 FCFA**  
   *Livraison du socle Docker (Keycloak, MinIO, PostgreSQL) et de l'API Backend opérationnelle.*
3. **Deuxième jalon fonctionnel (25%) :** **425 000 FCFA**  
   *Livraison du frontend Vue.js complet avec intégration Wave & Orange Money en environnement de test.*
4. **Solde à la livraison finale (15%) :** **255 000 FCFA**  
   *Après recette définitive, mise en production et formation de l'administrateur.*

---

## 5. Garanties & Support

- **Garantie corrective :** 3 mois de garantie post-déploiement offerte (correction sans frais de tout bogue fonctionnel ou anomalie constatée).
- **Assistance technique :** Support par messagerie et téléphone pendant la phase de lancement.
- **Propriété intellectuelle :** Cession intégrale du code source et de la documentation technique au client dès acquittement du solde.

---

**Signature & Mention d'accord du Client :**  
*« Bon pour accord et commande »*  
Date : ________________________  
Signature :

