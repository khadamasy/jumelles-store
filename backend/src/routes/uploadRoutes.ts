import { Router } from 'express';
import { upload, uploadProductImage } from '../controllers/uploadController';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Upload d'image vers MinIO (accessible aux administrateurs)
router.post(
  '/product-image',
  requireAuth,
  requireRole('ROLE_ADMIN'),
  upload.single('image'),
  uploadProductImage
);

export default router;

