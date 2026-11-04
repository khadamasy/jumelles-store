import { Router } from 'express';
import {
  getPhoneInfo,
  requestCallback,
  getCallbacks,
  updateCallbackStatus,
} from '../controllers/phoneController';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';
import { rateLimit } from '../middlewares/security';

const router = Router();

// Anti-spam des demandes de rappel : 5 par heure et par IP
const callbackLimiter = rateLimit({
  name: 'callback-request',
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Demande déjà enregistrée. Notre équipe vous rappelle très vite.',
});

// Routes publiques pour les clients
router.get('/info', getPhoneInfo);
router.post('/callback-request', callbackLimiter, requestCallback);

// Routes sécurisées pour l'administrateur
router.get('/admin/callbacks', requireAuth, requireRole('ROLE_ADMIN'), getCallbacks);
router.patch('/admin/callbacks/:id/status', requireAuth, requireRole('ROLE_ADMIN'), updateCallbackStatus);

export default router;
