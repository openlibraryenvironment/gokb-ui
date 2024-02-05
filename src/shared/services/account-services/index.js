import log from '@/shared/utils/logger'
import tokenModel from '@/shared/models/token-model'
var baseServices = await import('@/shared/services/base-services/base-services.js')
import profileServices from '@/shared/services/profile-services'

import accountServices from './account-services'

export default accountServices(log, tokenModel, baseServices, profileServices)
