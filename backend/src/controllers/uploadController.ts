import { Request, Response } from 'express';
import multer from 'multer';
import { randomUUID as uuidv4 } from 'crypto';
import { putProductImage, BUCKET_PRODUCTS, isMinioConfigured } from '../config/minio';

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp'];

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 5 }, // 5 Mo max, 1 fichier
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIMES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(Object.assign(new Error('Format non pris en charge. Formats acceptés : JPEG, PNG, WEBP.'), { status: 400 }));
    }
  },
});

/**
 * Détection du vrai type de fichier par sa signature binaire (« magic bytes »),
 * le type MIME envoyé par le navigateur pouvant être falsifié.
 */
const detectImageType = (buf: Buffer): { ext: string; mime: string } | null => {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { ext: '.jpg', mime: 'image/jpeg' };
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { ext: '.png', mime: 'image/png' };
  }
  if (buf.subarray(0, 4).toString('ascii') === 'RIFF' && buf.subarray(8, 12).toString('ascii') === 'WEBP') {
    return { ext: '.webp', mime: 'image/webp' };
  }
  return null;
};

export const uploadProductImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Aucun fichier image fourni.' });
    }

    const file = req.file;
    const detected = detectImageType(file.buffer);
    if (!detected) {
      return res.status(400).json({ success: false, message: 'Le fichier n\'est pas une image valide (JPEG, PNG, WEBP).' });
    }

    // Nom de fichier entièrement généré côté serveur (le nom d'origine est ignoré)
    const filename = `product-${uuidv4()}${detected.ext}`;

    if (!isMinioConfigured) {
      return res.status(503).json({
        success: false,
        message: 'Stockage MinIO non configuré. Sélectionnez un visuel existant dans la galerie.',
      });
    }

    try {
      await putProductImage(filename, file.buffer, detected.mime);

      // Par défaut : chemin relatif servi par Nginx / Vite sur le même domaine que le site.
      // MINIO_PUBLIC_URL permet de pointer vers un CDN ou un domaine dédié aux photos.
      const publicBase = (process.env.MINIO_PUBLIC_URL || '').replace(/\/$/, '');
      const minioUrl = `${publicBase}/${BUCKET_PRODUCTS}/${filename}`;

      return res.status(201).json({
        success: true,
        message: 'Image téléversée avec succès.',
        data: { filename, url: minioUrl, size: file.size, mimetype: detected.mime },
      });
    } catch (minioErr: any) {
      console.error(`[MinIO] Échec du téléversement : ${minioErr.message}`);
      return res.status(503).json({
        success: false,
        message: 'Stockage des images momentanément indisponible. Choisissez un visuel existant ou réessayez.',
      });
    }
  } catch (error) {
    console.error('[upload]', error);
    res.status(500).json({ success: false, message: 'Erreur lors du téléversement.' });
  }
};
