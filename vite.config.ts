import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/muistutin-proto/',
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    open: true,
  },
}); 