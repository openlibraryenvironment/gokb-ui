const api = (vue, encrypt) => {
  // name for token in the local storage of the browser
  const TOKEN_KEY = 'token'

  const api = {
    removeToken () {
      vue.localStorage.remove(TOKEN_KEY)
    },
    getToken () {
      const token = vue.localStorage.get(TOKEN_KEY)
      if (!token) {
        return {}
      }
      try {
        return JSON.parse(encrypt.d(token))
      } catch (exception) {
        // old format of login data or somebody has changed it manually, so not available
        // fail silently not giving a hint
        return {}
      }
    },
    setToken (token) {
      vue.localStorage.set(TOKEN_KEY, encrypt.e(JSON.stringify(token)))
    },
  }

  return api
}

export default api
