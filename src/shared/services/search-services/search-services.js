const GLOBAL_SEARCH_URL = './api/suggest'
const FIND_URL = './api/find'
const SEARCH_URL = './search'

const api = baseServices => ({
  async globalSearch ({ searchPattern, componentType = '', max = 10 }, cancelToken) {
    if (!searchPattern) {
      return { records: [] }
    }
    const searchResult = await baseServices.request({ method: 'GET', url: `${GLOBAL_SEARCH_URL}?q=${searchPattern}&componentType=${componentType}&max=${max}`, cancelToken })
    return searchResult.data
  },

  async find (parameters = { max: 10, offset: 0 }, cancelToken) {
    const queryParameters = baseServices.createQueryParameters(parameters)
    const searchResult = await baseServices.request({ method: 'GET', url: `${FIND_URL}?${queryParameters}`, cancelToken })
    return searchResult.data
  },

  async search (parameters = { max: 10, offset: 0 }, cancelToken) {
    const queryParameters = baseServices.createQueryParameters({ ...parameters, format: 'json' })
    const searchResult = await baseServices.request({ method: 'GET', url: `${SEARCH_URL}?${queryParameters}`, useAuth: false, cancelToken })
    return searchResult.data
  }
})

export default api
