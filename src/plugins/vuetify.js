import '@mdi/font/css/materialdesignicons.css'
import de from 'vuetify/lib/locale/de'
import en from 'vuetify/lib/locale/en'
import 'vuetify/styles'
import { createVuetify } from 'vuetify/dist/vuetify.js'


const vuetify = createVuetify({
  lang: {
    locales: { de, en },
    current: 'de'
  },
  icons: {
    iconfont: 'mdiSvg',
  },
  styles: {
    configFile: 'src/styles/settings.scss',
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          bg: '#fff',
          header: '#fff',
          card: '#f2f2f2',
          primary: '#4f4f4f',
          anchor: '#4f4f4f',
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
          bg: '#121212',
          header: '#212121',
          card: '#212121',
          primary: '#d9d9d9',
          anchor: '#d9d9d9',
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
