const IDENTIFIER_URL = '/rest/identifiers'

const api = (baseServices) => ({
  get (id, cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: process.env.VUE_APP_API_BASE_URL + `${IDENTIFIER_URL}/${id}`,
    }, cancelToken)
  },
  createOrUpdate (data, cancelToken) {
    const { id } = data
    const url = id ? process.env.VUE_APP_API_BASE_URL + `${IDENTIFIER_URL}/${id}` : process.env.VUE_APP_API_BASE_URL + IDENTIFIER_URL
    return baseServices.request({
      method: id ? 'PUT' : 'POST',
      url,
      data,
    }, cancelToken)
  },
  archive (url, cancelToken) {
    return baseServices.request({
      method: 'POST',
      url: baseServices.relativeUrl(url)  + '/retire',
    }, cancelToken)
  },
  delete (url, cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: baseServices.relativeUrl(url),
    }, cancelToken)
  }
})

export default api
