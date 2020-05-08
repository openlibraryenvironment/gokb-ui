import Vue from 'vue'
import Router from 'vue-router'
import HomeView from '@/views/home-view.vue'
import errorModel from '@/shared/models/error-model'
import accountModel from '@/shared/models/account-model'
import log from '@/shared/utils/logger'
import router from './router'

Vue.use(Router)

const api = router(log, errorModel, accountModel, Router, HomeView)

export default api
