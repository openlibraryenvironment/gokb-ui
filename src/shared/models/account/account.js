const api = (vue, storage, accountServices, profileServices) => {
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

    // todo: login result gives no id, you have to load the profile to get it
    async login ({ username, password, save }) {
      try {
        const response = await accountServices.login({ username, password })
        const { data: token } = response
        save && storage.setToken(token)
        state.username = token?.username
        const { data: { id } } = await profileServices.loadProfile()
        state.id = id
        return response
      } catch (e) {
        state.username = undefined
        return e.response
      }
    },

    logout () {
      accountServices.logout()
      storage.removeToken()
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
