import native from '@/shared/utils/native'

const api = {
  pascalCase (string, separator = '-') {
    return string.split(separator).map((word) => {
      return this.upperFirst(word)
    }).join('')
  },
  upperFirst (string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  },

  isProduction () {
    return import.meta.env.NODE_ENV === 'production'
  },

  asYesNo (value) {
    return value ? 'Yes' : 'No'
  },

  isString: native.isString,
  isArray: native.isArray,
  isObject: native.isObject,
}

export default api
