const USER_URL = '/rest/users'

const api = (baseServices) => ({
  get (id, cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: process.env.VUE_APP_API_BASE_URL + `${USER_URL}/${id}`,
    }, cancelToken)
  },
  createOrUpdate (id, data, cancelToken) {
    const url = id ? process.env.VUE_APP_API_BASE_URL + `${USER_URL}/${id}` : process.env.VUE_APP_API_BASE_URL + USER_URL
    return baseServices.request({
      method: id ? 'PUT' : 'POST',
      url,
      data,
    }, cancelToken)
  },
  deactivate (url, cancelToken) {
    return baseServices.request({
      method: 'PUT',
      url,
      data: { enabled: false },
    }, cancelToken)
  },
  activate (id, sendAlert, cancelToken) {
    return baseServices.request({
      method: 'PATCH',
      url: process.env.VUE_APP_API_BASE_URL + `${USER_URL}/${id}/activate?sendAlert=${sendAlert}`
    }, cancelToken)
  }
})

export default api
