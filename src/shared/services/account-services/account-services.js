const LOGIN_URL = '/rest/login'
const REGISTER_URL = '/rest/register'

const api = (log, tokenModel, http, profileServices) => ({

  async initialize (cancelToken) {
    log.debug("initializing ..")
    const token = tokenModel.getToken()

    if (!!token) { // we have a token, try to use it
      let profile

      try {
        const resp = await profileServices.get(cancelToken)
        profile = resp?.data?.data
        profile.roles = profile.roles?.map(obj => obj.authority)
      } catch (exception) {
      }

      return profile
    }
    else {
      log.debug("Account-Services :: Initialize : No token found")
    }
  },

  async login ({ username, password, save }, cancelToken) {
    log.debug("login new..")
    // remove old authorization for requests
    this.logout()

    log.debug("request..")

    const { data: result } = await http.request({
      initiator: this.login.name,
      method: 'POST',
      url: import.meta.env.VITE_API_BASE_URL + LOGIN_URL,
      data: { username, password },
      cancelToken
    })

    log.debug('logged in')
    tokenModel.setToken(result.access_token, result.refresh_token, result.expires_in, !!save)

    return { roles: result.roles }
  },

  logout () {
    if (!!tokenModel.getToken()) {
      tokenModel.removeToken()
      log.debug('logged out')
    }
    else {
      log.debug("No token to remove!")
    }

    // baseServices.deleteAuthorization()
  }
})

export default api
