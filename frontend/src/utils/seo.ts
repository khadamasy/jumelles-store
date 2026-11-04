/**
 * Balises de référencement mises à jour à chaque page (titre, description, canonical, Open Graph)
 * et données structurées Product pour les fiches articles.
 */
const DEFAULT_DESCRIPTION =
  'Boutique de sacs à main et chaussures pour femme à Dakar (Sénégal). Commande directe sur WhatsApp, paiement à la livraison, livraison rapide à Dakar et en régions.';

/** Domaine public du site (variable VITE_SITE_URL), à défaut le domaine courant */
export const siteUrl = (): string =>
  (import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')).replace(/\/$/, '');

export const absoluteUrl = (pathOrUrl: string): string =>
  /^https?:\/\//i.test(pathOrUrl) ? pathOrUrl : `${siteUrl()}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;

const upsertMeta = (attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const upsertCanonical = (href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
};

export interface PageSeo {
  title: string;
  description?: string;
  path: string;
  image?: string;
  noindex?: boolean;
}

export const applySeo = ({ title, description, path, image, noindex }: PageSeo) => {
  if (typeof document === 'undefined') return;
  const desc = (description || DEFAULT_DESCRIPTION).replace(/\s+/g, ' ').trim().slice(0, 160);
  const url = absoluteUrl(path);
  document.title = title;
  upsertMeta('name', 'description', desc);
  upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
  upsertCanonical(url);
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', desc);
  upsertMeta('property', 'og:url', url);
  if (image) upsertMeta('property', 'og:image', absoluteUrl(image));
  setProductJsonLd(null);
};

/** Données structurées schema.org/Product (prix, disponibilité) pour les résultats Google */
export const setProductJsonLd = (product: any | null) => {
  if (typeof document === 'undefined') return;
  const id = 'jsonld-product';
  document.getElementById(id)?.remove();
  if (!product) return;
  const inStock = (product.variants || []).some((v: any) => v.stockQuantity > 0);
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: String(product.description || '').slice(0, 500),
    image: (product.images || []).map((i: any) => absoluteUrl(i.minioUrl)),
    sku: product.variants?.[0]?.sku,
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(`/product/${product.slug}`),
      priceCurrency: 'XOF',
      price: product.basePrice,
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = id;
  script.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
  document.head.appendChild(script);
};
