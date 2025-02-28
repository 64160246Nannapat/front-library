import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  assetsInclude: ['/*.ttf', '/.woff', '**/.woff2'],
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://info.lib.buu.ac.th',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/apilib/Walai/CheckSearch'),
      },
    },
  },
  build: {
    rollupOptions: {
      external: ['jquery']  // เพิ่มการตั้งค่าตรงนี้
    }
  }
})
