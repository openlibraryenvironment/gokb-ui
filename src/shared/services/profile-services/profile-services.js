const PROFILE_URL = 'rest/profile'

const api = (baseServices) => ({
  getProfile (cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: PROFILE_URL,
    }, cancelToken)
  },
  updateProfile (url, data, cancelToken) {
    return baseServices.request({
      method: 'PATCH',
      url,
      data,
    }, cancelToken)
  },
  deleteProfile (url, cancelToken) {
    return baseServices.request({
      method: 'DELETE',
      url,
    }, cancelToken)
  }
})

export default api
