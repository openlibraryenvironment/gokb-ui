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
      return state.username !== undefined
    },

    async login ({ username, password, save }) {
      try {
        const response = await accountServices.login({ username, password })
        const { data } = response
        save && storage.setToken(data)
        state.username = username
        return response
      } catch (e) {
        state.username = undefined
        return e.response
      }
    },

    logout () {
      accountServices.logout()
      storage.removeToken()
      state.id = undefined
      state.username = undefined
    },

    async register ({ username, email, password, password2 }) {
      try {
        const response = await accountServices.register({ username, email, password, password2 })
        return response
      } catch (e) {
        return e.response
      }
    },
  }
}

export default api
