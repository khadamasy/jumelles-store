import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
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

