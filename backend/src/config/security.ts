import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Secret de signature des sessions administrateur.
 * - Production : JWT_SECRET obligatoire (>= 32 caractères), sinon arrêt du serveur.
 * - Développement : secret aléatoire généré au démarrage si absent (sessions perdues au redémarrage).
 */
const resolveJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (isProduction) {
    console.error('[SÉCURITÉ] JWT_SECRET manquant ou trop court (32 caractères minimum). Arrêt du serveur.');
    process.exit(1);
  }
  console.warn('[SÉCURITÉ] JWT_SECRET absent : secret temporaire généré (développement uniquement).');
  return crypto.randomBytes(48).toString('hex');
};

export const JWT_SECRET = resolveJwtSecret();
export const JWT_ISSUER = 'jumelles-store-api';
export const ADMIN_SESSION_DURATION = '8h';

/**
 * Mot de passe de la gérance (défini côté serveur uniquement dans backend/.env).
 */
const adminPassword = process.env.ADMIN_PASSWORD || '';
if (adminPassword.length < 12) {
  const msg = '[SÉCURITÉ] ADMIN_PASSWORD absent ou trop court (12 caractères minimum) : connexion gérance désactivée.';
  if (isProduction) {
    console.error(msg + ' Arrêt du serveur.');
    process.exit(1);
  }
  console.warn(msg);
}

/** Comparaison en temps constant (anti attaque temporelle) */
export const verifyAdminPassword = (candidate: unknown): boolean => {
  if (adminPassword.length < 12 || typeof candidate !== 'string' || candidate.length > 200) return false;
  const a = crypto.createHash('sha256').update(candidate).digest();
  const b = crypto.createHash('sha256').update(adminPassword).digest();
  return crypto.timingSafeEqual(a, b);
};

/** Avertissement si les identifiants MinIO par défaut sont utilisés en production */
if (isProduction && (!process.env.MINIO_SECRET_KEY || process.env.MINIO_SECRET_KEY === 'minioadmin_secure_2026')) {
  console.warn('[SÉCURITÉ] MINIO_SECRET_KEY par défaut détecté : changez-le avant la mise en ligne.');
}

