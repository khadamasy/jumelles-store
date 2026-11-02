import { Router } from 'express';
import {
  getPhoneInfo,
  requestCallback,
  getCallbacks,
  updateCallbackStatus,
} from '../controllers/phoneController';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Routes publiques pour les clients
router.get('/info', getPhoneInfo);
router.post('/callback-request', requestCallback);

// Routes sécurisées pour l'administrateur
router.get('/admin/callbacks', requireAuth, requireRole('ROLE_ADMIN'), getCallbacks);
router.patch('/admin/callbacks/:id/status', requireAuth, requireRole('ROLE_ADMIN'), updateCallbackStatus);

export default router;
