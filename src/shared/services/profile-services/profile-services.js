const PROFILE_URL = '/rest/profile'

const api = (baseServices) => ({
  get (cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: process.env.VUE_APP_API_BASE_URL + PROFILE_URL,
    }, cancelToken)
  },
  getJobs (parameter, cancelToken) {
    const urlParameter = baseServices.createQueryParameters(parameter)
    const url = process.env.VUE_APP_API_BASE_URL + PROFILE_URL + `/jobs?${urlParameter}`

    return baseServices.request({
      method: 'GET',
      url: url,
    }, cancelToken)
  },
  update (url, data, cancelToken) {
    return baseServices.request({
      method: 'PUT',
      url,
      data,
    }, cancelToken)
  },
  delete (url, cancelToken) {
    return baseServices.request({
      method: 'DELETE',
      url,
    }, cancelToken)
  },
  cancelJob (id, cancelToken) {
    const url = process.env.VUE_APP_API_BASE_URL + `/rest/jobs/${id}/cancel`
    return baseServices.request({
      method: 'PATCH',
      url,
    }, cancelToken)
  }
})

export default api
