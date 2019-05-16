const api = (state, accountServices) => ({
  state,

  loggedIn () {
    return !!this.state.username
  },

  async login ({ username, password }, cancelToken) {
    const loginResult = await accountServices.login({ username, password }, cancelToken)
    this.state.username = loginResult.data.username
    return loginResult
  },

  logout (cancelToken) {
    accountServices.logout(cancelToken)
    this.state.username = undefined
  },

  register ({ username, email, password, password2 }, cancelToken) {
    return accountServices.register({ username, email, password, password2 }, cancelToken)
  },
})

export default api
