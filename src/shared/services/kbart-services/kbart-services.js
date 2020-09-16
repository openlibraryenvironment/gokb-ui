
const api = (baseServices) => ({
    upload (file, parameters, cancelToken) {
      const urlParameters = baseServices.createQueryParameters(parameters)
      const data = new FormData().append('file', file)
      const url = process.env.VUE_APP_YGOR_BASE_URL + `/enrichment/processCompleteNoInteraction?${urlParameters}`
      const result = baseServices.request({
        method: 'POST',
        url,
        data
      }, cancelToken)
      return result
    },
})

export default api
