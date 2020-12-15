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
        secondary: '#bdbdbd',
        accent: '#f2994a',
        error: '#eb5757',
        // warning: '',
        info: '#2d9cdb',
      },
      dark: {
        primary: '#262626',
        secondary: '#404040',
        accent: '#f2994a',
        error: '#eb5757',
        // warning: '',
        info: '#2d9cdb',
        // success: ''
      }
    }
  }
})
