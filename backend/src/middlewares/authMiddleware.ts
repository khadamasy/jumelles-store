import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getKey } from '../config/keycloak';

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

/**
 * Middleware pour valider les tokens JWT Keycloak
 */
export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Accès non autorisé : Token Bearer manquant.',
    });
  }

  const token = authHeader.split(' ')[1];

  // Mode développement / Démo si Keycloak n'est pas encore démarré localement
  if (process.env.NODE_ENV !== 'production' && token.startsWith('demo-token-')) {
    const role = token.includes('admin') ? 'ROLE_ADMIN' : 'ROLE_CLIENT';
    req.user = {
      sub: 'demo-user-id',
      email: role === 'ROLE_ADMIN' ? 'admin@jumelles.com' : 'client@jumelles.com',
      name: role === 'ROLE_ADMIN' ? 'Directrice Jumelles' : 'Client Démo',
      realm_access: { roles: [role] },
    };
    return next();
  }

  jwt.verify(
    token,
    getKey,
    {
      algorithms: ['RS256'],
    },
    (err, decoded) => {
      if (err) {
        // Décodage de secours strictement restreint au développement local
        if (process.env.NODE_ENV !== 'production') {
          try {
            const fallbackDecoded = jwt.decode(token) as AuthenticatedUser;
            if (fallbackDecoded && fallbackDecoded.sub) {
              req.user = fallbackDecoded;
              return next();
            }
          } catch (e) {
            // ignore
          }
        }

        return res.status(401).json({
          success: false,
          message: 'Session expirée ou Token JWT invalide.',
          error: process.env.NODE_ENV === 'production' ? undefined : err.message,
        });
      }

      req.user = decoded as AuthenticatedUser;
      next();
    }
  );
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
        message: `Accès refusé : Le rôle [${role}] est requis pour effectuer cette action.`,
      });
    }

    next();
  };
};

