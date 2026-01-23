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
      workbox: {
        // Isso garante que TODAS as imagens, js e css sejam cacheados
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'],
      },
      manifest: {
        name: 'Notas Franciscanas',
        short_name: 'APPostila',
        description: 'Apostila digital do coral da Jufra de Lagoa Formosa.',
        theme_color: '#d6a18d', // Pode ser a cor principal da capa
        background_color: '#fefcf3', // Fundo para splash screen
        icons: [
          {
            src: 'capa-jufra.png', // Usamos a imagem da capa
            sizes: '192x192', // Tamanho comum para ícones
            type: 'image/png'
          },
          {
            src: 'capa-jufra.png',
            sizes: '512x512', // Tamanho maior para dispositivos de alta resolução
            type: 'image/png'
          }
        ]
      }
    })
  ]
})