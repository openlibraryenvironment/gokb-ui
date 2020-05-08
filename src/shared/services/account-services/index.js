import log from '@/shared/utils/logger'
import assert from '@/shared/utils/assert'
import tokenModel from '@/shared/models/token-model'
import baseServices from '@/shared/services/base-services'
import profileServices from '@/shared/services/profile-services'

import accountServices from './account-services'

export default accountServices(assert, log, tokenModel, baseServices, profileServices)
