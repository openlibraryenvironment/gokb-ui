const api = (browserStorage) => {
  // name for token in the local storage of the browser
  const TOKEN_KEY = 'token'
  const localStorage = browserStorage(window.localStorage)
  const sessionStorage = browserStorage(window.sessionStorage)

  return {
    isPersistent () {
      return !!localStorage.get(TOKEN_KEY)
    },
    removeToken () {
      localStorage.remove(TOKEN_KEY)
      sessionStorage.remove(TOKEN_KEY)
    },
    getToken () {
      return sessionStorage.get(TOKEN_KEY) || localStorage.get(TOKEN_KEY)
    },
    setToken (token, persistent) {
      const { saveEnvironment, deleteEnvironment } = persistent
        ? { saveEnvironment: localStorage, deleteEnvironment: sessionStorage } : { saveEnvironment: sessionStorage, deleteEnvironment: localStorage }
      saveEnvironment.set(TOKEN_KEY, token)
      deleteEnvironment.remove(TOKEN_KEY)
    },
  }
}

export default api
