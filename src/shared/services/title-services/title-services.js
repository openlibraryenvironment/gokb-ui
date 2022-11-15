const PROVIDER_URL = '/rest/titles'

const api = (baseServices) => ({
  getTitle (id, cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: process.env.VUE_APP_API_BASE_URL + `${PROVIDER_URL}/${id}?history=true`,
    }, cancelToken)
  },
  getTipps (id, parameter, cancelToken) {
    const urlParameter = baseServices.createQueryParameters(parameter)

    return baseServices.request({
      method: 'GET',
      url: process.env.VUE_APP_API_BASE_URL + `${PROVIDER_URL}/${id}/tipps?${urlParameter}`,
    }, cancelToken)
  },
  createOrUpdateTitle (data, cancelToken) {
    const { id } = data
    const url = id ? process.env.VUE_APP_API_BASE_URL + `${PROVIDER_URL}/${id}` : process.env.VUE_APP_API_BASE_URL + PROVIDER_URL
    return baseServices.request({
      method: id ? 'PUT' : 'POST',
      url,
      data,
    }, cancelToken)
  },
  updateHistory (id, data, cancelToken) {
    const url = process.env.VUE_APP_API_BASE_URL + `${PROVIDER_URL}/${id}/history`
    return baseServices.request({
      method: 'PUT',
      url,
      data,
    }, cancelToken)
  },
  archiveTitle (url, cancelToken) {
    return baseServices.request({
      method: 'POST',
      url: baseServices.relativeUrl(url) + '/retire',
    }, cancelToken)
  },
  deleteTitle (url, cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: baseServices.relativeUrl(url),
    }, cancelToken)
  },
  mergeTitle (data, cancelToken) {
    const { id } = data
    const url = process.env.VUE_APP_API_BASE_URL + `${PROVIDER_URL}/${id}/merge`
    const parameterData = {}
    parameterData['target'] = data['target']
    parameterData['ids'] = data['ids']
    parameterData['mergeTipps'] = true
    const queryParameters = baseServices.createQueryParameters(parameterData)
    console.log("queryParameters: " + queryParameters)
    /* return baseServices.request({
      method: 'PUT',
      url,
      data,
    }, cancelToken) */
  }
})

export default api
