import { Router } from 'express';
import { adminLogin, adminLogout, me } from '../controllers/authController';
import { requireAuth } from '../middlewares/authMiddleware';
import { rateLimit } from '../middlewares/security';

const router = Router();

// Anti brute-force : 5 tentatives par 15 minutes et par adresse IP
const loginLimiter = rateLimit({
  name: 'admin-login',
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.',
});

router.post('/admin/login', loginLimiter, adminLogin);
router.post('/logout', adminLogout);
router.get('/me', requireAuth, me);

export default router;
