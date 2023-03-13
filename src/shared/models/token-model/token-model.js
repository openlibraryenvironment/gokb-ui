const api = (browserStorage) => {
  // name for token in the local storage of the browser
  const TOKEN_KEY = 'token'
  const REFRESH_KEY = 'refresh'
  const EXPIRATION_KEY = 'lifetime'
  const localStorage = browserStorage(window.localStorage)
  const sessionStorage = browserStorage(window.sessionStorage)

  return {
    isPersistent () {
      return !!localStorage.get(TOKEN_KEY)
    },
    removeToken () {
      localStorage.remove(TOKEN_KEY)
      sessionStorage.remove(TOKEN_KEY)
      localStorage.remove(REFRESH_KEY)
      sessionStorage.remove(REFRESH_KEY)
    },
    needsRefresh () {
      return !!this.getToken() && (Date.now() > (sessionStorage.get(EXPIRATION_KEY) || localStorage.get(EXPIRATION_KEY) - 300000))
    },
    isExpired () {
      return !!this.getToken() && Date.now() > (sessionStorage.get(EXPIRATION_KEY) || localStorage.get(EXPIRATION_KEY))
    },
    getToken () {
      return sessionStorage.get(TOKEN_KEY) || localStorage.get(TOKEN_KEY)
    },
    getRefresh () {
      return sessionStorage.get(REFRESH_KEY) || localStorage.get(REFRESH_KEY)
    },
    setToken (token, refresh, lifetime, persistent) {
      const { saveEnvironment, deleteEnvironment } = persistent
        ? { saveEnvironment: localStorage, deleteEnvironment: sessionStorage } : { saveEnvironment: sessionStorage, deleteEnvironment: localStorage }
      saveEnvironment.set(TOKEN_KEY, token)
      saveEnvironment.set(REFRESH_KEY, refresh)
      saveEnvironment.set(EXPIRATION_KEY, Date.now() + (lifetime * 1000))
      deleteEnvironment.remove(TOKEN_KEY)
      deleteEnvironment.remove(REFRESH_KEY)
      deleteEnvironment.remove(EXPIRATION_KEY)
    },
  }
}

export default api
