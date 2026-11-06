import app from './app';
import dotenv from 'dotenv';
import { initMinioBuckets } from './config/minio';
import { initDatabase } from './config/db';
import { startPendingOrderExpiry } from './controllers/orderController';

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;

const start = async () => {
  // Les données (PostgreSQL ou snapshot disque) sont chargées AVANT d'accepter la moindre requête :
  // sinon une commande reçue pendant le démarrage serait enregistrée sur le catalogue de
  // démonstration, qui écraserait ensuite le vrai catalogue dans PostgreSQL.
  await initDatabase();

  // Annulation automatique des commandes jamais confirmées (libère le stock)
  startPendingOrderExpiry();

  // Buckets MinIO : non bloquant (les photos existantes restent servies par Nginx)
  void initMinioBuckets();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🚀 API JUMELLES STORE DÉMARRÉE SUR LE PORT : ${PORT}`);
    console.log(`📍 Endpoint de santé : http://localhost:${PORT}/health`);
    console.log(`🛍️ Produits API    : http://localhost:${PORT}/api/products`);
    console.log(`📦 Commandes API   : http://localhost:${PORT}/api/orders`);
    console.log(`=======================================================`);
  });
};

start().catch((err) => {
  console.error('[Démarrage] Échec de l\'initialisation du serveur :', err);
  process.exit(1);
});
