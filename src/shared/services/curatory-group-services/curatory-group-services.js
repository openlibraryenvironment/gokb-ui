const ENDPOINT = '/rest/curatoryGroups'

const api = (baseServices) => ({
  getGroup (id, cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: process.env.VUE_APP_API_BASE_URL + `${ENDPOINT}/${id}`,
    }, cancelToken)
  },
  createOrUpdateGroup (data, cancelToken) {
    const { id } = data
    const url = id ? process.env.VUE_APP_API_BASE_URL + `${ENDPOINT}/${id}` : process.env.VUE_APP_API_BASE_URL + ENDPOINT
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
