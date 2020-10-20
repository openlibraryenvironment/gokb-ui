const REVIEW_PATH = '/rest/reviews'

const api = (baseServices) => ({
  get ({ parameters }, cancelToken) {
    const urlParameters = baseServices.createQueryParameters(parameters)
    const url = process.env.VUE_APP_API_BASE_URL + `${REVIEW_PATH}?${urlParameters}`
    return baseServices.request({
      method: 'GET',
      url,
    }, cancelToken)
  },

  getReview (id, cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: process.env.VUE_APP_API_BASE_URL + `${REVIEW_PATH}/${id}`,
    }, cancelToken)
  },

  createOrUpdateReview (data, cancelToken) {
    const { id } = data
    const url = id ? process.env.VUE_APP_API_BASE_URL + `${REVIEW_PATH}/${id}` : process.env.VUE_APP_API_BASE_URL + REVIEW_PATH
    return baseServices.request({
      method: id ? 'PUT' : 'POST',
      url,
      data,
    }, cancelToken)
  },

  closeReview (url, cancelToken) {
    return baseServices.request({
      method: 'PATCH',
      url: url,
      data: { status: 'Closed' },
    }, cancelToken)
  }
})

export default api
