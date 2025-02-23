import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import components from 'unplugin-vue-components/vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VarletImportResolver } from '@varlet/import-resolver'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    components({
      resolvers: [VarletImportResolver()]
    }),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Prototype',
        short_name: 'Prototype',
        id: 'sharpdotnut-prototype',
        theme_color: '#d1bdff',
        icons: [
          {
            src: '/img/UI_ChapterIcon_Yunjin.png',
            sizes: '256x256',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0'
  },
  build: {
    outDir: './dist'
  },
  define: {
    __BUILD_TIME: new Date().getTime()
  }
})
