import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'pdf-vendor': ['pdf-lib', 'react-pdf'],
          'ui-vendor': ['react', 'react-dom'],
          'utils-vendor': ['zustand', 'react-dropzone']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['pdf-lib', 'react-pdf']
  }
});