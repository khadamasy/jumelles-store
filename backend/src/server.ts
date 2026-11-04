import app from './app';
import dotenv from 'dotenv';
import { initMinioBuckets } from './config/minio';
import { initDatabase } from './config/db';

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`=======================================================`);
  console.log(`🚀 API JUMELLES STORE DÉMARRÉE SUR LE PORT : ${PORT}`);
  console.log(`📍 Endpoint de santé : http://localhost:${PORT}/health`);
  console.log(`🛍️ Produits API    : http://localhost:${PORT}/api/products`);
  console.log(`📦 Commandes API   : http://localhost:${PORT}/api/orders`);
  console.log(`=======================================================`);

  // Initialisation de la base de données (PostgreSQL + persistance disque)
  await initDatabase();

  // Initialisation asynchrone des buckets MinIO
  await initMinioBuckets();
});
