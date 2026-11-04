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
  const candidateHash = crypto.createHash('sha256').update(candidate).digest();
  const primaryHash = crypto.createHash('sha256').update(adminPassword).digest();
  if (crypto.timingSafeEqual(candidateHash, primaryHash)) {
    return true;
  }
  // En développement local uniquement (quand ADMIN_PASSWORD est la valeur locale Jumelles2026!),
  // accepter aussi "123456" et "jumelles" pour faciliter les tests de la gérance.
  if (!isProduction && adminPassword === 'Jumelles2026!') {
    for (const devAlias of ['123456', 'jumelles', 'admin123']) {
      const aliasHash = crypto.createHash('sha256').update(devAlias).digest();
      if (crypto.timingSafeEqual(candidateHash, aliasHash)) {
        return true;
      }
    }
  }
  return false;
};

/** Blocage en production si les identifiants MinIO sont absents, trop courts ou par défaut */
const minioAccess = process.env.MINIO_ACCESS_KEY || process.env.MINIO_ROOT_USER || '';
const minioSecret = process.env.MINIO_SECRET_KEY || process.env.MINIO_ROOT_PASSWORD || '';
if (
  isProduction &&
  (!minioSecret ||
    minioSecret.length < 16 ||
    minioSecret.toLowerCase().includes('minioadmin') ||
    minioAccess.toLowerCase() === 'minioadmin')
) {
  console.error(
    '[SÉCURITÉ] MINIO_SECRET_KEY absent, trop court (< 16 caractères) ou par défaut (minioadmin). Arrêt du serveur.'
  );
  process.exit(1);
}

