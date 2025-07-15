import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy /api calls to Django dev server
      '/api': 'http://localhost:8000',
    },
  },
})
