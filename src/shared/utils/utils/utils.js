import native from '@/shared/utils/native'

let flagSaveRequests = false

const api = {
  getApiUrl () {
    return process.env.VUE_APP_API_BASE_URL
  },

  isProduction () {
    return process.env.NODE_ENV === 'production'
  },

  enableSaveRequests () {
    flagSaveRequests = true
  },

  saveRequests () {
    return flagSaveRequests || process.env.VUE_APP_SAVE_API_CALLS === 'true'
  },

  currentYear () {
    return new Date().getFullYear()
  },

  last5Years (to) {
    to = to || this.currentYear()
    return { from: to - 4, to }
  },

  // sorter for array using arithmetic
  numericSort (first, second) {
    return first - second
  },

  // sorter for array using comparison
  stringSort (first, second) {
    const firstLower = first.toLowerCase()
    const secondLower = second.toLowerCase()
    return firstLower < secondLower ? -1 : (firstLower > secondLower ? 1 : 0)
  },

  // sorter for array of array using the first element of the array using arithmetic
  numericSort4Array ([first], [second]) {
    return api.numericSort(first, second)
  },

  // sorter for array of array using the second element of the array using arithmetic
  numericSort4ArraySecondParameter ([, first], [, second]) {
    return api.numericSort(first, second)
  },

  // sorter for array of array using the first element of the array using comparison
  stringSort4Array ([first], [second]) {
    return api.stringSort(first, second)
  },

  // sorter for array of array using the second element of the array using comparison
  stringSort4ArraySecondParameter ([, first], [, second]) {
    return api.stringSort(first, second)
  },

  createStringFromStringIds (array) {
    api.isArray(array)
    return array.map(value => `'${value}'`).join(',')
  },

  createStringFromNumberIds (array) {
    api.isArray(array)
    return array.join(',')
  },

  isString: native.isString,
  isArray: native.isArray,
  isObject: native.isObject,
}

export default api
