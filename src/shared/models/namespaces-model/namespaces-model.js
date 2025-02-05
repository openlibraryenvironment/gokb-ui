const api = (reactive) => {
  const namespaces = reactive({})

  return {
    addNamespace (ns) {
      if (this.isValid(ns)) {
        namespaces[ns.value] = ns
      }
    },
    isValid (ns) {
      if (!ns || !ns.value) {
        return false
      }
      return true
    },
    getNamespace (nsVal) {
      return namespaces[nsVal]
    }
  }
}

export default api
