import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import { setupTestEnv, startServer, json } from './helpers';

// PostgreSQL « activé » mais remplacé par un faux client qui enregistre les requêtes
const dataDir = setupTestEnv({ databaseUrl: 'postgresql://test:test@127.0.0.1:1/test' });

// eslint-disable-next-line @typescript-eslint/no-var-requires
const db = require('../src/config/db');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { default: app } = require('../src/app');

const queries: string[] = [];
db.pool.connect = async () => ({
  query: async (sql: string) => {
    queries.push(sql.replace(/\s+/g, ' ').trim());
    return { rows: [] }; // base vide au démarrage
  },
  release: () => {},
});

let baseUrl = '';
let close: () => Promise<void>;

before(async () => {
  await db.initDatabase();
  ({ baseUrl, close } = await startServer(app));
});

after(async () => {
  await close();
  await db.pool.end().catch(() => {});
  fs.rmSync(dataDir, { recursive: true, force: true });
});

test('démarrage sur base vide : synchronisation complète du catalogue', () => {
  assert.ok(queries.some((q) => q.startsWith('INSERT INTO products')));
  assert.ok(queries.includes('COMMIT'));
});

test('une commande ne réécrit que la commande et le stock concerné', async () => {
  const product = db.memoryStore.products.find((p: any) => p.isActive && p.variants.some((v: any) => v.stockQuantity > 0));
  const variant = product.variants.find((v: any) => v.stockQuantity > 0);

  queries.length = 0;
  const res = await fetch(
    `${baseUrl}/api/orders`,
    json('POST', {
      customerName: 'Fatou Ndiaye',
      customerPhone: '78 987 65 43',
      shippingCity: 'Thiès',
      shippingAddress: 'Quartier Escale',
      items: [{ productVariantId: variant.id, quantity: 1 }],
    })
  );
  assert.equal(res.status, 201);

  assert.deepEqual(
    queries.map((q) => q.split(' ').slice(0, 3).join(' ')),
    ['BEGIN', 'UPDATE product_variants SET', 'INSERT INTO orders', 'INSERT INTO order_items', 'COMMIT']
  );
  assert.ok(!queries.some((q) => q.startsWith('DELETE FROM products')), 'le catalogue ne doit jamais être touché');
});

test('PostgreSQL en panne : écriture disque conservée puis rattrapage complet', async () => {
  const realConnect = db.pool.connect;
  db.pool.connect = async () => {
    throw new Error('connexion refusée');
  };
  const callback = await fetch(`${baseUrl}/api/phone/callback-request`, json('POST', { customerPhone: '77 555 44 33' }));
  assert.equal(callback.status, 201);
  assert.ok(fs.existsSync(`${dataDir}/pg-pending`), 'marqueur de retard présent');

  // Retour de la base : la prochaine écriture déclenche une synchronisation complète
  db.pool.connect = realConnect;
  queries.length = 0;
  await db.persistStore({ callbacks: [] });
  assert.ok(queries.some((q) => q.startsWith('INSERT INTO phone_callbacks')));
  assert.ok(queries.some((q) => q.startsWith('INSERT INTO products')));
  assert.ok(!fs.existsSync(`${dataDir}/pg-pending`), 'marqueur supprimé après rattrapage');
});
