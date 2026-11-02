import { Router } from 'express';
import {
  getProducts,
  getProductByIdOrSlug,
  getAvailableShoeSizes,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Routes publiques
router.get('/', getProducts);
router.get('/shoe-sizes', getAvailableShoeSizes);
router.get('/:idOrSlug', getProductByIdOrSlug);

// Routes sécurisées Administrateur
router.post('/', requireAuth, requireRole('ROLE_ADMIN'), createProduct);
router.put('/:id', requireAuth, requireRole('ROLE_ADMIN'), updateProduct);
router.delete('/:id', requireAuth, requireRole('ROLE_ADMIN'), deleteProduct);

export default router;
