const PROFILE_URL = '/rest/profile'

const api = (baseServices) => ({
  getProfile (cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: process.env.VUE_APP_API_BASE_URL + PROFILE_URL,
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
