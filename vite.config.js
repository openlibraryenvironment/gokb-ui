import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import vuetify from 'vite-plugin-vuetify'
import { execSync } from 'child_process'
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
    VitePWA(),
    vuetify({
      autoImport: {
        labs: true,
        styles: {
          configFile: 'src/settings.scss'
        }
      }
    })
  ],
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