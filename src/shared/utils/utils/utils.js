import native from '@/shared/utils/native'
import { toRaw } from 'vue'

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

  toRawDeep(observed) {
    const val = toRaw(observed)

    if (Array.isArray(val)) {
      return val.map(item => this.toRawDeep(item))
    }

    if (val === null) return null

    if (typeof val === 'object') {
      const entries = Object.entries(val).map(([key, val]) => [key, this.toRawDeep(val)])

      return Object.fromEntries(entries)
    }

    return val
  },

  hasLinkedFieldChanged(old_val, new_val) {
    if (!old_val && !!new_val) {
      return true
    }
    else if (!!old_val) {
      if (!new_val) {
        return true
      }
      else if (typeof new_val === 'number' && old_val.id !== new_val) {
        return true
      }
      else if (typeof new_val === 'string' && old_val.name !== new_val) {
        return true
      }
      else if (typeof new_val === 'object' && old_val.id !== new_val.id) {
        return true
      }
    }

    return false
  },

  isString: native.isString,
  isArray: native.isArray,
  isObject: native.isObject,
}

export default api
