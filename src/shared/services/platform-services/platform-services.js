const PLATFORM_URL = '/rest/platforms'

const api = (baseServices) => ({
  getPlatform (id, cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: process.env.VUE_APP_API_BASE_URL + `${PLATFORM_URL}/${id}`,
    }, cancelToken)
  },
  createOrUpdatePlatform (data, cancelToken) {
    const { id } = data
    const url = id ? process.env.VUE_APP_API_BASE_URL + `${PLATFORM_URL}/${id}` : process.env.VUE_APP_API_BASE_URL + PLATFORM_URL
    return baseServices.request({
      method: id ? 'PUT' : 'POST',
      url,
      data,
    }, cancelToken)
  }
})

export default api
