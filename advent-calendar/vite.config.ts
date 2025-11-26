import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import viteDjangoPlugin from './vite-plugin-django'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    viteDjangoPlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    outDir: '../static/frontend',
    emptyOutDir: true,
    manifest: true, // Genera manifest.json para mapear archivos con hash
    rollupOptions: {
      output: {
        // Genera archivos JS con hash en el nombre
        entryFileNames: 'assets/[name].[hash].js',
        // Genera archivos CSS con hash en el nombre
        chunkFileNames: 'assets/[name].[hash].js',
        // Genera otros assets (imágenes, fuentes) con hash
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/[name].[hash].css'
          }
          return 'assets/[name].[hash].[ext]'
        }
      }
    }
  },
  
  // Base URL para los assets en producción
  base: '/static/frontend/',
})
