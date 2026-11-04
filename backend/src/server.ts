import app from './app';
import dotenv from 'dotenv';
import { initMinioBuckets } from './config/minio';
import { initDatabase } from './config/db';
import { expireStalePendingOrders } from './controllers/orderController';
import { isNotifierConfigured } from './services/notifier';

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

  // Annulation automatique des commandes non confirmées (au démarrage puis toutes les 15 minutes)
  const runExpiry = () =>
    expireStalePendingOrders().catch((err) => console.error('[Commandes] Échec de l\'annulation automatique', err));
  await runExpiry();
  setInterval(runExpiry, 15 * 60 * 1000).unref();

  console.info(
    isNotifierConfigured()
      ? '[Notification] Alertes Telegram actives pour les nouvelles commandes.'
      : '[Notification] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID non définis : pas d\'alerte de nouvelle commande.'
  );
});
