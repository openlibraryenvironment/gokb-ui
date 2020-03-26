const api = baseServices =>
    resourceUrl => ({
  // async globalSearch ({ searchPattern, componentType = '', max = 10 }, cancelToken) {
  //   if (!searchPattern) {
  //     return { records: [] }
  //   }
  //   const searchResult = await baseServices.request({
  //     method: 'GET',
  //     url: `${GLOBAL_SEARCH_URL}?q=${searchPattern}&componentType=${componentType}&max=${max}`
  //   }, cancelToken)
  //   return searchResult.data
  // },
  //
  // async find (parameters = { max: 10, offset: 0 }, cancelToken) {
  //   const queryParameters = baseServices.createQueryParameters(parameters)
  //   const searchResult = await baseServices.request({
  //     method: 'GET',
  //     url: `${FIND_URL}?${queryParameters}`
  //   }, cancelToken)
  //   return searchResult.data
  // },

  search (parameter, cancelToken) {
    const urlParameter = baseServices.createQueryParameters(parameter)
    const url = `${resourceUrl}?${urlParameter}`
    return baseServices.request({
      method: 'GET', url,
    }, cancelToken)
  },

  delete (url, cancelToken) {
    return baseServices.request({
      method: 'DELETE',
      url,
    }, cancelToken)
  },
})

export default api
