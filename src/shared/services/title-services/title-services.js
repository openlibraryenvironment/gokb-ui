const PROVIDER_URL = 'rest/titles'

const api = (baseServices) => ({
  getTitle (id, cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: `${PROVIDER_URL}/${id}`,
    }, cancelToken)
  },
  createOrUpdateTitle (data, cancelToken) {
    const { id } = data
    const url = id ? `${PROVIDER_URL}/${id}` : PROVIDER_URL
    return baseServices.request({
      method: id ? 'PUT' : 'POST',
      url,
      data,
    }, cancelToken)
  },
  archiveTitle (url, cancelToken) {
    return baseServices.request({
      method: 'POST',
      url: baseServices.relativeUrl(url),
    }, cancelToken)
  },
  deleteTitle (url, cancelToken) {
    return baseServices.request({
      method: 'DELETE',
      url: baseServices.relativeUrl(url),
    }, cancelToken)
  }
})

export default api
