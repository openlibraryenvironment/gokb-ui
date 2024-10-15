const PROFILE_URL = '/rest/profile'

const api = (http, utils, tokenModel) => ({
  get (cancelToken) {
    const token = tokenModel.getToken()

    if (!!token) {
      return http.request({
        method: 'GET',
        headers: { Authorization:  `Bearer ${token}`},
        url: import.meta.env.VITE_API_BASE_URL + PROFILE_URL,
        cancelToken
      })
    } else {
      log.debug("No Token")
    }
  },
  getJobs (parameters, cancelToken) {
    const urlParameter = utils.createQueryParameters(parameters)
    const url = import.meta.env.VITE_API_BASE_URL + PROFILE_URL + `/jobs?${urlParameter}`

    const token = tokenModel.getToken()

    return http.request({
      method: 'GET',
      headers: { Authorization:  `Bearer ${token}`},
      url: url,
      cancelToken
    })
  },
  update (url, data, cancelToken) {

    const token = tokenModel.getToken()

    return http.request({
      method: 'PUT',
      headers: { Authorization:  `Bearer ${token}`},
      url,
      data,
      cancelToken
    })
  },
  delete (url, cancelToken) {

    const token = tokenModel.getToken()

    return http.request({
      method: 'DELETE',
      headers: { Authorization:  `Bearer ${token}`},
      url,
      cancelToken
    })
  },
  cancelJob (id, cancelToken) {
    const token = tokenModel.getToken()
    const url = import.meta.env.VITE_API_BASE_URL + `/rest/jobs/${id}/cancel`

    return http.request({
      method: 'PATCH',
      headers: { Authorization:  `Bearer ${token}`},
      url,
      cancelToken
    })
  }
})

export default api
