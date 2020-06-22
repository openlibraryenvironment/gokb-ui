const api = (baseServices) => ({
  closeReview (url, cancelToken) {
    return baseServices.request({
      method: 'PATCH',
      url,
      data: { enabled: false },
    }, cancelToken)
  }
})

export default api
