import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Separate from vite.config.js: the Hydrogen/Oxygen/React Router plugins
 * there target SSR builds and don't play well with jsdom component tests.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '~': path.resolve(import.meta.dirname, 'app'),
      '@ds': path.resolve(import.meta.dirname, 'Uniinx Design System'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.js',
    exclude: ['**/node_modules/**', '**/dist/**', '**/.react-router/**', '**/.next/**', '**/.git/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['app/**'],
      exclude: ['app/entry.client.jsx', 'app/entry.server.jsx'],
    },
  },
});
