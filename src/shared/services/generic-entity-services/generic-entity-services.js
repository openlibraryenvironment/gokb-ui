const CACHE = {}

const api = (baseServices) =>
  (entityName) => ({
    get ({ parameters }, cancelToken) {
      const urlParameters = parameters
        ? baseServices.createQueryParameters(parameters)
        : baseServices.createQueryParameters({ _sort: 'name', _order: 'asc' })
      const url = process.env.VUE_APP_API_BASE_URL + `/rest/${entityName}?${urlParameters}`
      const result = CACHE[url] || baseServices.request({
        method: 'GET',
        url,
      }, cancelToken)
      CACHE[url] = result
      return result
    },
})

export default api
