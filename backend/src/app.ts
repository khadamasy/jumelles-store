import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import categoryRoutes from './routes/categoryRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import paymentRoutes from './routes/paymentRoutes';
import uploadRoutes from './routes/uploadRoutes';

const app: Application = express();

// Middlewares globaux
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Route de Santé (Health check)
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'UP',
    name: 'Jumelles Store API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    services: {
      database: 'PostgreSQL',
      auth: 'Keycloak',
      storage: 'MinIO',
      payments: ['Wave', 'Orange Money'],
    },
  });
});

// Enregistrement des routes API
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);

// Gestionnaire 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route [${req.method}] ${req.originalUrl} introuvable sur le serveur Jumelles Store.`,
  });
});

// Middleware global de traitement d'erreurs
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Erreur Serveur Global]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Une erreur interne est survenue sur le serveur.',
  });
});

export default app;
