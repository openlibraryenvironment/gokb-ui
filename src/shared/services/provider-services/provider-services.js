const PROVIDER_URL = '/rest/orgs'

const api = (baseServices) => ({
  get (id, cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: import.meta.env.VITE_API_BASE_URL + `${PROVIDER_URL}/${id}`,
    }, cancelToken)
  },
  createOrUpdate (data, cancelToken) {
    const { id } = data
    const url = id ? import.meta.env.VITE_API_BASE_URL + `${PROVIDER_URL}/${id}` : import.meta.env.VITE_API_BASE_URL + PROVIDER_URL
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
