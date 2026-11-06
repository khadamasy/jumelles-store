import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { setupTestEnv, startServer, json, ADMIN_PASSWORD } from './helpers';

const dataDir = setupTestEnv();

// Imports après la configuration de l'environnement
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { default: app } = require('../src/app');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { initDatabase, memoryStore } = require('../src/config/db');

let baseUrl = '';
let close: () => Promise<void>;

before(async () => {
  await initDatabase();
  ({ baseUrl, close } = await startServer(app));
});

after(async () => {
  await close();
  fs.rmSync(dataDir, { recursive: true, force: true });
});

const pickVariant = () => {
  for (const p of memoryStore.products) {
    if (!p.isActive) continue;
    const v = p.variants.find((x: any) => x.stockQuantity >= 3);
    if (v) return { product: p, variant: v };
  }
  throw new Error('Aucune variante en stock dans le catalogue de démonstration');
};

const customer = {
  customerName: 'Awa Diop',
  customerPhone: '77 123 45 67',
  shippingCity: 'Dakar',
  shippingAddress: 'Almadies, en face de la pharmacie',
};

let createdOrderNumber = '';

test('commande : prix recalculés côté serveur, stock décrémenté, variante renvoyée', async () => {
  const { product, variant } = pickVariant();
  const stockBefore = variant.stockQuantity;
  const res = await fetch(
    `${baseUrl}/api/orders`,
    json('POST', {
      ...customer,
      totalAmount: 1, // valeur falsifiée : doit être ignorée
      items: [{ productVariantId: variant.id, quantity: 2, unitPrice: 1 }],
    })
  );
  assert.equal(res.status, 201);
  const body = await res.json();
  const expectedUnit = product.basePrice + (variant.priceAdjustment || 0);
  assert.equal(body.data.totalAmount, expectedUnit * 2);
  assert.equal(body.data.items[0].productVariantId, variant.id);
  assert.equal(variant.stockQuantity, stockBefore - 2);
  createdOrderNumber = body.data.orderNumber;
  assert.match(createdOrderNumber, /^JUM-\d{4}-[A-Z0-9]{8}$/);

  // Persistance disque dans le dossier isolé
  const snapshot = JSON.parse(fs.readFileSync(path.join(dataDir, 'store.json'), 'utf8'));
  assert.ok(snapshot.orders.some((o: any) => o.orderNumber === createdOrderNumber));
});

test('commande : refusée si le stock est insuffisant, sans décrément partiel', async () => {
  const { variant } = pickVariant();
  const stockBefore = variant.stockQuantity;
  const res = await fetch(
    `${baseUrl}/api/orders`,
    json('POST', {
      ...customer,
      items: [
        { productVariantId: variant.id, quantity: 1 },
        { productVariantId: variant.id, quantity: Math.min(10, stockBefore) },
      ],
    })
  );
  assert.equal(res.status, 400);
  assert.equal(variant.stockQuantity, stockBefore);
});

test('suivi : exige le bon numéro de téléphone', async () => {
  const wrong = await fetch(`${baseUrl}/api/orders/track?orderNumber=${createdOrderNumber}&phone=770000000`);
  assert.equal((await wrong.json()).count, 0);

  const right = await fetch(`${baseUrl}/api/orders/track?orderNumber=${createdOrderNumber}&phone=+221771234567`);
  const body = await right.json();
  assert.equal(body.count, 1);
  assert.equal(body.data[0].orderNumber, createdOrderNumber);
  assert.equal(body.data[0].customerPhone, undefined, 'aucune donnée personnelle exposée');
});

test('connexion gérance : email obligatoire, puis session par cookie HttpOnly', async () => {
  const noEmail = await fetch(`${baseUrl}/api/auth/admin/login`, json('POST', { password: ADMIN_PASSWORD }));
  assert.equal(noEmail.status, 401);

  const badPassword = await fetch(
    `${baseUrl}/api/auth/admin/login`,
    json('POST', { email: 'gerance@jumelles.sn', password: 'mauvais-mot-de-passe' })
  );
  assert.equal(badPassword.status, 401);

  const ok = await fetch(
    `${baseUrl}/api/auth/admin/login`,
    json('POST', { email: 'gerance@jumelles.sn', password: ADMIN_PASSWORD })
  );
  assert.equal(ok.status, 200);
  const setCookie = ok.headers.get('set-cookie') || '';
  assert.match(setCookie, /HttpOnly/);
  assert.match(setCookie, /SameSite=Strict/);
  const cookie = setCookie.split(';')[0];

  const stats = await fetch(`${baseUrl}/api/orders/admin/dashboard-stats`, { headers: { Cookie: cookie } });
  assert.equal(stats.status, 200);

  // Requête mutative sans en-tête anti-CSRF : refusée
  const order = memoryStore.orders[0];
  const csrf = await fetch(
    `${baseUrl}/api/orders/admin/${order.id}/status`,
    json('PATCH', { status: 'PREPARING' }, { Cookie: cookie })
  );
  assert.equal(csrf.status, 403);

  const allowed = await fetch(
    `${baseUrl}/api/orders/admin/${order.id}/status`,
    json('PATCH', { status: 'CANCELLED' }, { Cookie: cookie, 'X-Requested-With': 'JumellesStore' })
  );
  assert.equal(allowed.status, 200);
});

test('annulation : le stock est remis une seule fois', async () => {
  const order = memoryStore.orders.find((o: any) => o.status === 'CANCELLED');
  assert.ok(order);
  const variantId = order.items[0].productVariantId;
  const variant = memoryStore.products.flatMap((p: any) => p.variants).find((v: any) => v.id === variantId);
  const stock = variant.stockQuantity;

  const login = await fetch(
    `${baseUrl}/api/auth/admin/login`,
    json('POST', { email: 'gerance@jumelles.sn', password: ADMIN_PASSWORD })
  );
  const cookie = (login.headers.get('set-cookie') || '').split(';')[0];
  const again = await fetch(
    `${baseUrl}/api/orders/admin/${order.id}/status`,
    json('PATCH', { status: 'CANCELLED' }, { Cookie: cookie, 'X-Requested-With': 'JumellesStore' })
  );
  assert.equal(again.status, 200);
  assert.equal(variant.stockQuantity, stock);
});

test('sitemap.xml : liste les articles actifs', async () => {
  const res = await fetch(`${baseUrl}/sitemap.xml`);
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type') || '', /application\/xml/);
  const xml = await res.text();
  const active = memoryStore.products.find((p: any) => p.isActive);
  assert.ok(xml.includes(`/product/${encodeURIComponent(active.slug)}`));
});

test('robots.txt : pointe vers le sitemap du domaine configuré et protège /admin', async () => {
  const res = await fetch(`${baseUrl}/robots.txt`);
  assert.equal(res.status, 200);
  const txt = await res.text();
  assert.match(txt, /Disallow: \/admin/);
  assert.match(txt, /Sitemap: https?:\/\/[^\s]+\/sitemap\.xml/);
});

test('rappels : statut invalide refusé, statut valide enregistré', async () => {
  const created = await fetch(
    `${baseUrl}/api/phone/callback-request`,
    json('POST', { customerName: 'Awa', customerPhone: '77 123 45 67' })
  );
  assert.equal(created.status, 201);
  const { data } = (await created.json()) as any;

  const login = await fetch(
    `${baseUrl}/api/auth/admin/login`,
    json('POST', { email: 'gerance@jumelles.sn', password: ADMIN_PASSWORD })
  );
  const headers = { Cookie: (login.headers.get('set-cookie') || '').split(';')[0], 'X-Requested-With': 'JumellesStore' };

  const bad = await fetch(`${baseUrl}/api/phone/admin/callbacks/${data.id}/status`, json('PATCH', { status: 'HACK' }, headers));
  assert.equal(bad.status, 400);

  const ok = await fetch(`${baseUrl}/api/phone/admin/callbacks/${data.id}/status`, json('PATCH', { status: 'CALLED' }, headers));
  assert.equal(ok.status, 200);
  assert.equal(memoryStore.phoneCallbacks.find((c: any) => c.id === data.id)?.status, 'CALLED');
});

test('sécurité : jeton Bearer refusé tant que Keycloak n\'est pas activé', async () => {
  const res = await fetch(`${baseUrl}/api/orders/admin/all`, {
    headers: { Authorization: 'Bearer eyJhbGciOiJSUzI1NiJ9.e30.c2lnbmF0dXJl' },
  });
  assert.equal(res.status, 401);
});

test('commandes non confirmées : annulées après le délai, stock libéré une seule fois', async () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { expireStalePendingOrders } = require('../src/controllers/orderController');
  const { variant } = pickVariant();
  const stock = variant.stockQuantity;
  const recent: any = {
    id: 'ord-recent',
    orderNumber: 'JUM-2026-RECENT01',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    customerName: 'A',
    customerEmail: 'a@b.sn',
    customerPhone: '770000000',
    shippingAddress: 'x',
    shippingCity: 'Dakar',
    totalAmount: 1,
    items: [{ id: 'item-r', orderId: 'ord-recent', productVariantId: variant.id, productName: 'x', variantDetails: 'x', quantity: 1, unitPrice: 1, totalPrice: 1 }],
  };
  const old: any = {
    ...recent,
    id: 'ord-old',
    orderNumber: 'JUM-2026-OLD00001',
    createdAt: new Date(Date.now() - 49 * 3600 * 1000).toISOString(),
    items: [{ ...recent.items[0], id: 'item-o', orderId: 'ord-old', quantity: 2 }],
  };
  memoryStore.orders.unshift(recent, old);

  assert.equal(await expireStalePendingOrders(), 1);
  assert.equal(old.status, 'CANCELLED');
  assert.equal(recent.status, 'PENDING');
  assert.equal(variant.stockQuantity, stock + 2);

  // Deuxième passage : rien à annuler, stock inchangé
  assert.equal(await expireStalePendingOrders(), 0);
  assert.equal(variant.stockQuantity, stock + 2);
});

// Doit rester le DERNIER test : il épuise le quota de commandes de l'IP locale
test('sécurité : changer de numéro ne contourne plus la limite de commandes par IP', async () => {
  let last = 0;
  for (let i = 0; i < 20; i++) {
    const res = await fetch(
      `${baseUrl}/api/orders`,
      json('POST', {
        customerName: 'Spam',
        customerPhone: `77 000 ${String(1000 + i).slice(-4)}`,
        shippingAddress: 'X',
        shippingCity: 'Dakar',
        items: [],
      })
    );
    last = res.status;
    if (last === 429) break;
  }
  assert.equal(last, 429);
});
