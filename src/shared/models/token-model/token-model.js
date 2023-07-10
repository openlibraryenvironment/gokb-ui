const api = (browserStorage) => {
  // name for token in the local storage of the browser
  const TOKEN_KEY = 'token'
  const PERSISTENCE_KEY = 'persistent'
  const REFRESH_KEY = 'refresh'
  const EXPIRATION_KEY = 'lifetime'
  const localStorage = browserStorage(window.localStorage)

  return {
    isPersistent () {
      return localStorage.get(PERSISTENCE_KEY) === "true"
    },
    removeToken () {
      localStorage.remove(TOKEN_KEY)
      localStorage.remove(REFRESH_KEY)
      localStorage.remove(EXPIRATION_KEY)
      localStorage.remove(PERSISTENCE_KEY)
    },
    needsRefresh () {
      return !!localStorage.get(EXPIRATION_KEY) && !!this.getToken() && (Date.now() > (parseInt(localStorage.get(EXPIRATION_KEY) - 300000)))
    },
    isExpired () {
      return !localStorage.get(EXPIRATION_KEY) || (!!this.getToken() && Date.now() > parseInt(localStorage.get(EXPIRATION_KEY)))
    },
    getToken () {
      return localStorage.get(TOKEN_KEY)
    },
    getRefresh () {
      return localStorage.get(REFRESH_KEY)
    },
    setToken (token, refresh, lifetime, persistent) {
      localStorage.set(TOKEN_KEY, token)
      localStorage.set(REFRESH_KEY, refresh)
      localStorage.set(EXPIRATION_KEY, Date.now() + lifetime*1000)
      localStorage.set(PERSISTENCE_KEY, persistent)
    },
  }
}

export default api
