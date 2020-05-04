const USER_URL = 'rest/users'

const api = (baseServices) => ({
  getUser ({ id }, cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: USER_URL,
    }, cancelToken)
  },
  createUser (data, cancelToken) {
    return baseServices.request({
      method: 'POST',
      url: USER_URL,
      data,
    }, cancelToken)
  },
})

export default api
