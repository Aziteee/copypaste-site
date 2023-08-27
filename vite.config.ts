import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    viteCompression({
      algorithm: 'gzip',
      threshold: 5120,
      verbose: true
    }),
  ],
  server: {
    proxy: {
      '^/api': {
        target: 'http://localhost:11451/',
        changeOrigin: true
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve('src'),
      '@style': path.resolve('src/assets/style'),
      '@icons': path.resolve('src/assets/icons'),
      '@components': path.resolve('src/components'),
      '@pages': path.resolve('src/pages'),
      '@composables': path.resolve('src/composables'),
      '@stores': path.resolve('src/stores')
    }
  }
})
