import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getKey } from '../config/keycloak';
import { JWT_SECRET, JWT_ISSUER } from '../config/security';
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
 * Middleware d'authentification :
 * 1. Privilégie le cookie HttpOnly `jumelles_session` (aucun token exposé dans le navigateur)
 *    + exige l'en-tête anti-CSRF `X-Requested-With: JumellesStore` sur les requêtes mutatives.
 * 2. Accepte en second choix un jeton Keycloak RS256 signé via JWKS.
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
      }) as AuthenticatedUser;
      req.user = payload;
      return next();
    } catch {
      return unauthorized(res);
    }
  }

  // Fallback Keycloak OIDC (RS256 uniquement)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return unauthorized(res, 'Accès non autorisé : authentification requise.');
  }

  const token = authHeader.slice(7).trim();
  if (!token || token.length > 4096) return unauthorized(res);

  const decodedHeader = jwt.decode(token, { complete: true });
  if (!decodedHeader || typeof decodedHeader === 'string' || decodedHeader.header.alg !== 'RS256') {
    return unauthorized(res);
  }

  return jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err || !decoded || typeof decoded === 'string') return unauthorized(res);
    req.user = decoded as AuthenticatedUser;
    next();
  });
};

/**
 * Middleware pour vérifier un rôle spécifique (ex: 'ROLE_ADMIN')
 */
export const requireRole = (role: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Non authentifié.' });
    }

    const roles = req.user.realm_access?.roles || [];
    if (!roles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé : droits insuffisants.',
      });
    }

    next();
  };
};
