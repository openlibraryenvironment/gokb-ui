const api = (vue) => {
  const namespaces = vue.observable({})

  return {
    getBaseurl(namespaceName) {
      return namespaces[namespaceName]
    },
    addBaseurl(namespaceName, val) {
      if (!namespaces[namespaceName]) {
        namespaces[namespaceName] = val
      }
    },
    hasBaseurl(namespaceName) {
      return !!namespaces[namespaceName]
    }
  }
}

export default api
