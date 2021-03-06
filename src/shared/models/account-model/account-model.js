const api = (vue, accountServices) => {
  const state = vue.observable({
    initialized: false,
    loggedIn: false,
    username: undefined,
    userLocale: undefined,
    tabbedView: true,
    darkMode: false,
    id: undefined,
    roles: undefined,
  })

  return {
    isInitialized () {
      return state.initialized
    },

    hasRole (role) {
      return state.roles?.includes(role)
    },

    username () {
      return state.username
    },

    id () {
      return state.id
    },

    tabbedView () {
      return state.tabbedView
    },

    darkMode () {
      return state.darkMode
    },

    userLocale () {
      return state.userLocale
    },

    async initialize (cancelToken) {
      const result = await accountServices.initialize(cancelToken)
      state.initialized = true
      if (result) {
        state.loggedIn = true
        state.roles = result.roles
        state.username = result.username
      }
    },

    setLocale (lcl) {
      state.userLocale = lcl
    },

    useTabbedView (val) {
      state.tabbedView = val
    },

    toggleDarkMode (dm) {
      state.darkMode = dm
    },

    loggedIn () {
      return state.loggedIn
    },

    async login ({ username, password, save }, cancelToken) {
      const { roles } = await accountServices.login({ username, password, save }, cancelToken)
      state.loggedIn = true
      state.roles = roles
      state.username = username
    },

    logout (cancelToken) {
      accountServices.logout(cancelToken)
      state.loggedIn = false
      state.username = ''
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
