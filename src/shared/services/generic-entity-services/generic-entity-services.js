const CACHE = {}

const api = (baseServices) =>
  (entityName) => ({
    get ({ parameters }, cancelToken) {
      const urlParameters = parameters
        ? baseServices.createQueryParameters(parameters)
        : baseServices.createQueryParameters({ _sort: 'name', _order: 'asc' })
      const url = process.env.VUE_APP_API_BASE_URL + `/rest/${entityName}?${urlParameters}`
      const result = CACHE[url]?.length > 0 || baseServices.request({
        method: 'GET',
        url,
      }, cancelToken)
      CACHE[url] = result
      return result
    },

    checkNewName (name, type, cancelToken) {
      const url = process.env.VUE_APP_API_BASE_URL + `/validation/componentName?value=${name}&componentType=${type}`
      const result = baseServices.request({
        method: 'GET',
        url
      }, cancelToken)
      return result
    },

    checkIdentifier (value, namespace, cancelToken) {
      const url = process.env.VUE_APP_API_BASE_URL + `/validation/identifier?value=${value}&namespace=${namespace}`
      const result = baseServices.request({
        method: 'GET',
        url
      }, cancelToken)
      return result
    }
})

export default api
