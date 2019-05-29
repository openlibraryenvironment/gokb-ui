const api = (vue, storage, accountServices) => {
  const state = vue.observable({
    username: undefined,
  })

  return {
    state () {
      return state
    },

    initialize () {
      const token = accountServices.initialize()
      state.username = token?.username
    },
    loggedIn () {
      return !!state.username
    },
    async login ({ username, password, save }, cancelToken) {
      try {
        const response = await accountServices.login({ username, password }, cancelToken)
        const { data: token } = response
        save && storage.setToken(token)
        state.username = token?.username
        return response
      } catch (e) {
        state.username = undefined
        return e.response
      }
    },

    logout (cancelToken) {
      // remove stored token from local storage
      storage.removeToken()
      state.username = undefined
    },

    register ({ username, email, password, password2 }, cancelToken) {
      return accountServices.register({ username, email, password, password2 }, cancelToken)
    },
  }
}

export default api
