import { Router } from 'express';
import {
  createOrder,
  getOrderByIdOrNumber,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
} from '../controllers/orderController';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Création d'une commande (ouvert aux clients invités et connectés)
router.post('/', createOrder);

// Suivi client de commandes
router.get('/my-orders', getMyOrders);
router.get('/:idOrNumber', getOrderByIdOrNumber);

// Routes Back-Office Administrateur
router.get('/admin/all', requireAuth, requireRole('ROLE_ADMIN'), getAllOrders);
router.get('/admin/dashboard-stats', requireAuth, requireRole('ROLE_ADMIN'), getDashboardStats);
router.patch('/admin/:id/status', requireAuth, requireRole('ROLE_ADMIN'), updateOrderStatus);

export default router;
