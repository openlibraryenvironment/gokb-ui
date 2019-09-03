const TIMEOUT_DELTA_IN_SECONDS = 60
const FACTOR_SECONDS_TO_MILLISECONDS = 1000

const LOGIN_URL = './rest/login'
const LOGOUT_URL = './logoff'

const ACCESS_TOKEN = './oauth/access_token'
const REGISTER_URL = './rest/register'

// actual timeout id for getting a new token
let tokenTimeoutId

const api = (utils, storage, baseServices) => ({

  initialize () {
    const token = storage.getToken()
    const tokenExpired = token && utils.isTokenExpired(token)
    !tokenExpired && baseServices.setAuthorization(token)
    return token
  },

  async login ({ username, password, refreshToken }) {
    !refreshToken && baseServices.deleteAuthorization()
    const data = refreshToken ? undefined : { username, password }
    const url = refreshToken
      ? `${ACCESS_TOKEN}?${baseServices.createQueryParameters({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })}`
      : LOGIN_URL
    const response = await baseServices.request({
      method: 'POST',
      url,
      data
    })
    const { data: token } = response
    baseServices.setAuthorization(token)
    // refresh token via timeout => auto login
    // token.expires_in = 65 // for testing refresh
    tokenTimeoutId = setTimeout(() => {
      this.login({ refreshToken: token.refresh_token })
    }, (token.expires_in - TIMEOUT_DELTA_IN_SECONDS) * FACTOR_SECONDS_TO_MILLISECONDS)
    return response
  },

  // todo: we can not do a valid logout in the backend, that can be a problem, session can be used by others, memory consumption on server, ...
  // todo: wrong REST command, should be POST instead of GET
  // todo: not really a REST logout, redirects to home
  logout () {
    baseServices.request({
      method: 'GET',
      url: LOGOUT_URL,
    })
    // stop timeout for re login, if needed
    clearTimeout(tokenTimeoutId)
    // remove authorization header
    baseServices.deleteAuthorization()
    // no service in the backend available to logoff
  },

  register ({ username, email, password, password2 }) {
    return baseServices.request({
      method: 'POST',
      url: REGISTER_URL,
      data: { username, email, password, password2 },
    })
  },
})

export default api
