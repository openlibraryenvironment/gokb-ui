import log from '@/shared/utils/logger'
import tokenModel from '@/shared/models/token-model'

import { http } from '@/shared/services/http'

import profileServices from '@/shared/services/profile-services'

import accountServices from './account-services'

export default accountServices(log, tokenModel, http, profileServices)
