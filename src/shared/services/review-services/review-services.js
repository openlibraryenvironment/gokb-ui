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

  closeReview (url, cancelToken) {
    return baseServices.request({
      method: 'PATCH',
      url: baseServices.relativeUrl(url),
      data: { enabled: false },
    }, cancelToken)
  }
})

export default api
