const LOOKUP_URL = './ajaxSupport/lookup'

const api = baseServices => ({
  async lookup (parameters, cancelToken) {
    const queryParameters = baseServices.createQueryParameters(parameters)
    const result = await baseServices.request({
      method: 'GET',
      url: `${LOOKUP_URL}?${queryParameters}`,
      cancelToken
    })
    return result.data
  },
})

export default api
