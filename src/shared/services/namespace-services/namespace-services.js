import namespacesModel from '@/shared/models/namespaces-model'

const PLATFORM_URL = '/rest/identifier-namespaces'

const requestNamespaces = (baseServices, cancelToken) => {
  return baseServices.request({
    method: 'GET',
    url: process.env.VUE_APP_API_BASE_URL + `${PLATFORM_URL}`,
  }, cancelToken);
}

const api = (baseServices) => ({
  async fetchNamespacesList (cancelToken) {
    var allNss = await requestNamespaces(baseServices, cancelToken)
    for (const ns of allNss.data?.data) {
      namespacesModel.addNamespace(ns)
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
