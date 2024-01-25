import { createApp } from 'vue'
import vuetify from './plugins/vuetify'
import i18n from './plugins/i18n'
import router from './router'
import './register-service-worker'
import utils from '@/shared/utils/utils'
import VueJsonPretty from 'vue-json-pretty'
import App from './app.vue'


const app = createApp(App)

app.use(vuetify)
app.use(router)
app.use(i18n)

// configuration vue itself
const isNotProduction = !utils.isProduction()
app.config.devtools = isNotProduction
app.config.performance = isNotProduction

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
  app.component(
    componentName,
    // look for the component options on `.default`, which will
    // exist if the component was exported with `export default`,
    // otherwise fall back to module's root.
    componentConfig.default || componentConfig
  )
})

app.component("vue-json-pretty", VueJsonPretty)

app.mount('#app')

if (module.hot) {
  module.hot.accept(['./locales/en.json', './locales/de.json'], function () {
    i18n.setLocaleMessage('en', require('./locales/en.json').default)
    i18n.setLocaleMessage('de', require('./locales/de.json').default)
  })
}
