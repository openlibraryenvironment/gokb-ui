import Vuetify from 'vuetify/lib'
import { VApp } from 'vuetify'
import { mount } from 'cypress/vue'
import { h } from 'vue'
import { createI18n } from './plugins/i18n'
import VueRouter from './router'
import de from 'vuetify/es5/locale/de'
import en from 'vuetify/es5/locale/en'

// We recommend that you pull this out
// into a constants file that you share with
// your main.js file.
const vuetifyOptions = {
  lang: {
    locales: { de, en },
    current: 'de'
  },
  icons: {
    iconfont: 'mdiSvg',
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
}

Cypress.Commands.add('mount', (component, ...args) => {
  args.global = args.global || {}
  args.global.plugins = args.global.plugins || []
  args.global.plugins.push(new Vuetify(vuetifyOptions))
  args.global.plugins.push(createI18n())

  Vue.use(VueRouter)

  args.router = args.router || router

  return mount(() => {
    return h(VApp, {}, component)
  }, ...args)
})