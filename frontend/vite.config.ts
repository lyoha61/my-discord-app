import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
   resolve: {
    alias: {
      'src': path.resolve(__dirname, './src'),
      'shared': path.resolve(__dirname, '../shared'),
      'assets': path.resolve(__dirname,'./src/assets')
    }
  },
  server: {
    proxy: {
      '/api':    { 
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/chats':    'http://localhost:3000',
    }
  }
})
