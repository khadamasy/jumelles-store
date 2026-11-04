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
  res.setHeader('Cache-Control', 'no-store');
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

export const rateLimit = (options: { windowMs: number; max: number; message: string; name: string }) => {
  const buckets = new Map<string, Bucket>();

  // Nettoyage périodique pour éviter toute fuite mémoire
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
  }, Math.max(options.windowMs, 60_000)).unref();

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `${options.name}:${ip}`;
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

/** URL d'image autorisée : chemin local /products/... ou http(s) */
export const isSafeImageUrl = (v: unknown): v is string => {
  if (typeof v !== 'string' || v.length > 1000) return false;
  if (/^\/[a-zA-Z0-9/_\-.]+$/.test(v) && !v.includes('..')) return true;
  try {
    const u = new URL(v);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
};

