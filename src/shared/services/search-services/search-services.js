const GLOBAL_SEARCH_URL = './suggest'
const SEARCH_URL = './find'

const api = baseServices => ({
  async globalSearch ({ searchPattern, componentType = '', max = 10 }, cancelToken) {
    if (!searchPattern) {
      return { records: [] }
    }
    const searchResult = await baseServices.request({ method: 'GET', url: `${GLOBAL_SEARCH_URL}?q=${searchPattern}&componentType=${componentType}&max=${max}`, cancelToken })
    return searchResult.data
  },

  async search ({ componentType, max = 10, offset = 0 }, cancelToken) {
    if (!componentType) {
      return { records: [] }
    }
    const searchResult = await baseServices.request({ method: 'GET', url: `${SEARCH_URL}?componentType=${componentType}&max=${max}&offset=${offset}`, cancelToken })
    return searchResult.data
  }
})

export default api
