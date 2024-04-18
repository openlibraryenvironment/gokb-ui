import { http } from '@/shared/services/http'
import utils from '@/shared/utils/utils'
import tokenModel from '@/shared/models/token-model'

import api from './profile-services'

export default api(http, utils, tokenModel)
