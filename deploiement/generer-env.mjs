#!/usr/bin/env node
/**
 * Génère le fichier .env de PRODUCTION avec des secrets aléatoires solides.
 *
 * Utilisation (sur le serveur, à la racine du projet) :
 *   node deploiement/generer-env.mjs jumelles-store.sn
 *
 * - Refuse d'écraser un .env existant (les données chiffrées en dépendent).
 * - Affiche une seule fois le mot de passe de la gérance : notez-le.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const domain = (process.argv[2] || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(domain)) {
  console.error('Usage : node deploiement/generer-env.mjs votre-domaine.sn');
  process.exit(1);
}

const target = path.resolve(process.cwd(), '.env');
if (fs.existsSync(target)) {
  console.error(`Un fichier .env existe déjà (${target}) : rien n'a été modifié.`);
  process.exit(1);
}

const secret = (bytes) => crypto.randomBytes(bytes).toString('base64url');
// Mot de passe lisible : 5 groupes de 5 caractères sans caractères ambigus
const readablePassword = () => {
  const alphabet = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(25);
  const chars = [...bytes].map((b) => alphabet[b % alphabet.length]).join('');
  return chars.match(/.{5}/g).join('-');
};

const adminPassword = readablePassword();

const content = `# Fichier généré le ${new Date().toISOString()} — NE JAMAIS le publier ni l'envoyer.
NODE_ENV=production

# Domaine et HTTPS (Caddy)
SITE_DOMAIN=${domain}
PUBLIC_SITE_URL=https://${domain}
ALLOWED_ORIGINS=https://${domain},https://www.${domain}
FRONTEND_BIND=127.0.0.1

# Espace Gérance
ADMIN_EMAIL=
ADMIN_PASSWORD=${adminPassword}
JWT_SECRET=${secret(48)}

# Base de données PostgreSQL
POSTGRES_USER=jumelles_admin
POSTGRES_PASSWORD=${secret(24)}
POSTGRES_DB=jumelles_db

# Stockage des photos MinIO
MINIO_ROOT_USER=jumelles_minio
MINIO_ROOT_PASSWORD=${secret(24)}

# Keycloak (non utilisé par défaut)
KEYCLOAK_ENABLED=false
KEYCLOAK_ADMIN_PASSWORD=${secret(24)}

# Commandes non confirmées annulées après ce délai (heures, 0 = jamais)
ORDER_PENDING_TTL_HOURS=48
`;

fs.writeFileSync(target, content, { encoding: 'utf8', mode: 0o600 });
console.log(`.env créé pour https://${domain}`);
console.log('');
console.log('Mot de passe de l\'Espace Gérance (notez-le maintenant, il ne sera plus affiché) :');
console.log(`  ${adminPassword}`);
console.log('');
console.log('Étape suivante : docker compose --profile https up -d --build');
