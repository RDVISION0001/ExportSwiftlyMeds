import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  define: {
    // Define global
    'global': 'globalThis'
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    hmr: {
      overlay: false, // Disable the HMR overlay
    },
    allowedHosts: [
      'swiftlymeds.com', 'www.swiftlymeds.com'// Add your host here
    ],
  }
})
