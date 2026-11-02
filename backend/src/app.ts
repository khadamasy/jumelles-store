import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import categoryRoutes from './routes/categoryRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import paymentRoutes from './routes/paymentRoutes';
import uploadRoutes from './routes/uploadRoutes';

const app: Application = express();

// Masquer la signature serveur Express (Security through obscurity)
app.disable('x-powered-by');

// En-têtes de sécurité HTTP (Défense en profondeur)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// Configuration CORS sécurisée
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Autoriser les requêtes sans origin (ex: Postman, curl, webhooks serveur à serveur)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Origine non autorisée par la politique de sécurité CORS.'));
      }
    },
    credentials: true,
  })
);

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

