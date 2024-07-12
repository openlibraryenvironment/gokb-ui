import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { execSync } from 'child_process'
import path from 'path'

process.env.VITE_GIT_HASH = execSync('git rev-parse --short HEAD').toString().trim()

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8081
  },
  base: process.env.VITE_PUBLIC_PATH || '/gokb-ui', // base path for the application
  plugins: [
    vue(),
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
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
})