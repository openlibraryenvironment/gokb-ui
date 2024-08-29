const api = (reactive, accountServices, browserStorage) => {
  const ACTIVE_GROUP = 'activeGroup'
  const localStorage = browserStorage(window.localStorage)
  const state = reactive({
    initialized: false,
    loggedIn: false,
    username: undefined,
    userLocale: undefined,
    tabbedView: true,
    darkMode: undefined,
    id: undefined,
    roles: undefined,
  })

  return {
    isInitialized () {
      return state.initialized
    },

    hasRole (role) {
      return !!state.roles && state.roles.includes(role)
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

    activeGroup () {
      return localStorage.get(ACTIVE_GROUP, true)
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

    setActiveGroup (group) {
      if (!!group) {
        localStorage.set(ACTIVE_GROUP, group, true)
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

    refresh (response) {
      state.initialized = true
      state.loggedIn = true
      state.roles = response.roles
      state.username = response.username
    },

    clear () {
      state.loggedIn = false
      state.username = ''
      state.roles = []
      state.darkMode = false
      state.id = undefined
      state.tabbedView = true
      state.userLocale = undefined
    },

    logout () {
      accountServices.logout()
      localStorage.remove(ACTIVE_GROUP)
      this.clear()
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
