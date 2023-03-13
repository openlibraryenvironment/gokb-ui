import { http } from '@/shared/services/http'
import tokenModel from '@/shared/models/token-model'
import accountModel from '@/shared/models/account-model'


import baseServices from './base-services'

export default baseServices(http, tokenModel, accountModel)
