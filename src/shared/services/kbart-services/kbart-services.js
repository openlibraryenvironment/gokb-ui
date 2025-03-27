
const api = (baseServices) => ({
    export (ids, type, cancelToken) {
      if (ids.length > 1) {
        const url = `${import.meta.env.VITE_API_BASE_URL}/packages/kbart${type === 'title' ? '?exportType=title' : ''}`
        const data = { data: { ids: ids}}
        return baseServices.request({
          method: 'POST',
          url,
          data
        }, cancelToken)

      } else {
        const url = `${import.meta.env.VITE_API_BASE_URL}/packages/kbart/${ids[0]}${type === 'title' ? '&exportType=title' : ''}`
        return baseServices.request({
          method: 'GET',
          url
        }, cancelToken)
      }
    },
    validate (file, namespace, strict, namespaceSerial, namespaceMonograph, cancelToken) {
      const data = new FormData()
      data.append('submissionFile', file)
      if (namespace) {
        data.append('namespace', namespace)
      }
      if (namespaceSerial) {
        data.append('namespaceSerial', namespaceSerial)
      }
      if (namespaceMonograph) {
        data.append('namespaceMonograph', namespaceMonograph)
      }
      if (strict) {
        data.append('strict', 'true')
      }

      const url = import.meta.env.VITE_API_BASE_URL + `/validation/kbart`
      const result = baseServices.request({
        method: 'POST',
        url,
        data
      }, cancelToken)
      return result
    }
})

export default api
