import native from '@/shared/utils/native'

const api = {
  // eslint-disable-next-line
  isTokenExpired ({ ['.expires']: expires }) {
    const d = Date.parse(expires)
    return d ? d < Date.now() : true
  },

  pascalCase (string, separator = '-') {
    return string.split(separator).map((word) => {
      return this.upperFirst(word)
    }).join('')
  },
  upperFirst (string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  },

  isProduction () {
    return process.env.NODE_ENV === 'production'
  },

  isString: native.isString,
  isArray: native.isArray,
  isObject: native.isObject,
}

export default api
