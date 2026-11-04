import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_ISSUER, ADMIN_SESSION_DURATION, verifyAdminPassword } from '../config/security';
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

/**
 * Connexion de la gérance par mot de passe (défini dans backend/.env : ADMIN_PASSWORD).
 * Le jeton de session est transmis EXCLUSIVEMENT dans un cookie HttpOnly (invisible au JavaScript
 * et absent de localStorage / sessionStorage / réponse JSON).
 */
export const adminLogin = (req: Request, res: Response) => {
  const { password } = req.body || {};

  if (!verifyAdminPassword(password)) {
    console.warn(`[SÉCURITÉ] Échec de connexion gérance depuis ${req.ip} à ${new Date().toISOString()}`);
    return res.status(401).json({ success: false, message: 'Mot de passe incorrect.' });
  }

  const user = {
    sub: 'admin-jumelles',
    email: 'gerance@jumelles.sn',
    name: 'Gérance Jumelles Store',
    realm_access: { roles: ['ROLE_ADMIN'] },
  };

  const token = jwt.sign(user, JWT_SECRET, {
    algorithm: 'HS256',
    issuer: JWT_ISSUER,
    expiresIn: ADMIN_SESSION_DURATION,
  });

  res.setHeader('Set-Cookie', buildCookieHeader(token, MAX_AGE_SECONDS));
  console.info(`[SÉCURITÉ] Connexion gérance réussie depuis ${req.ip}`);

  res.json({
    success: true,
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
