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
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      prev: 'Previous'
    },
    popups: {
      name: {
        keepCurrent: 'Keep current name as variant'
      }
    },
    job: {
      finished: 'Finished',
      description: 'Description',
      waiting: 'Waiting',
      messages: 'Messages',
      status: 'Status',
      startTime: 'Start',
      endTime: 'End'
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
      add: {
        label: 'Add {0}'
      },
      welcome: 'Welcome to GOKb',
      dashboard: 'Dashboard'
    },
    welcome: {
      title: 'Welcome to GOKb',
      p1: ''
    },
    component: {
      title: {
        label: 'Title',
        type: {
          Journal: 'Journal',
          Book: 'Monograph',
          Database: 'Database',
          Other: 'Other'
        }
      },
      package: {
        label: 'Package'
      },
      org: {
        label: 'Organization'
      },
      platform: {
        label: 'Platform'
      },
      provider: {
        label: 'Provider'
      },
      identifier: {
        label: 'Identifier',
        value: 'Value',
        namespace: 'Namespace'
      },
      general: {
        name: 'Name',
        ids: 'Identifiers',
        variantNames: 'Name Variants',
        curatoryGroups: 'Curatory Groups',
        source: 'Source'
      }
    }
  },
  de: {
    btn: {
      edit: 'Bearbeiten',
      submit: 'Abschicken',
      confirm: 'Bestätigen',
      create: 'Erstellen',
      cancel: 'Abbrechen',
      back: 'Zurück',
      next: 'Weiter',
      prev: 'Zurück'
    },
    popups: {
      name: {
        keepCurrent: 'Bisherigen Namen als Variante behalten'
      }
    },
    job: {
      finished: 'Fertig',
      waiting: 'Warten',
      description: 'Beschreibung',
      messages: 'Ereignisse',
      status: 'Status',
      startTime: 'Start',
      endTime: 'Ende'
    },
    header: {
      edit: {
        label: '{0} bearbeiten'
      },
      create: {
        label: '{0} anlegen'
      },
      show: {
        label: '{0}-Details'
      },
      add: {
        label: '{0} hinzufügen'
      },
      welcome: 'Willkommen zur GOKb',
      dashboard: 'Dashboard'
    },
    welcome: {
      title: 'Willkommen zur GOKb',
      p1: ''
    },
    component: {
      title: {
        label: 'Titel',
        type: {
          Journal: 'Journal',
          Book: 'Monographie',
          Database: 'Datenbank',
          Other: 'Andere'
        }
      },
      package: {
        label: 'Paket'
      },
      org: {
        label: 'Organisation'
      },
      platform: {
        label: 'Plattform'
      },
      provider: {
        label: 'Provider'
      },
      identifier: {
        label: 'Identifikator',
        value: 'Wert',
        namespace: 'Namensraum'
      },
      general: {
        name: 'Name',
        ids: 'Identifikatoren',
        variantNames: 'Weitere Namensformen',
        curatoryGroups: 'Kuratorengruppen',
        source: 'Quelle'
      }
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
