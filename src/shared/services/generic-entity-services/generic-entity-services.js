const api = (baseServices) =>
  (entityName) => ({
    getAll (cancelToken) {
      const url = `/rest/${entityName}`
      return baseServices.request({
        method: 'GET',
        url,
      }, cancelToken)
    },
})

export default api
