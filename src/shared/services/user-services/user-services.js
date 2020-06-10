const USER_URL = 'rest/users'

const api = (baseServices) => ({
  getUser (id, cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: `${USER_URL}/${id}`,
    }, cancelToken)
  },
  createOrUpdateUser (data, cancelToken) {
    const { id } = data
    const url = id ? `${USER_URL}/${id}` : USER_URL
    return baseServices.request({
      method: id ? 'PATCH' : 'POST',
      url,
      data,
    }, cancelToken)
  },
  deactivateUser (url, cancelToken) {
    return baseServices.request({
      method: 'PATCH',
      url,
      data: { enabled: false },
    }, cancelToken)
  }
})

export default api
