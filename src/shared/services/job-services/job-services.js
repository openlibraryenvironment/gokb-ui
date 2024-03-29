const REST_PATH = '/rest/jobs'

const api = (baseServices) => ({
  search (parameters, cancelToken) {
    const urlParameters = baseServices.createQueryParameters(parameters)
    const url = process.env.VUE_APP_API_BASE_URL + `${REST_PATH}?${urlParameters}`
    return baseServices.request({
      method: 'GET',
      url,
    }, cancelToken)
  },

  get (id, archived, cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: process.env.VUE_APP_API_BASE_URL + `${REST_PATH}/${id}${archived ? '?archived=true' : ''}`,
    }, cancelToken)
  },

  cancel (data, cancelToken) {
    const { id } = data
    const url = id ? process.env.VUE_APP_API_BASE_URL + `${REST_PATH}/${id}` : process.env.VUE_APP_API_BASE_URL + REST_PATH
    return baseServices.request({
      method: id ? 'PUT' : 'POST',
      url,
      data,
    }, cancelToken)
  }
})

export default api
