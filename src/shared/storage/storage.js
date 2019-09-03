/*
  .expires: "Wed, 12 Jun 2019 08:41:27 GMT"
  .issued: "Thu, 23 May 2019 08:41:27 GMT"
  access_token: "..."
  expires_in: 1727999
  token_type: "bearer"
  userName: "..."
*/

const api = (encrypt) => {
  // name for token in the local storage of the browser
  const TOKEN_KEY = 'token'

  const api = {
    removeToken () {
      window.localStorage.removeItem(TOKEN_KEY)
    },
    getToken () {
      const token = window.localStorage[TOKEN_KEY]
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
      window.localStorage.setItem(TOKEN_KEY, encrypt.e(JSON.stringify(token)))
    },
  }

  return api
}

export default api
