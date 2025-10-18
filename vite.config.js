import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/workflow': {
        target: 'http://localhost:5678',
        changeOrigin: true
      },
      // 同源代理到 n8n，避免浏览器 CORS
      '/n8n/ai-chat': {
        target: 'https://fanan77.app.n8n.cloud',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/n8n\/ai-chat/, '/webhook/ai-chat'),
      },
    }
  },
})
