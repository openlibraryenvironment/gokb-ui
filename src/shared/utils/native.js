export default {
  isObject (value) {
    return value !== null && typeof value === 'object'
  },
  isString (value) {
    return typeof value === 'string'
  },
  isArray (value) {
    return Array.isArray(value)
  }
}
