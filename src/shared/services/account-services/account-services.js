const LOGIN_URL = '/rest/login'
const REGISTER_URL = '/rest/register'

const api = (assert, log, tokenModel, baseServices, profileServices) => ({

  async initialize (cancelToken) {
    const token = tokenModel.getToken()

    if (token) { // we have a token, try to use it
      baseServices.setAuthorization('Bearer', token)
      try {
        const profile = await profileServices.get(cancelToken)
        return profile.data.data
      } catch (exception) {
        baseServices.deleteAuthorization()
        log.info('saved token invalid', exception)
        tokenModel.removeToken()
        return
      }
    }
  },

  async login ({ username, password, save }, cancelToken) {
    assert.isDefined(username && password)
    // remove old authorization for requests
    baseServices.deleteAuthorization()
    const { data: result } = await baseServices.request({
      initiator: this.login.name,
      method: 'POST',
      url: process.env.VUE_APP_API_BASE_URL + LOGIN_URL,
      data: { username, password },
      cancelToken
    })
    log.debug('logged in')
    tokenModel.setToken(result.access_token, result.refresh_token, result.expires_in, save)
    baseServices.setAuthorization(result.token_type, result.access_token)
    return { roles: result.roles }
  },

  async logout (cancelToken) {
    tokenModel.removeToken()
    baseServices.deleteAuthorization()
    log.debug('logged out')
  },

  register ({ username, email, password, password2 }) {
    return baseServices.request({
      method: 'POST',
      url: process.env.VUE_APP_API_BASE_URL + REGISTER_URL,
      data: { username, email, password, password2 },
    })
  },
})

export default api
