const TIPP_PATH = '/rest/tipps'

const api = (baseServices) => ({
  get (id, cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: import.meta.env.VITE_API_BASE_URL + `${TIPP_PATH}/${id}`,
    }, cancelToken)
  },
  createOrUpdate (data, cancelToken) {
    const { id } = data
    const url = id ? import.meta.env.VITE_API_BASE_URL + `${TIPP_PATH}/${id}` : import.meta.env.VITE_API_BASE_URL + TIPP_PATH
    return baseServices.request({
      method: id ? 'PUT' : 'POST',
      url,
      data,
    }, cancelToken)
  },
  archive (url, cancelToken) {
    return baseServices.request({
      method: 'POST',
      url: baseServices.relativeUrl(url) + '/retire',
      data: { status: 'Retired' }
    }, cancelToken)
  },
  delete (url, cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: baseServices.relativeUrl(url),
    }, cancelToken)
  },
  bulkUpdate (parameters, field, value, cancelToken) {
    const urlParameters = baseServices.createQueryParameters(parameters)
    const url = import.meta.env.VITE_API_BASE_URL + `${TIPP_PATH}/bulk?_field=${field}&_value=${value}&${urlParameters}`

    return baseServices.request({
      method: 'GET',
      url,
    }, cancelToken)
  },
  bulkUpdateStatus (body, cancelToken) {
    const url = import.meta.env.VITE_API_BASE_URL + `${TIPP_PATH}/bulk`

    return baseServices.request({
      method: 'POST',
      data: body,
      url,
    }, cancelToken)
  },
  updateStatus (id, status, cancelToken) {
    const url = import.meta.env.VITE_API_BASE_URL + `${TIPP_PATH}/${id}/set-status?status=${status}`

    return baseServices.request({
      method: 'GET',
      url,
    }, cancelToken)
  },
  merge (data, params, cancelToken) {
    const { id, target } = data
    let parameterData = { target: target }

    if (params.keepOld) {
      parameterData.keepOld = true
    }

    const queryParameters = baseServices.createQueryParameters(parameterData)
    const url = import.meta.env.VITE_API_BASE_URL + `${TIPP_PATH}/${id}/merge?${queryParameters}`
    return baseServices.request({
      method: 'PUT',
      url,
      data,
    }, cancelToken)
  },
  cleanup (id, cancelToken) {
    const url = import.meta.env.VITE_API_BASE_URL + `${TIPP_PATH}/${id}/merge`
    return baseServices.request({
      method: 'PUT',
      url
    }, cancelToken)
  }
})

export default api
