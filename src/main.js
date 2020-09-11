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
      add: 'Add New',
      create: 'Create',
      cancel: 'Cancel',
      confirm: 'Confirm',
      retire: 'Retire',
      delete: 'Delete',
      search: 'Search',
      reset: 'Reset',
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
      dashboard: 'Dashboard',
      search: 'Search',
      results: 'Results'
    },
    welcome: {
      title: 'Welcome to GOKb',
      p1: ''
    },
    search: {
      label: 'Search',
      global: {
        placeholder: 'Titles, Packages, Providers'
      },
      results: {
        label: 'Results',
        empty: 'No Results'
      },
    },
    component: {
      title: {
        label: 'Title',
        plural: 'Titles',
        type: {
          label: 'Type',
          Journal: 'Journal',
          Book: 'Monograph',
          Database: 'Database',
          Other: 'Other'
        },
        publishStart: 'Publishing start',
        publishedFrom: 'Published From',
        publishedTo: 'Published To',
        volumeNumber: 'Volume no.',
        editionNumber: 'Edition no.',
        editionStatement: 'Edition Statement',
        firstPublishedInPrint: 'First Published (Print)',
        firstPublishedOnline: 'First Published (Online)',
      },
      package: {
        label: 'Package',
        plural: 'Packages'
      },
      org: {
        label: 'Organization',
        plural: 'Organizations'
      },
      platform: {
        label: 'Platform',
        plural: 'Platforms'
      },
      provider: {
        label: 'Provider',
        plural: 'Providers'
      },
      identifier: {
        label: 'Identifier',
        plural: 'Identifiers',
        value: 'Value',
        namespace: 'Namespace'
      },
      user: {
        label: 'User',
        plural: 'Users',
      },
      review: {
        label: 'Review',
        plural: 'Reviews',
      },
      maintenance: {
        label: 'Maintenance',
        plural: 'Maintenance'
      },
      general: {
        name: 'Name',
        ids: 'Identifiers',
        variantNames: 'Name Variants',
        curatoryGroups: 'Curatory Groups',
        source: 'Source',
        general: 'General'
      }
    }
  },
  de: {
    btn: {
      edit: 'Bearbeiten',
      submit: 'Abschicken',
      add: 'Hinzufügen',
      confirm: 'Bestätigen',
      create: 'Erstellen',
      cancel: 'Abbrechen',
      retire: 'Archivieren',
      delete: 'Löschen',
      search: 'Suchen',
      reset: 'Zurücksetzen',
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
      dashboard: 'Dashboard',
      search: 'Suche',
      results: 'Ergebnisse'
    },
    search: {
      label: 'Suche',
      global: {
        placeholder: 'Titel, Pakete, Verlage'
      },
      results: {
        label: 'Ergebnisse',
        empty: 'Keine Ergebisse'
      },
    },
    welcome: {
      title: 'Willkommen zur GOKb',
      p1: ''
    },
    component: {
      title: {
        label: 'Einzeltitel',
        plural: 'Einzeltitel',
        type: {
          label: 'Typ',
          Journal: 'Journal',
          Book: 'Monographie',
          Database: 'Datenbank',
          Other: 'Andere'
        },
        publishStart: 'Erscheinungsbeginn',
        publishedFrom: 'Erscheinungsbeginn',
        publishedTo: 'Erscheinungsende',
        volumeNumber: 'Bandnr.',
        editionNumber: 'Ausgabenr.',
        editionStatement: 'Ausgabebezeichnung',
        firstPublishedInPrint: 'Veröffentlichungsdatum (Print)',
        firstPublishedOnline: 'Veröffentlichungsdatum (Online)',
      },
      package: {
        label: 'Paket',
        plural: 'Pakete'
      },
      org: {
        label: 'Organisation',
        plural: 'Organisationen'
      },
      platform: {
        label: 'Plattform',
        plural: 'Plattformen'
      },
      provider: {
        label: 'Provider',
        plural: 'Provider'
      },
      identifier: {
        label: 'Identifikator',
        plural: 'Identifikatoren',
        value: 'Wert',
        namespace: 'Namensraum'
      },
      user: {
        label: 'Benutzer',
        plural: 'Benutzer',
      },
      review: {
        label: 'Review',
        plural: 'Reviews',
      },
      maintenance: {
        label: 'Pflege',
        plural: 'Pflege'
      },
      general: {
        name: 'Name',
        ids: 'Identifikatoren',
        variantNames: 'Weitere Namensformen',
        curatoryGroups: 'Kuratorengruppen',
        source: 'Quelle',
        general: 'Allgemein'
      }
    }
  }
}

const i18n = new VueI18n({
  locale: 'en', // set locale
  messages, // set locale messages
})

new Vue({
  router,
  i18n,
  vuetify,
  render: h => h(App)
}).$mount('#app')
