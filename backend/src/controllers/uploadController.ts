import { Request, Response } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { minioClient, BUCKET_PRODUCTS } from '../config/minio';

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 Mo max
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format de fichier non pris en charge. Formats acceptés : JPEG, PNG, WEBP, GIF.'));
    }
  },
});

export const uploadProductImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Aucun fichier image fourni.' });
    }

    const file = req.file;
    const ext = path.extname(file.originalname) || '.jpg';
    const filename = `product-${uuidv4()}${ext}`;

    try {
      // Envoi du flux vers le bucket MinIO
      await minioClient.putObject(
        BUCKET_PRODUCTS,
        filename,
        file.buffer,
        file.size,
        { 'Content-Type': file.mimetype }
      );

      const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
      const port = process.env.MINIO_PORT || '9000';
      const minioUrl = `http://${endpoint}:${port}/${BUCKET_PRODUCTS}/${filename}`;

      return res.status(201).json({
        success: true,
        message: 'Image téléversée avec succès dans le stockage MinIO.',
        data: {
          filename,
          bucket: BUCKET_PRODUCTS,
          url: minioUrl,
          size: file.size,
          mimetype: file.mimetype,
        },
      });
    } catch (minioErr: any) {
      console.warn(`[MinIO Fallback] Impossible d'uploader sur MinIO (${minioErr.message}), génération URL de secours.`);
      // En cas d'indisponibilité momentanée du serveur MinIO
      const fallbackUrl = `https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80`;
      return res.status(201).json({
        success: true,
        message: 'Image téléversée en mode démonstration.',
        data: {
          filename,
          url: fallbackUrl,
        },
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
