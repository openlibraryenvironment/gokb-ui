
const api = baseServices => ({
  async show ({ oid, withCombos = false }, cancelToken) {
    const result = await baseServices.request({ method: 'GET', url: `./api/show?oid=${oid}&withCombos=${withCombos}`, cancelToken })
    return result.data
  },
})

export default api
