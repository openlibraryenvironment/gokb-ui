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

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
