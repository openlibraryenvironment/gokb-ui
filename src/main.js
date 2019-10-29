import Vue from 'vue'
import vuetify from './plugins/vuetify'
import App from './app.vue'
import { router } from './router'
import './register-service-worker'
import utils from '@/shared/utils/utils'

// configuration vue itself
const isNotProduction = !utils.isProduction()
Vue.config.productionTip = isNotProduction
Vue.config.devtools = isNotProduction
Vue.config.performance = isNotProduction

// const requireComponent = require.context(
//   './shared/components', // the relative path of the components folder
//   true, // whether or not to look in subfolders
//   // The regular expression used to match base component filenames
//   /[A-Z]\w+\component.(vue|js)$/
// )
//
// requireComponent.keys().forEach(fileName => {
//   const componentConfig = requireComponent(fileName) // get component config
//   // get PascalCase name of component
//   const componentName = upperFirst(
//     camelCase(
//       // Gets the file name regardless of folder depth
//       fileName
//         .split('/')
//         .pop()
//         .replace(/\.\w+$/, '')
//     )
//   )
//   // register component globally
//   Vue.component(
//     componentName,
//     // Look for the component options on `.default`, which will
//     // exist if the component was exported with `export default`,
//     // otherwise fall back to module's root.
//     componentConfig.default || componentConfig
//   )
// })

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
