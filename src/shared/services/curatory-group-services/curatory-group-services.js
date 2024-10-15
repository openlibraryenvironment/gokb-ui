const ENDPOINT = '/rest/curatoryGroups'

const api = (baseServices) => ({
  get (id, cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: import.meta.env.VITE_API_BASE_URL + `${ENDPOINT}/${id}`,
    }, cancelToken)
  },
  getJobs (parameter, cancelToken) {
    const urlParameter = baseServices.createQueryParameters(parameter)
    const url = import.meta.env.VITE_API_BASE_URL + `${ENDPOINT}/${parameter.id}/jobs?${urlParameter}`

    return baseServices.request({
      method: 'GET',
      url: url,
    }, cancelToken)
  },
  createOrUpdate (data, cancelToken) {
    const { id } = data
    const url = id ? import.meta.env.VITE_API_BASE_URL + `${ENDPOINT}/${id}` : import.meta.env.VITE_API_BASE_URL + ENDPOINT
    return baseServices.request({
      method: id ? 'PUT' : 'POST',
      url,
      data,
    }, cancelToken)
  },
  archiveProvider (url, cancelToken) {
    return baseServices.request({
      method: 'POST',
      url: baseServices.relativeUrl(url),
    }, cancelToken)
  },
  deleteProvider (url, cancelToken) {
    return baseServices.request({
      method: 'DELETE',
      url: baseServices.relativeUrl(url),
    }, cancelToken)
  }
})

export default api
