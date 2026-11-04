import { Request, Response, NextFunction } from 'express';

/**
 * En-têtes HTTP de sécurité (équivalent minimal de helmet, sans dépendance externe)
 */
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '0');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
  // L'API ne sert que du JSON : aucune ressource active autorisée
  res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
  const isPublicCatalogGet =
    req.method === 'GET' &&
    (req.path.startsWith('/api/products') || req.path.startsWith('/api/categories'));
  res.setHeader(
    'Cache-Control',
    isPublicCatalogGet ? 'public, max-age=60, stale-while-revalidate=120' : 'no-store'
  );
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
};

/**
 * Limiteur de débit en mémoire (anti brute-force / anti-spam / anti-épuisement des stocks)
 */
interface Bucket {
  count: number;
  resetAt: number;
}

export const rateLimit = (options: {
  windowMs: number;
  max: number;
  message: string;
  name: string;
  keySuffix?: (req: Request) => string;
  skipSuccessfulRequests?: boolean;
}) => {
  const buckets = new Map<string, Bucket>();

  // Nettoyage périodique pour éviter toute fuite mémoire
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
  }, Math.max(options.windowMs, 60_000)).unref();

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    const suffix = options.keySuffix ? `:${options.keySuffix(req)}` : '';
    const key = `${options.name}:${ip}${suffix}`;
    const now = Date.now();

    let bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + options.windowMs };
      buckets.set(key, bucket);
    }

    bucket.count += 1;
    const remaining = Math.max(0, options.max - bucket.count);
    res.setHeader('RateLimit-Limit', String(options.max));
    res.setHeader('RateLimit-Remaining', String(remaining));

    if (bucket.count > options.max) {
      res.setHeader('Retry-After', String(Math.ceil((bucket.resetAt - now) / 1000)));
      return res.status(429).json({ success: false, message: options.message });
    }

    if (options.skipSuccessfulRequests && typeof res.on === 'function') {
      res.on('finish', () => {
        if (res.statusCode < 400 && bucket && bucket.count > 0) {
          bucket.count -= 1;
        }
      });
    }

    next();
  };
};

/* ---------- Petits validateurs réutilisables ---------- */

export const isNonEmptyString = (v: unknown, max: number): v is string =>
  typeof v === 'string' && v.trim().length > 0 && v.trim().length <= max;

export const cleanText = (v: unknown, max: number): string =>
  typeof v === 'string'
    ? v
        .replace(/[\u0000-\u001F\u007F]/g, ' ')
        .replace(/[<>]/g, '')
        .trim()
        .slice(0, max)
    : '';

/** Numéro sénégalais / international : 8 à 15 chiffres (espaces, +, -, parenthèses tolérés) */
export const isValidPhone = (v: unknown): v is string => {
  if (typeof v !== 'string' || v.length > 25) return false;
  if (!/^[\d\s+\-().]+$/.test(v)) return false;
  const digits = v.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15;
};

/**
 * URL d'image autorisée :
 * - Chemin local relatif strict (/products/..., /uploads/...) sans "//" ni ".."
 * - Ou URL absolue appartenant exclusivement au domaine MinIO/CDN configuré (MINIO_PUBLIC_URL)
 */
export const isSafeImageUrl = (v: unknown): v is string => {
  if (typeof v !== 'string' || v.length < 2 || v.length > 500) return false;
  if (v.startsWith('//') || v.includes('..') || v.includes('\\')) return false;
  if (/^\/[a-zA-Z0-9][a-zA-Z0-9/_\-.]*$/.test(v)) return true;
  try {
    const u = new URL(v);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return false;
    const allowedBase = process.env.MINIO_PUBLIC_URL || 'http://localhost:9000';
    const allowedOrigin = new URL(allowedBase).origin;
    return u.origin === allowedOrigin;
  } catch {
    return false;
  }
};

