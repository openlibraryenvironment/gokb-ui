import Vue from 'vue'
import accountServices from '@/shared/services/account-services'
import storage from '@/shared/storage'
import account from './account'

export default account(Vue, storage, accountServices)
