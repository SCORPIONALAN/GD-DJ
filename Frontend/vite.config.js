import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      // Redirige /api y /uploads al backend local
      '/api':     { target: 'http://localhost:5000', changeOrigin: true },
      '/uploads': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },

  build: {
    rollupOptions: {
      output: {
        // Separa Three.js en su propio chunk para mejorar el tiempo de carga inicial
        manualChunks: (id) => {
          if (id.includes('node_modules/three')) return 'three';
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) return 'vendor';
        },
      },
    },
  },
});
