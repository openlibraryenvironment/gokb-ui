import Vue from 'vue'
import accountServices from '@/shared/services/account-services'
import profileServices from '@/shared/services/profile-services'
import storage from '@/shared/storage'
import account from './account'

export default account(Vue, storage, accountServices, profileServices)
