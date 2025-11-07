import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
base: '/ApostilaJufra/',

  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'APPostila Jufra',
        short_name: 'APPostila',
        description: 'Apostila digital do coral Jufra de Lagoa Formosa.',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'vite.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ]
})