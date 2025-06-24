import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/

 




export default defineConfig({
      plugins: [react(), tailwindcss(),],

  server: {
    host: '0.0.0.0', // Allows external connections
    port: 5175,
    hmr: {
      host: 'ec2-54-172-203-36.compute-1.amazonaws.com' // Your EC2 hostname
    },
    // For Vite 3+ you might need this instead:
    allowedHosts: [
      'ec2-54-172-203-36.compute-1.amazonaws.com:5173'
    ]
  }
})