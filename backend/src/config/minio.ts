import {
  S3Client,
  HeadBucketCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Stockage des photos sur MinIO via le client S3 officiel d'AWS (compatible MinIO).
 * Il remplace le SDK « minio », dont les dépendances comportaient des failles connues non corrigées.
 */
const endPoint = process.env.MINIO_ENDPOINT || 'localhost';
const port = parseInt(process.env.MINIO_PORT || '9000', 10);
const useSSL = process.env.MINIO_USE_SSL === 'true';
const accessKey = process.env.MINIO_ACCESS_KEY || '';
const secretKey = process.env.MINIO_SECRET_KEY || '';

export const isMinioConfigured = Boolean(accessKey && secretKey);

const s3 = isMinioConfigured
  ? new S3Client({
      endpoint: `${useSSL ? 'https' : 'http'}://${endPoint}:${port}`,
      region: process.env.MINIO_REGION || 'us-east-1',
      credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
      // MinIO : adresses de type http://minio:9000/bucket/objet (pas de sous-domaine par bucket)
      forcePathStyle: true,
    })
  : null;

export const BUCKET_PRODUCTS = process.env.MINIO_BUCKET_PRODUCTS || 'jumelles-products';
export const BUCKET_INVOICES = process.env.MINIO_BUCKET_INVOICES || 'jumelles-invoices';

const ensureBucket = async (client: S3Client, bucket: string) => {
  try {
    await client.send(new HeadBucketCommand({ Bucket: bucket }));
  } catch (err: any) {
    if (err?.$metadata?.httpStatusCode !== 404 && err?.name !== 'NotFound') throw err;
    await client.send(new CreateBucketCommand({ Bucket: bucket }));
    console.log(`[MinIO] Bucket '${bucket}' créé avec succès.`);
  }
};

export async function initMinioBuckets() {
  if (!s3) {
    console.info('[MinIO] MINIO_ACCESS_KEY / MINIO_SECRET_KEY non définis : stockage S3 désactivé.');
    return;
  }
  try {
    await ensureBucket(s3, BUCKET_PRODUCTS);
    // Lecture publique des photos produits uniquement (pas de listing, pas d'écriture)
    await s3.send(
      new PutBucketPolicyCommand({
        Bucket: BUCKET_PRODUCTS,
        Policy: JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${BUCKET_PRODUCTS}/*`],
            },
          ],
        }),
      })
    );
    // Factures : bucket privé (aucune politique publique)
    await ensureBucket(s3, BUCKET_INVOICES);
  } catch (error: any) {
    console.warn(`[MinIO] Connexion au serveur MinIO non disponible immédiatement: ${error.message}`);
  }
}

/** Enregistre une photo produit (nom de fichier généré côté serveur, type vérifié par signature) */
export async function putProductImage(filename: string, body: Buffer, contentType: string): Promise<void> {
  if (!s3) throw new Error('Stockage MinIO non configuré');
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET_PRODUCTS,
      Key: filename,
      Body: body,
      ContentLength: body.length,
      ContentType: contentType,
      ContentDisposition: 'inline',
      // Empêche le navigateur de « deviner » un autre type (ex : HTML) à l'affichage
      Metadata: { 'x-content-type-options': 'nosniff' },
    })
  );
}
