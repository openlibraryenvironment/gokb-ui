const PLATFORM_URL = '/rest/platforms'

const api = (baseServices) => ({
  get (id, cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: import.meta.env.VITE_API_BASE_URL + `${PLATFORM_URL}/${id}`,
    }, cancelToken)
  },
  createOrUpdate (data, cancelToken) {
    const { id } = data
    const url = id ? import.meta.env.VITE_API_BASE_URL + `${PLATFORM_URL}/${id}` : import.meta.env.VITE_API_BASE_URL + PLATFORM_URL
    return baseServices.request({
      method: id ? 'PUT' : 'POST',
      url,
      data,
    }, cancelToken)
  },
  check (data, cancelToken) {
    const filteredData = {}
    filteredData['name'] = data['name']
    filteredData['primaryUrl'] = data['primaryUrl']
    const queryParameters = baseServices.createQueryParameters(filteredData)
    const url = import.meta.env.VITE_API_BASE_URL + `${PLATFORM_URL}/match?${queryParameters}`
    return baseServices.request({
      method: 'GET',
      url
    }, cancelToken)
  }
})

export default api
