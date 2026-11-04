import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_ISSUER, ADMIN_SESSION_DURATION, verifyAdminPassword } from '../config/security';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

/**
 * Connexion de la gérance par mot de passe (défini dans backend/.env : ADMIN_PASSWORD)
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

  console.info(`[SÉCURITÉ] Connexion gérance réussie depuis ${req.ip}`);

  res.json({
    success: true,
    data: {
      token,
      user: { id: user.sub, email: user.email, name: user.name, roles: user.realm_access.roles },
    },
  });
};

/** Vérification de la validité de la session courante */
export const me = (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: req.user });
};

