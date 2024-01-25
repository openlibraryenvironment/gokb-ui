import '@mdi/font/css/materialdesignicons.css'
import de from 'vuetify/lib/locale/de'
import en from 'vuetify/lib/locale/en'
import 'vuetify/styles'
import { createVuetify } from 'vuetify/dist/vuetify.js'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  lang: {
    locales: { de, en },
    current: 'de'
  },
  icons: {
    iconfont: 'mdiSvg',
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          bg: '#fff',
          primary: '#4f4f4f',
          secondary: '#a0a0a0',
          invert: '#fdfdfd',
          accent: '#4f4f4f',
          error: '#eb5757',
          // warning: '',
          info: '#2d9cdb',
        }
      },
      dark: {
        dark: true,
        colors: {
          bg: '#000',
          primary: '#d9d9d9',
          secondary: '#5b5b5b',
          invert: '#020202',
          accent: '#d9d9d9',
          error: '#eb5757',
          // warning: '',
          info: '#2d9cdb',
          // success: ''
        }
      }
    }
  }
})

export default vuetify
