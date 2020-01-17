const api = (baseServices) => ({
  getProfile (cancelToken) {
    const url = 'rest/profile'
    return baseServices.request({
      method: 'GET',
      url,
    }, cancelToken)
  },
  updateProfile (url, data, cancelToken) {
    return baseServices.request({
      method: 'patch',
      url,
      data,
    }, cancelToken)
  },
  deleteProfile (url, cancelToken) {
    return baseServices.request({
      method: 'delete',
      url,
    }, cancelToken)
  },
})

export default api
