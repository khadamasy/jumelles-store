import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: 3001,
    strictPort: true, // erreur claire si le port est pris, au lieu de changer de port en silence
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
      },
      '/robots.txt': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
      },
      '/sitemap.xml': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
      },
      // Photos téléversées sur MinIO (développement local)
      '/jumelles-products': {
        target: 'http://127.0.0.1:9000',
        changeOrigin: true,
      },
    },
  },
});

