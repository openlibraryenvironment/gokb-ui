const CACHE = {}

const api = (baseServices) =>
  (entityName) => ({
    get ({ parameters }, cancelToken) {
      const urlParameters = parameters
        ? baseServices.createQueryParameters(parameters)
        : baseServices.createQueryParameters({ _sort: 'name', _order: 'asc' })
      const url = `/rest/${entityName}?${urlParameters}`
      const result = CACHE[url] || baseServices.request({
        method: 'GET',
        url,
      }, cancelToken)
      CACHE[url] = result
      return result
    },
})

export default api
