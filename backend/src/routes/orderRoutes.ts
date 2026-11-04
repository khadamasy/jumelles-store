import { Router } from 'express';
import {
  createOrder,
  trackOrders,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
} from '../controllers/orderController';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';
import { rateLimit } from '../middlewares/security';

const router = Router();

// Anti-spam / anti-épuisement des stocks : 8 commandes par heure et par IP
const orderLimiter = rateLimit({
  name: 'create-order',
  windowMs: 60 * 60 * 1000,
  max: 8,
  message: 'Trop de commandes envoyées. Contactez-nous directement sur WhatsApp au +221 77 208 78 20.',
});

// Anti-énumération du suivi : 20 recherches par 15 minutes et par IP
const trackLimiter = rateLimit({
  name: 'track-order',
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Trop de recherches. Réessayez dans quelques minutes.',
});

// Création d'une commande (clientes invitées)
router.post('/', orderLimiter, createOrder);

// Suivi client : numéro de commande + téléphone obligatoires
router.get('/track', trackLimiter, trackOrders);

// Routes Back-Office Administrateur
router.get('/admin/all', requireAuth, requireRole('ROLE_ADMIN'), getAllOrders);
router.get('/admin/dashboard-stats', requireAuth, requireRole('ROLE_ADMIN'), getDashboardStats);
router.patch('/admin/:id/status', requireAuth, requireRole('ROLE_ADMIN'), updateOrderStatus);

export default router;
