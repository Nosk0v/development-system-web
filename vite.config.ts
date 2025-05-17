import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/materials': 'http://localhost:8080',
    },
  },
});