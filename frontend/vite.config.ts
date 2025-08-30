import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
   resolve: {
    alias: {
      'src': path.resolve(__dirname, './src'),
      'shared': path.resolve(__dirname, '../shared')
    }
  },
  server: {
    proxy: {
      '/auth':     'http://localhost:3000',
      '/messages': 'http://localhost:3000',
      '/chats':    'http://localhost:3000',
      '/users':    'http://localhost:3000'
    }
  }
})
