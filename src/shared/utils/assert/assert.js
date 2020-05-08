import native from '@/shared/utils/native'

const api = log => ({
  isDefined: (value, message = `value is undefined`) => log.assert(value !== undefined, message),

  isUndefined: (value, message = `value is defined`) => log.assert(value === undefined, message),

  isTrue: (value, message = `value is not true`) => log.assert(value, message),

  isFalse: (value, message = `value is not false`) => log.assert(!value, message),

  equals: (actual, expected, message = `${actual} !== ${expected}`) => log.assert(actual === expected, message),

  isString: (value, message = `${value} is not a string`) => log.assert(native.isString(value), message),

  isArray: (value, message = `${value} is not an array`) => log.assert(native.isArray(value), message),
})

export default api
