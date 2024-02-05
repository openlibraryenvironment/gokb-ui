const CACHE = {}

const api = (baseServices) =>
  (entityName) => ({
    get ({ parameters }, cancelToken) {
      const urlParameters = parameters
        ? baseServices.createQueryParameters(parameters)
        : baseServices.createQueryParameters({ _sort: 'name', _order: 'asc' })
      const url = import.meta.env.VITE_API_BASE_URL + `/rest/${entityName}?${urlParameters}`
      const result = CACHE[url]?.length > 0 || baseServices.request({
        method: 'GET',
        url,
      }, cancelToken)
      CACHE[url] = result
      return result
    },

    checkNewName (name, type, cancelToken) {
      const url = import.meta.env.VITE_API_BASE_URL + `/validation/componentName?value=${name}&componentType=${type}`
      const result = baseServices.request({
        method: 'GET',
        url
      }, cancelToken)
      return result
    },

    checkIdentifier (value, namespace, cancelToken) {
      const url = import.meta.env.VITE_API_BASE_URL + `/validation/identifier?value=${value}&namespace=${namespace}`
      const result = baseServices.request({
        method: 'GET',
        url
      }, cancelToken)
      return result
    },

    checkUrl (value, cancelToken) {
      const url = import.meta.env.VITE_API_BASE_URL + `/validation/url`
      const data = { value: value }
      const result = baseServices.request({
        method: 'POST',
        url,
        data
      }, cancelToken)
      return result
    }
})

export default api
