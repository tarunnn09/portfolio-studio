import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api/anthropic': {
        target: 'https://api.anthropic.com/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/anthropic/, ''),
        headers: {
          'anthropic-dangerous-direct-browser-access': 'true',
        },
      },
    },
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 250,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('jszip')) {
              return 'vendor-jszip';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            return 'vendor';
          }
          if (id.includes('src/components/templates/editorial')) {
            return 'template-editorial';
          }
          if (id.includes('src/components/templates/minimal')) {
            return 'template-minimal';
          }
          if (id.includes('src/components/templates/terminal')) {
            return 'template-terminal';
          }
        },
      },
    },
  },
});
