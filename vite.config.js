import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import vuetify from 'vite-plugin-vuetify'
import { execSync } from 'child_process'
import * as sass from 'sass'
import path from 'path'

process.env.VITE_GIT_HASH = execSync('git rev-parse --short HEAD').toString().trim()

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8081,
    host: '127.0.0.1'
  },
  base: process.env.VITE_PUBLIC_PATH || '/gokb-ui', // base path for the application
  plugins: [
    vue(),
    VitePWA({
      filename: 'service-worker.js',
      includeAssets: ['/img/icons/favicon.ico', '/img/icons/favicon.svg', 'img/icons/apple-touch-icon.png'],
      injectRegister: 'script',
      manifest: {
        name: 'GOKB',
        short_name: 'GOKB',
        start_url: process.env.VITE_PUBLIC_PATH || '/gokb-ui/',
        display: 'browser',
        description: 'The Global Open Knowledge Base is a database for electronic resource information cooperatively maintained by librarians and content providers.',
        theme_color: process.env.VITE_COLOR || '#4f4f4f',
        icons: [
          {
            src: "/img/icons/pwa-192x192.png",
            size: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/img/icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/img/icons/pwa-maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "/img/icons/pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ],
      }
    }),
    vuetify({
      autoImport: {
        labs: true,
        styles: {
          configFile: 'src/settings.scss'
        }
      }
    })
  ],
  css :{
    preprocessorOptions : {
      scss: {
        api: "modern",
        importers: [
          new sass.NodePackageImporter()
        ]
      },
      sass: {
        api: "modern",
        importers: [
          new sass.NodePackageImporter()
        ]
      },
    }
  },
  esbuild: {
    supported: {
      'top-level-await': true //browsers can handle top-level-await features
    },
    sourcemap: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
})