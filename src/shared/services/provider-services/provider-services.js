const PROVIDER_URL = '/rest/provider'

const api = (baseServices) => ({
  getProvider (id, cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: process.env.VUE_APP_API_BASE_URL + `${PROVIDER_URL}/${id}`,
    }, cancelToken)
  },
  createOrUpdateProvider (data, cancelToken) {
    const { id } = data
    const url = id ? process.env.VUE_APP_API_BASE_URL + `${PROVIDER_URL}/${id}` : process.env.VUE_APP_API_BASE_URL + PROVIDER_URL
    return baseServices.request({
      method: id ? 'PUT' : 'POST',
      url,
      data,
    }, cancelToken)
  },
  archiveProvider (url, cancelToken) {
    return baseServices.request({
      method: 'POST',
      url: baseServices.relativeUrl(url),
    }, cancelToken)
  },
  deleteProvider (url, cancelToken) {
    return baseServices.request({
      method: 'DELETE',
      url: baseServices.relativeUrl(url),
    }, cancelToken)
  }
})

export default api
