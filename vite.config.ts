import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   resolve: {
    alias: {
      '@': '/src', // This allows you to use absolute imports like @/App
    },
  },
})
