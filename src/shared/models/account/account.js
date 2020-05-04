const api = (vue, storage, accountServices) => {
  const state = vue.observable({
    username: undefined,
    roles: undefined,
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
      return state.username !== undefined
    },

    async login ({ username, password, save }) {
      try {
        const response = await accountServices.login({ username, password })
        const { data } = response
        save && storage.setToken(data)
        state.username = username
        state.roles = data.roles
        return response
      } catch (exception) {
        state.username = undefined
        state.roles = undefined
        return exception.response
      }
    },

    logout () {
      accountServices.logout()
      storage.removeToken()
      state.id = undefined
      state.username = undefined
      state.roles = []
    },

    async register ({ username, email, password, password2 }) {
      try {
        const response = await accountServices.register({ username, email, password, password2 })
        return response
      } catch (exception) {
        return exception.response
      }
    },
  }
}

export default api
