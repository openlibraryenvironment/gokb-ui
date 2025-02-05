const PROVIDER_URL = '/rest/sources'

const api = (baseServices) => ({
  getSource (id, cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: import.meta.env.VITE_API_BASE_URL + `${PROVIDER_URL}/${id}`,
    }, cancelToken)
  },
  createOrUpdateSource (data, cancelToken) {
    const { id } = data
    const url = id ? import.meta.env.VITE_API_BASE_URL + `${PROVIDER_URL}/${id}` : import.meta.env.VITE_API_BASE_URL + PROVIDER_URL
    return baseServices.request({
      method: id ? 'PUT' : 'POST',
      url,
      data,
    }, cancelToken)
  }
})

export default api
