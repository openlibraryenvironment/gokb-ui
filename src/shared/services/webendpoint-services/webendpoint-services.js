const WEBENDPOINT_URL = '/rest/web-endpoint'

const api = (baseServices) => ({
  get (id, cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: import.meta.env.VITE_API_BASE_URL + `${WEBENDPOINT_URL}/${id}`,
    }, cancelToken)
  },
  check (data, cancelToken) {
    return baseServices.request({
      method: 'POST',
      url: import.meta.env.VITE_API_BASE_URL + WEBENDPOINT_URL + '/check',
      data: data
    }, cancelToken)
  }
})

export default api
