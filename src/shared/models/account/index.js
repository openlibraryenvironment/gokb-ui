import Vue from 'vue'
import accountServices from '@/shared/services/account-services'
import account from './account'

const state = Vue.observable({
  username: undefined,
})

export default account(state, accountServices)
