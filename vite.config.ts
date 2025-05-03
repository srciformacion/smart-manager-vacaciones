
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png', 'offline.html'],
      manifest: {
        name: 'La Rioja Cuida',
        short_name: 'LR Cuida',
        description: 'Sistema inteligente de gestión de vacaciones y permisos',
        theme_color: '#0f172a',
        icons: [
          {
            src: '/lovable-uploads/a4799124-8538-46ae-9f04-366618a71181.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/lovable-uploads/a4799124-8538-46ae-9f04-366618a71181.png',
            sizes: '512x512',
            type: 'image/png',
          }
        ]
      },
      strategies: 'injectManifest',
      srcDir: './', 
      filename: 'public/sw.js',
      outDir: 'dist',
      injectManifest: {
        injectionPoint: 'self.__WB_MANIFEST',
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env': {}
  },
}));
