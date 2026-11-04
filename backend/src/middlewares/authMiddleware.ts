import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_ISSUER, getCredentialsVersion } from '../config/security';
import { SESSION_COOKIE_NAME } from '../controllers/authController';

export interface AuthenticatedUser {
  sub: string;
  email?: string;
  name?: string;
  preferred_username?: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: Record<string, { roles: string[] }>;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

const unauthorized = (res: Response, message = 'Session expirée ou non authentifiée.') =>
  res.status(401).json({ success: false, message });

/** Extrait un cookie par son nom depuis l'en-tête Cookie */
const readCookie = (req: Request, name: string): string | null => {
  const raw = req.headers.cookie;
  if (!raw) return null;
  for (const part of raw.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    if (k === name) {
      try {
        return decodeURIComponent(part.slice(idx + 1).trim());
      } catch {
        return null;
      }
    }
  }
  return null;
};

/**
 * Middleware d'authentification : cookie HttpOnly `jumelles_session` uniquement
 * (aucun jeton exposé dans le navigateur), avec l'en-tête anti-CSRF
 * `X-Requested-With: JumellesStore` exigé sur les requêtes mutatives.
 */
export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const cookieToken = readCookie(req, SESSION_COOKIE_NAME);

  if (cookieToken) {
    // Défense anti-CSRF en complément de SameSite=Strict
    const isMutating = !['GET', 'HEAD', 'OPTIONS'].includes(req.method.toUpperCase());
    if (isMutating && req.headers['x-requested-with'] !== 'JumellesStore') {
      return res.status(403).json({ success: false, message: 'Requête rejetée (protection CSRF).' });
    }

    try {
      const payload = jwt.verify(cookieToken, JWT_SECRET, {
        algorithms: ['HS256'],
        issuer: JWT_ISSUER,
      }) as AuthenticatedUser & { cv?: string };
      // Session ouverte avec un ancien mot de passe : refusée
      if (payload.cv !== getCredentialsVersion()) return unauthorized(res);
      req.user = payload;
      return next();
    } catch {
      return unauthorized(res);
    }
  }

  return unauthorized(res, 'Accès non autorisé : authentification requise.');
};

/**
 * Middleware pour vérifier un rôle spécifique (ex: 'ROLE_ADMIN')
 */
export const requireRole = (role: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Non authentifié.' });
    }

    const rawRoles = req.user.realm_access?.roles;
    const roles = Array.isArray(rawRoles) ? rawRoles : [];
    if (!roles.some((r) => typeof r === 'string' && r === role)) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé : droits insuffisants.',
      });
    }

    next();
  };
};
