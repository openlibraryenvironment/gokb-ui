const USER_URL = '/rest/users'

const api = (baseServices) => ({
  getUser (id, cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: process.env.VUE_APP_API_BASE_URL + `${USER_URL}/${id}`,
    }, cancelToken)
  },
  createOrUpdateUser (id, data, cancelToken) {
    const url = id ? process.env.VUE_APP_API_BASE_URL + `${USER_URL}/${id}` : process.env.VUE_APP_API_BASE_URL + USER_URL
    return baseServices.request({
      method: id ? 'PUT' : 'POST',
      url,
      data,
    }, cancelToken)
  },
  deactivateUser (url, cancelToken) {
    return baseServices.request({
      method: 'PUT',
      url,
      data: { enabled: false },
    }, cancelToken)
  }
})

export default api
