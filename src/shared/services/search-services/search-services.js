const api = baseServices =>
    resourceUrl => ({
  search (parameter, cancelToken) {
    const urlParameter = baseServices.createQueryParameters(parameter)
    const url = process.env.VUE_APP_API_BASE_URL + `/${resourceUrl}?${urlParameter}`
    return baseServices.request({
      method: 'GET',
      url,
    }, cancelToken)
  },

  delete (url, cancelToken) {
    return baseServices.request({
      method: 'GET',
      url,
    }, cancelToken)
  },

  retire (url, cancelToken) {
    return baseServices.request({
      method: 'POST',
      url: url + '/retire',
    }, cancelToken)
  },
})

export default api
