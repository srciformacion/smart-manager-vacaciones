
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
        name: 'Smart Vacancy',
        short_name: 'SmartVac',
        description: 'Sistema inteligente de gestión de vacaciones y permisos',
        theme_color: '#0f172a',
        icons: [
          {
            src: '/lovable-uploads/a1457b00-74b1-4313-8af6-d5f136d9400c.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/lovable-uploads/a1457b00-74b1-4313-8af6-d5f136d9400c.png',
            sizes: '512x512',
            type: 'image/png',
          }
        ],
        display: 'standalone',
        start_url: '/',
        background_color: '#ffffff'
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
      strategies: 'generateSW',
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            urlPattern: /^https:\/\/api\.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 // 1 hour
              }
            }
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Add this configuration to fix the estree-walker module resolution issue
    dedupe: ['estree-walker']
  },
  optimizeDeps: {
    // Force include problematic packages
    include: ['estree-walker']
  },
  define: {
    'process.env': {}
  },
}));
