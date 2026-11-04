import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
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
 * Mot de passe de la gérance (défini côté serveur uniquement dans backend/.env ou via configuration admin).
 */
const adminPassword = process.env.ADMIN_PASSWORD || '';
const adminEmailEnv = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();

if (adminPassword.length < 12) {
  const msg = '[SÉCURITÉ] ADMIN_PASSWORD absent ou trop court (12 caractères minimum) : connexion gérance désactivée.';
  if (isProduction) {
    console.error(msg + ' Arrêt du serveur.');
    process.exit(1);
  }
  console.warn(msg);
}

const ADMIN_AUTH_FILE = path.resolve(__dirname, '../../data/admin-auth.json');

interface StoredAdminCredentials {
  email: string;
  salt: string;
  passwordHash: string;
  updatedAt: string;
}

const readStoredAdminCredentials = (): StoredAdminCredentials | null => {
  try {
    if (!fs.existsSync(ADMIN_AUTH_FILE)) return null;
    const raw = fs.readFileSync(ADMIN_AUTH_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.email === 'string' &&
      typeof parsed.salt === 'string' &&
      typeof parsed.passwordHash === 'string'
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

export const saveAdminCredentials = (email: string, password: string): void => {
  const cleanEmail = email.trim().toLowerCase();
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256').toString('hex');
  const dir = path.dirname(ADMIN_AUTH_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const data: StoredAdminCredentials = {
    email: cleanEmail,
    salt,
    passwordHash,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(ADMIN_AUTH_FILE, JSON.stringify(data, null, 2), 'utf8');
};

export const getAdminAuthStatus = (): { configured: boolean; email: string } => {
  const stored = readStoredAdminCredentials();
  if (stored) {
    return { configured: true, email: stored.email };
  }
  if (adminEmailEnv) {
    return { configured: true, email: adminEmailEnv };
  }
  return { configured: false, email: '' };
};

/** Comparaison en temps constant (anti attaque temporelle) */
export const verifyAdminPassword = (candidate: unknown): boolean => {
  if (typeof candidate !== 'string' || candidate.length === 0 || candidate.length > 200) return false;

  const stored = readStoredAdminCredentials();
  if (stored) {
    const derived = crypto.pbkdf2Sync(candidate, stored.salt, 100000, 32, 'sha256');
    const expected = Buffer.from(stored.passwordHash, 'hex');
    if (derived.length === expected.length && crypto.timingSafeEqual(derived, expected)) {
      return true;
    }
  }

  if (adminPassword.length < 12) return false;
  const candidateHash = crypto.createHash('sha256').update(candidate).digest();
  const primaryHash = crypto.createHash('sha256').update(adminPassword).digest();
  return crypto.timingSafeEqual(candidateHash, primaryHash);
};

/**
 * Vérifie le couple (email + mot de passe) de l'administrateur.
 * Si aucun email/mot de passe personnalisé n'a encore été enregistré par l'administrateur
 * (en développement local), le premier couple (email + mot de passe) saisi par l'admin
 * est enregistré comme ses identifiants officiels.
 */
export const verifyAdminCredentials = (
  email: unknown,
  password: unknown
): { valid: boolean; email: string; firstSetup?: boolean; message?: string } => {
  if (typeof password !== 'string' || password.length < 4 || password.length > 200) {
    return { valid: false, email: '', message: 'Veuillez saisir un mot de passe valide (4 caractères minimum).' };
  }
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return { valid: false, email: '', message: 'Veuillez saisir une adresse email valide.' };
  }

  const stored = readStoredAdminCredentials();
  if (stored) {
    const emailHashA = crypto.createHash('sha256').update(cleanEmail).digest();
    const emailHashB = crypto.createHash('sha256').update(stored.email.toLowerCase()).digest();
    const emailMatches = crypto.timingSafeEqual(emailHashA, emailHashB);

    const derived = crypto.pbkdf2Sync(password, stored.salt, 100000, 32, 'sha256');
    const expected = Buffer.from(stored.passwordHash, 'hex');
    const passwordMatches = derived.length === expected.length && crypto.timingSafeEqual(derived, expected);

    if (emailMatches && passwordMatches) {
      return { valid: true, email: stored.email };
    }
    return { valid: false, email: '', message: 'Email ou mot de passe administrateur incorrect.' };
  }

  // En développement local, si aucun identifiant n'a encore été enregistré par l'admin :
  // enregistrer directement l'email et le mot de passe choisis par l'admin lors de sa première connexion.
  if (!isProduction && !adminEmailEnv) {
    saveAdminCredentials(cleanEmail, password);
    return { valid: true, email: cleanEmail, firstSetup: true };
  }

  // Sinon, vérifier par rapport à ADMIN_EMAIL et ADMIN_PASSWORD du fichier .env
  if (adminEmailEnv) {
    const emailHashA = crypto.createHash('sha256').update(cleanEmail).digest();
    const emailHashB = crypto.createHash('sha256').update(adminEmailEnv).digest();
    if (!crypto.timingSafeEqual(emailHashA, emailHashB)) {
      return { valid: false, email: '', message: 'Email ou mot de passe administrateur incorrect.' };
    }
  }

  if (verifyAdminPassword(password)) {
    return { valid: true, email: cleanEmail };
  }

  return { valid: false, email: '', message: 'Email ou mot de passe administrateur incorrect.' };
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
