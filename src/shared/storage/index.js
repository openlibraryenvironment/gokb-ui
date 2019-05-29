import Vue from 'vue'
import encrypt from '@/shared/utils/encrypt'

import api from './storage'

export default api(Vue, encrypt)
