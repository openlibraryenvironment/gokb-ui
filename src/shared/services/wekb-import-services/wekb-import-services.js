const WEKB_IMPORT_URL = '/wekb'

const api = (baseServices) => ({
  get (cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: process.env.VUE_APP_API_BASE_URL + WEKB_IMPORT_URL,
    }, cancelToken)
  },
  getPackageMetaData (parameter, cancelToken) {
    const urlParameter = baseServices.createQueryParameters(parameter)
    const url = process.env.VUE_APP_API_BASE_URL + WEKB_IMPORT_URL + `/package?${urlParameter}`

    return baseServices.request({
      method: 'GET',
      url: url,
    }, cancelToken)
  },
  getPlatformMetadata (parameter, cancelToken) {
    const urlParameter = baseServices.createQueryParameters(parameter)
    const url = process.env.VUE_APP_API_BASE_URL + WEKB_IMPORT_URL + `/platform?${urlParameter}`

    return baseServices.request({
      method: 'GET',
      url: url,
    }, cancelToken)
  },
  getTippsOfPackage (parameter, cancelToken) {
    const urlParameter = baseServices.createQueryParameters(parameter)
    const url = process.env.VUE_APP_API_BASE_URL + WEKB_IMPORT_URL + `/tipps?${urlParameter}`

    return baseServices.request({
      method: 'GET',
      url: url,
    }, cancelToken)
  },
  getProviderData (parameter, cancelToken) {
    const urlParameter = baseServices.createQueryParameters(parameter)
    const url = process.env.VUE_APP_API_BASE_URL + WEKB_IMPORT_URL + `/provider?${urlParameter}`

    return baseServices.request({
      method: 'GET',
      url: url,
    }, cancelToken)
  },
  /*checkIfProviderExists(data, cancelToken) {
    const urlParameter = baseServices.createQueryParameters(parameter)
    const url = process.env.VUE_APP_API_BASE_URL + WEKB_IMPORT_URL + `/providerExists`

    return baseServices.request({
      method: 'POST',
      url: url,
      data: data
    }, cancelToken)
  },
  submitImport(data, cancelToken) {
    const url = process.env.VUE_APP_API_BASE_URL + WEKB_IMPORT_URL + `/collect`
    return baseServices.request({
      method: 'POST',
      url: url,
      data: data
    }, cancelToken)
  }, */
})

export default api
