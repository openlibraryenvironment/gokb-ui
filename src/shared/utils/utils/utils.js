import native from '@/shared/utils/native'

const api = {
  getApiUrl () {
    return process.env.VUE_APP_API_BASE_URL
  },

  // eslint-disable-next-line
  isTokenExpired ({ ['.expires']: expires }) {
    const d = Date.parse(expires)
    return d ? d < Date.now() : true
  },

  errorOccurred (response) {
    return response.status >= 400
  },

  isProduction () {
    return process.env.NODE_ENV === 'production'
  },

  isString: native.isString,
  isArray: native.isArray,
  isObject: native.isObject,
}

export default api
