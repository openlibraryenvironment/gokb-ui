const TIMEOUT_DELTA_IN_SECONDS = 60
const FACTOR_SECONDS_TO_MILLISECONDS = 1000

const LOGIN_URL = './rest/login'
const LOGOUT_URL = './rest/logout'

const ACCESS_TOKEN = './auth/access_token'
const REGISTER_URL = './auth/register'

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
    const { data: { token_type: tokenType, access_token: accessToken, refresh_token: refreshToken1, expires_in: expiresIn } } = response
    baseServices.setAuthorization(tokenType, accessToken)
    // refresh token via timeout => auto login
    // token.expires_in = 65 // for testing refresh
    tokenTimeoutId = setTimeout(() => {
      this.login({ refreshToken: refreshToken1 })
    }, (expiresIn - TIMEOUT_DELTA_IN_SECONDS) * FACTOR_SECONDS_TO_MILLISECONDS)
    return response
  },

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
