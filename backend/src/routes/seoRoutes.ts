import { Router, Request, Response } from 'express';
import { memoryStore } from '../config/db';

/**
 * robots.txt et sitemap.xml générés à partir du catalogue réel
 * (les nouveaux articles apparaissent automatiquement dans le sitemap).
 */
const router = Router();

const siteUrl = (req: Request) =>
  (process.env.SITE_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');

const escapeXml = (v: string) =>
  v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const STATIC_PAGES = ['/', '/catalog', '/faq-livraison', '/conditions-utilisation', '/politique-confidentialite'];

router.get('/robots.txt', (req: Request, res: Response) => {
  res.type('text/plain').setHeader('Cache-Control', 'public, max-age=3600');
  res.send(
    ['User-agent: *', 'Allow: /', 'Disallow: /admin', 'Disallow: /checkout', 'Disallow: /orders', 'Disallow: /api/', '', `Sitemap: ${siteUrl(req)}/sitemap.xml`, ''].join('\n')
  );
});

router.get('/sitemap.xml', (req: Request, res: Response) => {
  const base = siteUrl(req);
  const urls = [
    ...STATIC_PAGES.map((p) => `${base}${p}`),
    ...memoryStore.products.filter((p) => p.isActive).map((p) => `${base}/product/${encodeURIComponent(p.slug)}`),
  ];
  res.type('application/xml').setHeader('Cache-Control', 'public, max-age=3600');
  res.send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      urls.map((u) => `  <url><loc>${escapeXml(u)}</loc></url>`).join('\n') +
      `\n</urlset>\n`
  );
});

export default router;
