/**
 * Balises SEO / partage (WhatsApp, Facebook, Instagram) mises à jour à chaque page.
 * Les URLs d'image et canonique doivent être ABSOLUES : les aperçus de lien les ignorent sinon.
 */
const DEFAULT_DESCRIPTION =
  'Boutique de maroquinerie de luxe et chaussures élégantes pour femme à Dakar (Sénégal). Sacs à main prestige, mules et sandales, livraison rapide 24h à Dakar.';
const DEFAULT_IMAGE = '/products/sac-cadenas-camel.jpg';

const absoluteUrl = (pathOrUrl: string): string => {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const origin =
    typeof window !== 'undefined' ? window.location.origin : import.meta.env.VITE_PUBLIC_SITE_URL || '';
  return `${origin}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
};

const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const setCanonical = (href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
};

export const setPageMeta = (opts: {
  title: string;
  description?: string;
  image?: string;
  path?: string;
  /** Pages privées (gérance) : jamais indexées par les moteurs de recherche */
  noindex?: boolean;
}) => {
  if (typeof document === 'undefined') return;
  const description = (opts.description || DEFAULT_DESCRIPTION).replace(/\s+/g, ' ').trim().slice(0, 160);
  const image = absoluteUrl(opts.image || DEFAULT_IMAGE);
  const url = absoluteUrl(opts.path ?? window.location.pathname);

  document.title = opts.title;
  setMeta('name', 'description', description);
  setMeta('property', 'og:title', opts.title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:image', image);
  setMeta('property', 'og:url', url);
  setCanonical(url);
  setMeta('name', 'robots', opts.noindex ? 'noindex, nofollow' : 'index, follow');
};
