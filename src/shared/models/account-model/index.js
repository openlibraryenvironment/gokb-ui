import {reactive} from 'vue'
import accountServices from '@/shared/services/account-services'
import browserStorage from '@/shared/utils/browser-storage'
import account from './account-model'

export default account(reactive, accountServices, browserStorage)
