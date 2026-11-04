import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getKey } from '../config/keycloak';
import { JWT_SECRET, JWT_ISSUER } from '../config/security';

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

const unauthorized = (res: Response, message = 'Session expirée ou jeton invalide.') =>
  res.status(401).json({ success: false, message });

/**
 * Middleware d'authentification.
 * Deux émetteurs acceptés, chacun avec un algorithme strictement imposé
 * (aucune confusion d'algorithme possible, aucun jeton non vérifié accepté) :
 *  - Sessions gérance émises par cette API (HS256 + issuer)
 *  - Jetons Keycloak (RS256 via JWKS)
 */
export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return unauthorized(res, 'Accès non autorisé : authentification requise.');
  }

  const token = authHeader.slice(7).trim();
  if (!token || token.length > 4096) return unauthorized(res);

  const decodedHeader = jwt.decode(token, { complete: true });
  if (!decodedHeader || typeof decodedHeader === 'string') return unauthorized(res);

  // 1. Session gérance locale
  if (decodedHeader.header.alg === 'HS256') {
    try {
      const payload = jwt.verify(token, JWT_SECRET, {
        algorithms: ['HS256'],
        issuer: JWT_ISSUER,
      }) as AuthenticatedUser;
      req.user = payload;
      return next();
    } catch {
      return unauthorized(res);
    }
  }

  // 2. Jeton Keycloak
  if (decodedHeader.header.alg === 'RS256') {
    return jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err || !decoded || typeof decoded === 'string') return unauthorized(res);
      req.user = decoded as AuthenticatedUser;
      next();
    });
  }

  return unauthorized(res);
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
