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
} from '../config/security';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export const SESSION_COOKIE_NAME = 'jumelles_session';
const MAX_AGE_SECONDS = 8 * 60 * 60; // 8 heures

const buildCookieHeader = (value: string, maxAge: number): string => {
  const parts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(value)}`,
    'HttpOnly',
    'Path=/api',
    `Max-Age=${maxAge}`,
    'SameSite=Strict',
  ];
  if (process.env.NODE_ENV === 'production') {
    parts.push('Secure');
  }
  return parts.join('; ');
};

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
export const adminLogin = (req: Request, res: Response) => {
  const { email, password } = req.body || {};

  let adminEmail = 'gerance@jumelles.sn';
  let firstSetup = false;

  if (typeof email === 'string' && email.trim().length > 0) {
    const check = verifyAdminCredentials(email, password);
    if (!check.valid) {
      console.warn(`[SÉCURITÉ] Échec de connexion gérance (${email}) depuis ${req.ip} à ${new Date().toISOString()}`);
      return res.status(401).json({
        success: false,
        message: check.message || 'Email ou mot de passe administrateur incorrect.',
      });
    }
    adminEmail = check.email;
    firstSetup = !!check.firstSetup;
  } else {
    // Rétrocompatibilité tests automatisés si seul password est envoyé
    if (!verifyAdminPassword(password)) {
      console.warn(`[SÉCURITÉ] Échec de connexion gérance depuis ${req.ip} à ${new Date().toISOString()}`);
      return res.status(401).json({ success: false, message: 'Mot de passe incorrect.' });
    }
    const status = getAdminAuthStatus();
    if (status.email) adminEmail = status.email;
  }

  const user = {
    sub: 'admin-jumelles',
    email: adminEmail,
    name: 'Gérance Jumelles Store',
    realm_access: { roles: ['ROLE_ADMIN'] },
  };

  const token = jwt.sign(user, JWT_SECRET, {
    algorithm: 'HS256',
    issuer: JWT_ISSUER,
    expiresIn: ADMIN_SESSION_DURATION,
  });

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
export const updateAdminCredentials = (req: AuthenticatedRequest, res: Response) => {
  const { email, password } = req.body || {};
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({
      success: false,
      message: 'Veuillez saisir une adresse email valide.',
    });
  }
  if (typeof password !== 'string' || password.length < 4 || password.length > 200) {
    return res.status(400).json({
      success: false,
      message: 'Veuillez saisir un nouveau mot de passe valide (4 caractères minimum).',
    });
  }

  saveAdminCredentials(cleanEmail, password);

  const user = {
    sub: 'admin-jumelles',
    email: cleanEmail,
    name: 'Gérance Jumelles Store',
    realm_access: { roles: ['ROLE_ADMIN'] },
  };

  const token = jwt.sign(user, JWT_SECRET, {
    algorithm: 'HS256',
    issuer: JWT_ISSUER,
    expiresIn: ADMIN_SESSION_DURATION,
  });

  res.setHeader('Set-Cookie', buildCookieHeader(token, MAX_AGE_SECONDS));

  res.json({
    success: true,
    message: 'Vos identifiants administrateur (Email et Mot de passe) ont été enregistrés.',
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
