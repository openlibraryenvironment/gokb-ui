
const api = (baseServices) => ({
    upload (file, parameters, cancelToken) {
      const urlParameters = baseServices.createQueryParameters(parameters)
      const data = new FormData().append('file', file)
      const url = process.env.VUE_APP_YGOR_BASE_URL + `/enrichment/processCompleteWithToken?${urlParameters}`
      const result = baseServices.request({
        method: 'POST',
        url,
        data
      }, cancelToken)
      return result
    },
    export (ids, type, cancelToken) {
      if (ids.length > 1) {
        const url = `${process.env.VUE_APP_API_BASE_URL}/packages/kbart${type === 'title' ? '?exportType=title' : ''}`
        const data = { data: { ids: ids}}
        return baseServices.request({
          method: 'POST',
          url,
          data
        }, cancelToken)

      } else {
        const url = `${process.env.VUE_APP_API_BASE_URL}/packages/kbart/${ids[0]}${type === 'title' ? '&exportType=title' : ''}`
        return baseServices.request({
          method: 'GET',
          url
        }, cancelToken)
      }
    }
})

export default api
