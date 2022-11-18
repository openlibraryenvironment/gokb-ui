const IDENTIFIER_URL = '/rest/identifiers'

const api = (baseServices) => ({
  getIdentifier (id, cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: process.env.VUE_APP_API_BASE_URL + `${IDENTIFIER_URL}/${id}`,
    }, cancelToken)
  },
  createOrUpdateIdentifier (data, cancelToken) {
    const { id } = data
    const url = id ? process.env.VUE_APP_API_BASE_URL + `${IDENTIFIER_URL}/${id}` : process.env.VUE_APP_API_BASE_URL + IDENTIFIER_URL
    return baseServices.request({
      method: id ? 'PUT' : 'POST',
      url,
      data,
    }, cancelToken)
  },
  archiveIdentifier (url, cancelToken) {
    return baseServices.request({
      method: 'POST',
      url: baseServices.relativeUrl(url)  + '/retire',
    }, cancelToken)
  },
  deleteIdentifier (url, cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: baseServices.relativeUrl(url),
    }, cancelToken)
  }
})

export default api
