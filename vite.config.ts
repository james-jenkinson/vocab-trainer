import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa'

const config: Partial<VitePWAOptions> = {
  includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
  manifest: {
    name: 'Vocab Trainer',
    short_name: 'VT',
    description: 'Flashcard Vocabulary Trainer',
    theme_color: '#ffb635',
    icons: [
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ]
  }
}

export default defineConfig({
  plugins: [solidPlugin(), VitePWA(config)],
  assetsInclude: ['./src/assets/pwa-192x192.png'],
  server: {
    port: 3000
  },
  build: {
    target: 'esnext'
  }
})
