import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import { router } from './router'
import './registerServiceWorker'
import VueLocalStorage from 'vue-localstorage'
import utils from '@/shared/utils/utils'

Vue.use(VueLocalStorage, {
  name: 'localStorage',
  bind: true // created computed members from your variable declarations
})

// configuration vue itself
const isNotProduction = !utils.isProduction()
Vue.config.productionTip = isNotProduction
Vue.config.devtools = isNotProduction
Vue.config.performance = isNotProduction

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
