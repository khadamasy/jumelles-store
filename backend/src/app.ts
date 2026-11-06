import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
import './config/security';
import categoryRoutes from './routes/categoryRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import uploadRoutes from './routes/uploadRoutes';
import phoneRoutes from './routes/phoneRoutes';
import authRoutes from './routes/authRoutes';
import { securityHeaders, rateLimit } from './middlewares/security';
import { memoryStore } from './config/db';

const app: Application = express();
const isProduction = process.env.NODE_ENV === 'production';

// Masquer la signature serveur Express
app.disable('x-powered-by');

// Derrière un reverse-proxy (Nginx, Vercel, Render...) pour obtenir la vraie IP client
if (process.env.TRUST_PROXY) {
  app.set('trust proxy', process.env.TRUST_PROXY === 'true' ? 1 : process.env.TRUST_PROXY);
}

// En-têtes de sécurité HTTP
app.use(securityHeaders);

// Configuration CORS stricte
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
  : ['http://localhost:3001', 'http://127.0.0.1:3001'];

// En développement : autoriser uniquement le poste local et le réseau Wi-Fi privé (test mobile)
const isPrivateNetworkOrigin = (origin: string) =>
  /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?$/.test(origin);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || (!isProduction && isPrivateNetworkOrigin(origin))) {
        callback(null, true);
      } else {
        callback(Object.assign(new Error('Origine non autorisée.'), { status: 403 }));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 600,
  })
);

// Taille des requêtes limitée (les images passent par multipart, pas par JSON)
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));

// Limite globale anti-abus : 300 requêtes / 15 min / IP
app.use(
  '/api',
  rateLimit({
    name: 'global',
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: 'Trop de requêtes. Merci de patienter quelques minutes.',
  })
);

// Route de santé (sans divulgation de l'infrastructure)
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Plan du site pour Google (articles actifs), servi par Nginx sous /sitemap.xml
const escapeXml = (v: string) =>
  v.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c] as string));

app.get('/sitemap.xml', (req: Request, res: Response) => {
  const base = (process.env.PUBLIC_SITE_URL || 'https://jumelles-store.sn').replace(/\/$/, '');
  const staticPaths = ['/', '/catalog', '/faq-livraison', '/conditions-utilisation', '/politique-confidentialite'];
  const urls = [
    ...staticPaths.map((p) => `  <url><loc>${escapeXml(base + p)}</loc></url>`),
    ...memoryStore.products
      .filter((p) => p.isActive)
      .map((p) => `  <url><loc>${escapeXml(`${base}/product/${encodeURIComponent(p.slug)}`)}</loc></url>`),
  ];
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
});

// robots.txt généré avec le vrai domaine (PUBLIC_SITE_URL), servi par Nginx sous /robots.txt
app.get('/robots.txt', (req: Request, res: Response) => {
  const base = (process.env.PUBLIC_SITE_URL || 'https://jumelles-store.sn').replace(/\/$/, '');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${base}/sitemap.xml\n`);
});

// Enregistrement des routes API
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/phone', phoneRoutes);

// Gestionnaire 404 (sans réécho de l'URL demandée)
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Ressource introuvable.' });
});

// Middleware global de traitement d'erreurs (aucune fuite de détails internes)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = Number(err.status || err.statusCode) || 500;
  if (status >= 500) console.error('[Erreur Serveur]', err);

  let message = 'Une erreur interne est survenue.';
  if (err.type === 'entity.too.large') message = 'Requête trop volumineuse.';
  else if (err.type === 'entity.parse.failed') message = 'Requête JSON invalide.';
  else if (err.code === 'LIMIT_FILE_SIZE') message = 'Fichier trop volumineux (5 Mo maximum).';
  else if (status < 500 && err.message) message = err.message;

  res.status(err.code === 'LIMIT_FILE_SIZE' ? 413 : status).json({ success: false, message });
});

export default app;
