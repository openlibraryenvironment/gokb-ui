const baseServices = await import('@/shared/services/base-services/base-services.js')

import api from './profile-services'

export default api(baseServices)
