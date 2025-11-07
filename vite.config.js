import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa' // 1. Importamos o plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // 2. Adicionamos o plugin PWA
    VitePWA({
      registerType: 'autoUpdate', // Ele vai se atualizar sozinho

      // 3. O "manifest" diz ao celular como o app se chama e qual ícone usar
      manifest: {
        name: 'APPostila Jufra',
        short_name: 'APPostila',
        description: 'Apostila digital do coral Jufra de Lagoa Formosa.',
        theme_color: '#ffffff', // Cor da barra de navegação do app
        icons: [
          {
            // Vamos usar o ícone do Vite que já está na pasta 'public'
            src: 'vite.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ]
})