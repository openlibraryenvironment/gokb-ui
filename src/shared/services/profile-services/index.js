import baseServices from '@/shared/services/base-services'
import ajaxServices from '@/shared/services/ajax-services'

import api from './profile-services'

export default api(baseServices, ajaxServices)
