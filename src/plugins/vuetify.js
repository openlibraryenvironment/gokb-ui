import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import de from 'vuetify/es5/locale/de'
import en from 'vuetify/es5/locale/en'

Vue.use(Vuetify)

export default new Vuetify({
  lang: {
    locales: { de, en },
    current: 'de'
  },
  theme: {
    themes: {
      light: {
        primary: '#4f4f4f',
        secondary: '#a0a0a0',
        invert: '#fdfdfd',
        accent: '#4f4f4f',
        error: '#eb5757',
        // warning: '',
        info: '#2d9cdb',
      },
      dark: {
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
})
