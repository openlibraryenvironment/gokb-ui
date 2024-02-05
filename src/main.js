import { createApp } from 'vue'
import vuetify from './plugins/vuetify'
import i18n from './plugins/i18n'
import router from './router'
import './register-service-worker'
import utils from '@/shared/utils/utils'
import VueJsonPretty from 'vue-json-pretty'
import App from './app.vue'


const app = createApp(App)

app.use(router)
app.use(vuetify)
app.use(i18n)

// configuration vue itself
const isNotProduction = !utils.isProduction()
app.config.devtools = isNotProduction
app.config.performance = isNotProduction

// make all gokb components global available
const gokbComponents = await import.meta.glob(
  '@/shared/components/**/gokb-*.vue', { import: 'default', eager: true }
)

for (const fileName in gokbComponents) {
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
    gokbComponents[fileName]
  )
}

app.component("vue-json-pretty", VueJsonPretty)

app.mount('#app')
