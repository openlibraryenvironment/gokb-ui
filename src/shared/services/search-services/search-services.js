const api = baseServices =>
    resourceUrl => ({
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
      url: baseServices.relativeUrl(url),
    }, cancelToken)
  },

  retire (url, cancelToken) {
    return baseServices.request({
      method: 'POST',
      url: baseServices.relativeUrl(url),
    }, cancelToken)
  },
})

export default api
