import baseServices from '@/shared/services/base-services'
import utils from '@/shared/utils/utils'
import storage from '@/shared/storage'

import accountServices from './account-services'

export default accountServices(utils, storage, baseServices)
