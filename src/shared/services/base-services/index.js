import { http } from '@/shared/services/http'
import log from '@/shared/utils/logger'
import tokenModel from '@/shared/models/token-model'
import * as accountModel from '@/shared/models/account-model'


import baseServices from './base-services'

export default baseServices(http, log, tokenModel, accountModel)
