const PROVIDER_URL = '/rest/titles'

const api = (baseServices) => ({
  get (id, cancelToken) {
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
  createOrUpdate (data, cancelToken) {
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
  archive (url, cancelToken) {
    return baseServices.request({
      method: 'POST',
      url: baseServices.relativeUrl(url) + '/retire',
    }, cancelToken)
  },
  delete (url, cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: baseServices.relativeUrl(url) + '/delete',
    }, cancelToken)
  },
  merge (data, params, cancelToken) {
    const { id, target, ids, tipps } = data
    let parameterData = { target: target }

    if (!!ids) {
      parameterData.ids = ids.map(id => id.id)
    } else if (params.mergeIds) {
      parameterData.mergeIds = true
    }

    if (!!tipps) {
      parameterData.tipps = tipps.map(id => id.id)
    } else if (params.mergeTipps) {
      parameterData.mergeTipps = true
    }

    const queryParameters = baseServices.createQueryParameters(parameterData)
    const url = process.env.VUE_APP_API_BASE_URL + `${PROVIDER_URL}/${id}/merge?${queryParameters}`
    return baseServices.request({
      method: 'PUT',
      url,
      data,
    }, cancelToken)
  }
})

export default api
