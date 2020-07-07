import utils from '@/shared/utils/utils'
import { http } from '@/shared/services/http'

import baseServices from './base-services'

export default baseServices(http, utils)
