const api = (baseServices) =>
  (entityName) => ({
    get ({ parameters }, cancelToken) {
      const urlParameters = parameters
        ? baseServices.createQueryParameters(parameters)
        : baseServices.createQueryParameters({ _sort: 'name', _order: 'asc' })
      const url = `/rest/${entityName}?${urlParameters}`
      return baseServices.request({
        method: 'GET',
        url,
      }, cancelToken)
    },
})

export default api
