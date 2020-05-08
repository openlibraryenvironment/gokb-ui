import log from '@/shared/utils/logger'
import crypt from '@/shared/utils/crypt'

import api from './browser-storage'

export default api(log, crypt)
