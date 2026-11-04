import { Client } from 'minio';
import dotenv from 'dotenv';

dotenv.config();

const endPoint = process.env.MINIO_ENDPOINT || 'localhost';
const port = parseInt(process.env.MINIO_PORT || '9000', 10);
const useSSL = process.env.MINIO_USE_SSL === 'true';
const accessKey = process.env.MINIO_ACCESS_KEY || '';
const secretKey = process.env.MINIO_SECRET_KEY || '';

export const isMinioConfigured = Boolean(accessKey && secretKey);

export const minioClient = isMinioConfigured
  ? new Client({
      endPoint,
      port,
      useSSL,
      accessKey,
      secretKey,
    })
  : (null as unknown as Client);

export const BUCKET_PRODUCTS = process.env.MINIO_BUCKET_PRODUCTS || 'jumelles-products';
export const BUCKET_INVOICES = process.env.MINIO_BUCKET_INVOICES || 'jumelles-invoices';

export async function initMinioBuckets() {
  if (!isMinioConfigured) {
    console.info('[MinIO] MINIO_ACCESS_KEY / MINIO_SECRET_KEY non définis : stockage S3 désactivé.');
    return;
  }
  try {
    const productsExists = await minioClient.bucketExists(BUCKET_PRODUCTS);
    if (!productsExists) {
      await minioClient.makeBucket(BUCKET_PRODUCTS, 'us-east-1');
      console.log(`[MinIO] Bucket '${BUCKET_PRODUCTS}' créé avec succès.`);
    }

    const invoicesExists = await minioClient.bucketExists(BUCKET_INVOICES);
    if (!invoicesExists) {
      await minioClient.makeBucket(BUCKET_INVOICES, 'us-east-1');
      console.log(`[MinIO] Bucket '${BUCKET_INVOICES}' créé avec succès.`);
    }
  } catch (error: any) {
    console.warn(`[MinIO] Connexion au serveur MinIO non disponible immédiatement: ${error.message}`);
  }
}
