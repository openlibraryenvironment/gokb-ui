const REVIEW_PATH = '/rest/reviews'

const api = (baseServices) => ({
  get ({ parameters }, cancelToken) {
    const urlParameters = baseServices.createQueryParameters(parameters)
    const url = `${REVIEW_PATH}?${urlParameters}`
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
