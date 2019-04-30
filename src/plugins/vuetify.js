import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import de from 'vuetify/es5/locale/de'

Vue.use(Vuetify, {
  iconfont: 'mdi',
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
