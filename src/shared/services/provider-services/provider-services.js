// const USER_URL = 'rest/provider'

const api = (baseServices) => ({
  archiveProvider (url, cancelToken) {
    return baseServices.request({
      method: 'POST',
      url,
    }, cancelToken)
  },
  deleteProvider (url, cancelToken) {
    return baseServices.request({
      method: 'DELETE',
      url,
    }, cancelToken)
  }
})

export default api
