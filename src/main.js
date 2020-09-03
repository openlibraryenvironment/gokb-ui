import Vue from 'vue'
import vuetify from './plugins/vuetify'
import VueI18n from 'vue-i18n'
import App from './app.vue'
import router from './router'
import './register-service-worker'
import utils from '@/shared/utils/utils'

// configuration vue itself
const isNotProduction = !utils.isProduction()
Vue.config.productionTip = isNotProduction
Vue.config.devtools = isNotProduction
Vue.config.performance = isNotProduction

Vue.use(VueI18n)

// make all gokb components global available
const requireComponent = require.context(
  '@/shared/components', // the relative path of the components folder
  true, // look in subfolders
  /gokb-[\w-]+.vue/ // the regular expression used to match base component filenames
)
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName) // get component config
  // get PascalCase name of component
  const componentName = utils.pascalCase(
      // gets the file name regardless of folder depth
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '') // remove extension
    )
  // register component globally
  Vue.component(
    componentName,
    // look for the component options on `.default`, which will
    // exist if the component was exported with `export default`,
    // otherwise fall back to module's root.
    componentConfig.default || componentConfig
  )
})

const messages = {
  en: {
    btn: {
      edit: 'Edit',
      submit: 'Submit',
      create: 'Create',
      cancel: 'Cancel',
      back: 'Back',
      next: 'Next',
      prev: 'Previous'
    },
    header: {
      edit: {
        label: 'Edit {0}'
      },
      create: {
        label: 'Create {0}'
      },
      show: {
        label: '{0} details'
      },
      welcome: 'Welcome to GOKb',
      dashboard: 'Dashboard'
    },
    welcome: {
      title: 'Welcome to GOKb',
      p1: ''
    },
    title: {
      type: {
        Journal: 'Journal',
        Book: 'Monograph',
        Database: 'Database'
      }
    },
    package: {
      label: 'Package'
    },
    provider: {
      label: 'Provider'
    }
  },
  de: {
    btn: {
      edit: 'Bearbeiten',
      submit: 'Abschicken',
      create: 'Erstellen',
      cancel: 'Abbrechen',
      back: 'Zurück',
      next: 'Weiter',
      prev: 'Zurück'
    },
    header: {
      edit: {
        label: '{0} bearbeiten'
      },
      create: {
        label: '{0} anlegen'
      },
      show: {
        label: '{0}details'
      },
      welcome: 'Willkommen zur GOKb',
      dashboard: 'Dashboard'
    },
    welcome: {
      title: 'Willkommen zur GOKb',
      p1: ''
    },
    title: {
      type: {
        Journal: 'Journal',
        Book: 'Monographie',
        Database: 'Datenbank'
      }
    },
    package: {
      label: 'Paket'
    },
    provider: {
      label: 'Provider'
    }
  }
}

const i18n = new VueI18n({
  locale: 'de', // set locale
  messages, // set locale messages
})

new Vue({
  router,
  i18n,
  vuetify,
  render: h => h(App)
}).$mount('#app')
