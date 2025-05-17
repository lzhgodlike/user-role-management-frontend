import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 可以在这里添加全局引入的sass变量
        // additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // 不重写API路径，保留/api前缀
        // rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
        ws: true
      },
    },
  }
}) 