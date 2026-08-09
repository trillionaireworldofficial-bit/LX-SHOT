import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Allow overriding the base path at build time via VITE_BASE.
  // Default to '/' which is correct for the custom root domain (lxshot.com).
  base: process.env.VITE_BASE || '/',
  server: {
    host: '0.0.0.0',
    port: 3000
  }
});
