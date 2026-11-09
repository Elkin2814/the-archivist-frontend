import process from 'node:process'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// En desarrollo, /api/* se reenvía al backend de Spring Boot (puerto 8080),
// así el navegador no necesita CORS y la URL del backend vive en un solo lugar.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL ?? 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
