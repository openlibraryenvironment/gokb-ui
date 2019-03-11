
const resourceServices = baseServices => ({
  async show ({ oid, withCombos = false }, cancelToken) {
    const result = await baseServices.request({ method: 'GET', url: `/show?oid=${oid}&withCombos=${withCombos}`, cancelToken })
    return result.data
  },
})

export default resourceServices
