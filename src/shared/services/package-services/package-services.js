const PACKAGE_URL = 'rest/packages'

const api = (baseServices) => ({
  createOrUpdatePackage (data, cancelToken) {
    const { id } = data
    const url = id ? `${PACKAGE_URL}/${id}` : PACKAGE_URL
    return baseServices.request({
      method: id ? 'PATCH' : 'POST',
      url,
      data,
    }, cancelToken)
  },
})

export default api
