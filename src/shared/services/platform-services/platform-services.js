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
  },
  checkPlatformFields (data, fieldList, cancelToken) {
    const filteredData = Object.keys(data)
    .filter(key => fieldList.includes(key))
    .reduce((obj, key) => {
      obj[key] = data[key];
      return obj;
    }, {});
    const queryParameters = baseServices.createQueryParameters(filteredData)
    const url = process.env.VUE_APP_API_BASE_URL + `${PLATFORM_URL}/match?${queryParameters}`
    return baseServices.request({
      method: 'GET',
      url
    }, cancelToken)
  }
})

export default api
