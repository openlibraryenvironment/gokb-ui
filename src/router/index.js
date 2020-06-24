import Vue from 'vue'
import Router from 'vue-router'
import HomeView from '@/views/home-view.vue'
import errorModel from '@/shared/models/error-model'
import accountModel from '@/shared/models/account-model'
import log from '@/shared/utils/logger'
import router from './router'
import loading from '@/shared/models/loading'

Vue.use(Router)

const api = router(log, errorModel, accountModel, Router, HomeView, loading)

export default api
