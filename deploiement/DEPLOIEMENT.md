# Mise en ligne de Jumelles Store

Guide pour un serveur Linux (VPS) avec Docker. Comptez environ 30 minutes.

## 1. Avant de commencer

- Un serveur Linux (Ubuntu 22.04 ou plus récent conseillé, 2 Go de RAM minimum).
- Un nom de domaine (ex. `jumelles-store.sn`) dont les enregistrements **A** pointent vers l'adresse IP du serveur, pour `jumelles-store.sn` et `www.jumelles-store.sn`.
- Les ports **80** et **443** ouverts sur le pare-feu du serveur.

## 2. Installer Docker et récupérer le projet

```bash
curl -fsSL https://get.docker.com | sh
git clone <adresse-de-votre-dépôt> jumelles-store
cd jumelles-store
```

## 3. Créer le fichier de configuration (.env)

```bash
docker run --rm -v "$PWD":/app -w /app node:22-alpine node deploiement/generer-env.mjs jumelles-store.sn
```

Le script crée `.env` avec des secrets aléatoires et **affiche une seule fois le mot de passe de l'Espace Gérance : notez-le**.
Remplacez `jumelles-store.sn` par votre domaine. Ne publiez jamais ce fichier.

## 4. Démarrer le site

```bash
docker compose --profile https up -d --build
```

Le premier démarrage prend quelques minutes. Le certificat HTTPS est obtenu automatiquement.
Suivre les journaux : `docker compose logs -f backend caddy`.

## 5. Vérifications (obligatoires)

1. Ouvrir `https://votre-domaine` : le catalogue s'affiche, avec le cadenas HTTPS.
2. Passer une **commande d'essai** jusqu'à WhatsApp.
3. Ouvrir `https://votre-domaine/admin`, se connecter, passer la commande d'essai en « préparation », puis l'annuler.
4. Dans l'Espace Gérance, **ajouter un article avec une photo** (vérifie le stockage MinIO), puis le supprimer.
5. Dans « Compte → Email & mot de passe », définir votre propre email et un mot de passe long.

## Mises à jour

```bash
git pull
docker compose --profile https up -d --build
```

Les commandes, articles et photos sont conservés dans les volumes Docker (`postgres_data`, `minio_data`, `backend_data`).

## Sauvegarde (à planifier, par exemple chaque nuit)

```bash
docker compose exec -T postgres pg_dump -U jumelles_admin jumelles_db > sauvegarde-$(date +%F).sql
```

Conservez aussi une copie du fichier `.env` dans un endroit sûr : sans lui, la base n'est plus accessible.
