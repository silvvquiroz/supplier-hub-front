import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const PROVEEDOR_API_ORIGIN =
  'https://supplier-hub-api-fha8daf4g7gzdhag.spaincentral-01.azurewebsites.net'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: PROVEEDOR_API_ORIGIN,
        changeOrigin: true,
      },
    },
  },
})
