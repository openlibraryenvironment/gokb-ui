const api = (vue) => {
  const namespaces = vue.observable({})

  return {
    addNamespace (ns) {
      if (this.isValid(ns)) {
        namespaces[ns.value] = ns
      }
    },
    isValid (ns) {
      if (!ns || !ns.name || !ns.value) {
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
