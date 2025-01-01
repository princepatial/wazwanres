import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
    }
  },
  server: {
    port: 3001, 
  },
  assetsInclude: ['**/*.jpg', '**/*.png', '**/*.webp', '**/*.jpeg']
});
