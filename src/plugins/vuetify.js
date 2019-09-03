import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import de from 'vuetify/es5/locale/de'

Vue.use(Vuetify)

export default new Vuetify({
  lang: {
    locales: { de },
    current: 'de'
  },
  theme: {
    primary: '#4f4f4f',
    secondary: '#bdbdbd',
    accent: '#f2994a',
    error: '#eb5757',
    // warning: '',
    info: '#2d9cdb',
    // success: ''
  }
})
