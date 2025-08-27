import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // remover the following line if you don't need to use the proxy for mobile view
  server: {
    host: true,
    allowedHosts: ['.ngrok-free.app', '.ngrok.io', 'localhost'],
  },
  // Uncomment the following lines if you want to use the proxy for mobile view
})
