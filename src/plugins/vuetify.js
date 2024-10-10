import '@mdi/font/css/materialdesignicons.css'
import { de, en } from 'vuetify/locale'
import 'vuetify/styles'
import { createVuetify } from 'vuetify/dist/vuetify.js'

const vuetify = createVuetify({
  locale: {
    locale: import.meta.env.VITE_I18N_LOCALE || navigator.language.split('-')[0],
    fallback: 'en',
    messages: { de, en },
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
          'primary-darken-1': '#2b2b2b',
          anchor: '#4f4f4f',
          'anchor-darken-1': '#2b2b2b',
          secondary: '#a0a0a0',
          'secondary-darken-1': '#878787',
          invert: '#fdfdfd',
          accent: '#4f4f4f',
          'accent-darken-1': '#2b2b2b',
          error: '#eb5757',
          // warning: '',
          info: '#2d9cdb',
        },
        variables: {
          'disabled-opacity': 0.87,
          'medium-opacity': 0.87
        }
      },
      dark: {
        dark: true,
        colors: {
          bg: '#121212',
          header: '#212121',
          card: '#212121',
          primary: '#d9d9d9',
          'primary-darken-1': '#bdbdbd',
          anchor: '#d9d9d9',
          'anchor-darken-1': '#cdcdcd',
          secondary: '#5b5b5b',
          'secondary-darken-1': '#7d7d7d',
          invert: '#020202',
          accent: '#d9d9d9',
          'accent-darken-1': '#bdbdbd',
          error: '#eb5757',
          // warning: '',
          info: '#2d9cdb',
          // success: ''
        },
        variables: {
          'disabled-opacity': 0.87,
          'medium-opacity': 0.87
        }
      }
    }
  }
})

export default vuetify
