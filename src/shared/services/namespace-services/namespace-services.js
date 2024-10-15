import namespacesModel from '@/shared/models/namespaces-model'

const PLATFORM_URL = '/rest/identifier-namespaces'

const requestNamespaces = (baseServices, cancelToken) => {
  return baseServices.request({
    method: 'GET',
    url: import.meta.env.VITE_API_BASE_URL + `${PLATFORM_URL}`,
  }, cancelToken);
}

const api = (baseServices) => ({
  async fetchNamespacesList (cancelToken) {
    let response = await requestNamespaces(baseServices, cancelToken)

    if (response?.status === 200) {
      for (const ns of response?.data?.data) {
        namespacesModel.addNamespace(ns)
      }
    }
  },
  getBaseurl(nsVal) {
    var ns = namespacesModel.getNamespace(nsVal)
    if (ns?.baseUrl) {
      return ns.baseUrl
    }
    return null
  }
})

export default api
