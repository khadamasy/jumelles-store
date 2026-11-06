import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {
  JWT_SECRET,
  JWT_ISSUER,
  ADMIN_SESSION_DURATION,
  verifyAdminPassword,
  verifyAdminCredentials,
  saveAdminCredentials,
  getAdminAuthStatus,
  getCredentialsVersion,
  MIN_ADMIN_PASSWORD_LENGTH,
} from '../config/security';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export const SESSION_COOKIE_NAME = 'jumelles_session';
const MAX_AGE_SECONDS = 8 * 60 * 60; // 8 heures

/**
 * Strict par défaut (site et API sur le même domaine, cas Docker/Nginx).
 * COOKIE_SAME_SITE=None uniquement si l'API est hébergée sur un autre site que la boutique
 * (ex : boutique sur Vercel, API sur Render) ; la protection CSRF X-Requested-With reste active.
 */
const COOKIE_SAME_SITE = ((): 'Strict' | 'Lax' | 'None' => {
  const v = (process.env.COOKIE_SAME_SITE || '').trim().toLowerCase();
  if (v === 'none') return 'None';
  if (v === 'lax') return 'Lax';
  return 'Strict';
})();

const buildCookieHeader = (value: string, maxAge: number): string => {
  const parts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(value)}`,
    'HttpOnly',
    'Path=/api',
    `Max-Age=${maxAge}`,
    `SameSite=${COOKIE_SAME_SITE}`,
  ];
  // SameSite=None exige Secure (navigateurs modernes)
  if (process.env.NODE_ENV === 'production' || COOKIE_SAME_SITE === 'None') {
    parts.push('Secure');
  }
  return parts.join('; ');
};

/** Jeton de session lié à la version courante des identifiants (révoqué si le mot de passe change) */
const signAdminSession = (user: object): string =>
  jwt.sign({ ...user, cv: getCredentialsVersion() }, JWT_SECRET, {
    algorithm: 'HS256',
    issuer: JWT_ISSUER,
    expiresIn: ADMIN_SESSION_DURATION,
  });

/** Indique si l'administrateur a déjà défini son email et son mot de passe */
export const adminAuthStatus = (_req: Request, res: Response) => {
  const status = getAdminAuthStatus();
  res.json({
    success: true,
    data: {
      configured: status.configured,
    },
  });
};

/**
 * Connexion de la gérance par Email et Mot de passe définis par l'administrateur.
 * Le jeton de session est transmis EXCLUSIVEMENT dans un cookie HttpOnly (invisible au JavaScript
 * et absent de localStorage / sessionStorage / réponse JSON).
 */
export const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body || {};

  // Email ET mot de passe obligatoires (l'ancien chemin « mot de passe seul » ignorait l'email
  // choisi par l'administrateur et affaiblissait la connexion)
  let check: Awaited<ReturnType<typeof verifyAdminCredentials>>;
  try {
    check = await verifyAdminCredentials(email, password);
  } catch (err) {
    console.error("[adminLogin]", err);
    return res.status(500).json({ success: false, message: "Connexion momentanément impossible." });
  }
  if (!check.valid) {
    const shownEmail = typeof email === 'string' ? email.slice(0, 100) : '';
    console.warn(`[SÉCURITÉ] Échec de connexion gérance (${shownEmail}) depuis ${req.ip} à ${new Date().toISOString()}`);
    return res.status(401).json({
      success: false,
      message: check.message || 'Email ou mot de passe administrateur incorrect.',
    });
  }
  const adminEmail = check.email;
  const firstSetup = !!check.firstSetup;

  const user = {
    sub: 'admin-jumelles',
    email: adminEmail,
    name: 'Gérance Jumelles Store',
    realm_access: { roles: ['ROLE_ADMIN'] },
  };

  const token = signAdminSession(user);

  res.setHeader('Set-Cookie', buildCookieHeader(token, MAX_AGE_SECONDS));
  console.info(`[SÉCURITÉ] Connexion gérance réussie (${adminEmail}) depuis ${req.ip}`);

  res.json({
    success: true,
    firstSetup,
    data: {
      user: { id: user.sub, email: user.email, name: user.name, roles: user.realm_access.roles },
    },
  });
};

/** Permet à l'administrateur connecté de modifier son Email et son Mot de passe */
export const updateAdminCredentials = async (req: AuthenticatedRequest, res: Response) => {
  const { email, password, currentPassword } = req.body || {};
  if (!(await verifyAdminPassword(currentPassword))) {
    console.warn(`[SÉCURITÉ] Changement d'identifiants refusé (mot de passe actuel incorrect) depuis ${req.ip}`);
    return res.status(403).json({
      success: false,
      message: 'Mot de passe actuel incorrect.',
    });
  }
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({
      success: false,
      message: 'Veuillez saisir une adresse email valide.',
    });
  }
  if (typeof password !== 'string' || password.length < MIN_ADMIN_PASSWORD_LENGTH || password.length > 200) {
    return res.status(400).json({
      success: false,
      message: `Le nouveau mot de passe doit contenir au moins ${MIN_ADMIN_PASSWORD_LENGTH} caractères.`,
    });
  }

  try {
    await saveAdminCredentials(cleanEmail, password);
  } catch (err) {
    console.error("[updateAdminCredentials]", err);
    return res.status(500).json({ success: false, message: "Enregistrement des identifiants impossible." });
  }

  const user = {
    sub: 'admin-jumelles',
    email: cleanEmail,
    name: 'Gérance Jumelles Store',
    realm_access: { roles: ['ROLE_ADMIN'] },
  };

  const token = signAdminSession(user);

  res.setHeader('Set-Cookie', buildCookieHeader(token, MAX_AGE_SECONDS));

  res.json({
    success: true,
    message: 'Identifiants enregistrés. Les autres sessions ouvertes ont été déconnectées.',
    data: {
      user: { id: user.sub, email: user.email, name: user.name, roles: user.realm_access.roles },
    },
  });
};

/** Déconnexion : efface le cookie HttpOnly côté serveur */
export const adminLogout = (_req: Request, res: Response) => {
  res.setHeader('Set-Cookie', buildCookieHeader('', 0));
  res.json({ success: true, message: 'Session fermée.' });
};

/** Vérification de la validité de la session courante */
export const me = (req: AuthenticatedRequest, res: Response) => {
  const u = req.user;
  if (!u) return res.status(401).json({ success: false, message: 'Non authentifié.' });
  res.json({
    success: true,
    data: {
      user: {
        id: u.sub,
        email: u.email || '',
        name: u.name || 'Gérance',
        roles: u.realm_access?.roles || [],
      },
    },
  });
};
