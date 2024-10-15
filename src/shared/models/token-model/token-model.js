const api = (browserStorage) => {
  // name for token in the local storage of the browser
  const TOKEN_KEY = 'token'
  const PERSISTENCE_KEY = 'persistent'
  const REFRESH_KEY = 'refresh'
  const EXPIRATION_KEY = 'lifetime'
  const localStorage = browserStorage(window.localStorage)

  return {
    isPersistent () {
      return localStorage.get(PERSISTENCE_KEY, true) === true
    },
    removeToken () {
      localStorage.remove(TOKEN_KEY)
      localStorage.remove(REFRESH_KEY)
      localStorage.remove(EXPIRATION_KEY)
      localStorage.remove(PERSISTENCE_KEY)
    },
    needsRefresh () {
      return Date.now() > (localStorage.get(EXPIRATION_KEY, true) - 600000)
    },
    isExpired () {
      return !localStorage.get(EXPIRATION_KEY, true) || !/^\d+$/.test(localStorage.get(EXPIRATION_KEY, true)) || (!!this.getToken() && Date.now() > parseInt(localStorage.get(EXPIRATION_KEY, true)))
    },
    existsToken () {
      return !!this.getToken()
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
      localStorage.set(EXPIRATION_KEY, Date.now() + lifetime*1000, true)
      localStorage.set(PERSISTENCE_KEY, persistent, true)
    },
  }
}

export default api
