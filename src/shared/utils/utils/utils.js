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

  isDevelopment () {
    return import.meta.env.DEV
  },

  asYesNo (value) {
    return value ? 'Yes' : 'No'
  },

  createQueryParameters (parameters) {
    const pars = []

    Object.entries(parameters)
      .forEach(([name, value]) => {
        if (Array.isArray(value)) {
          value.forEach(val =>
            pars.push(`${name}=${typeof val === 'string' ? encodeURIComponent(val.trim()) : val}`)
          )
        } else if (value !== undefined && value !== null) {
          if (typeof value === 'object') {
            pars.push(`${name}=${value.id || value.name }`)
          } else {
            pars.push(`${name}=${typeof value === 'string' ? encodeURIComponent(value.trim()) : value}`)
          }
        }
      })

    return pars.join('&')
  },

  isString: native.isString,
  isArray: native.isArray,
  isObject: native.isObject,
}

export default api
