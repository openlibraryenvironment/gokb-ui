const PACKAGE_URL = '/rest/packages'

const api = (baseServices) => ({
  getPackage (id, cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: process.env.VUE_APP_API_BASE_URL + `${PACKAGE_URL}/${id}`,
    }, cancelToken)
  },
  getTipps (id, parameter, cancelToken) {
    const urlParameter = baseServices.createQueryParameters(parameter)

    return baseServices.request({
      method: 'GET',
      url: process.env.VUE_APP_API_BASE_URL + `${PACKAGE_URL}/${id}/tipps?${urlParameter}`,
    }, cancelToken)
  },
  createOrUpdatePackage (data, cancelToken) {
    const { id } = data
    const url = id ? process.env.VUE_APP_API_BASE_URL + `${PACKAGE_URL}/${id}` : process.env.VUE_APP_API_BASE_URL + PACKAGE_URL
    return baseServices.request({
      method: id ? 'PUT' : 'POST',
      url,
      data,
    }, cancelToken)
  },
  triggerSourceUpdate (id, parameters, cancelToken) {
    const urlParameter = baseServices.createQueryParameters(parameters)
    return baseServices.request({
      method: 'GET',
      url: process.env.VUE_APP_API_BASE_URL + `${PACKAGE_URL}/${id}/triggerSourceUpdate?${urlParameter}`
    }, cancelToken)
  },
  ingestKbart (id, file, parameters, cancelToken) {
    const data = new FormData()
    const urlParameter = baseServices.createQueryParameters(parameters)

    if (file) {
      data.append('submissionFile', file)
    }

    return baseServices.request({
      method: 'POST',
      url: process.env.VUE_APP_API_BASE_URL + `${PACKAGE_URL}/${id}/ingest?${urlParameter}`,
      data,
    }, cancelToken)
  },
  archivePackage (url, cancelToken) {
    return baseServices.request({
      method: 'POST',
      url: baseServices.relativeUrl(url) + '/retire',
    }, cancelToken)
  },
  deletePackage (url, cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: baseServices.relativeUrl(url),
    }, cancelToken)
  }
})

export default api
