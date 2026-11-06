import fs from 'fs';
import os from 'os';
import path from 'path';
import type { AddressInfo } from 'net';

export const ADMIN_PASSWORD = 'mot-de-passe-test-tres-long';

/**
 * Environnement isolé : à appeler AVANT d'importer l'application.
 * Les données sont écrites dans un dossier temporaire (jamais dans backend/data).
 */
export const setupTestEnv = (opts: { databaseUrl?: string } = {}) => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jumelles-test-'));
  process.env.NODE_ENV = 'test';
  process.env.JUMELLES_DATA_DIR = dataDir;
  process.env.ADMIN_PASSWORD = ADMIN_PASSWORD;
  process.env.ADMIN_EMAIL = '';
  process.env.JWT_SECRET = 'secret-de-test-0123456789-0123456789-abcdef';
  process.env.DATABASE_URL = opts.databaseUrl ?? '';
  process.env.MINIO_ACCESS_KEY = '';
  process.env.MINIO_SECRET_KEY = '';
  process.env.ALLOWED_ORIGINS = 'http://localhost:3000';
  return dataDir;
};

export const startServer = async (app: import('express').Application) => {
  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once('listening', () => resolve()));
  const { port } = server.address() as AddressInfo;
  return { baseUrl: `http://127.0.0.1:${port}`, close: () => new Promise<void>((r) => server.close(() => r())) };
};

export const json = (method: string, body?: unknown, headers: Record<string, string> = {}) => ({
  method,
  headers: { 'Content-Type': 'application/json', ...headers },
  body: body === undefined ? undefined : JSON.stringify(body),
});
