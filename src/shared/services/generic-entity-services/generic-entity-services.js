const api = (baseServices) =>
  (entityName) => ({
    get ({ parameters }, cancelToken) {
      const urlParameters = baseServices.createQueryParameters({ _sort: 'name', _order: 'asc' })
      const url = `/rest/${entityName}?${urlParameters}`
      return baseServices.request({
        method: 'GET',
        url,
      }, cancelToken)
    },
})

export default api
