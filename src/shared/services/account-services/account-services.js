const LOGIN_URL = './rest/login'
const LOGOUT_URL = './rest/logout'

const REGISTER_URL = './auth/register'

const api = (utils, storage, baseServices) => ({

  initialize () {
    const token = storage.getToken()
    baseServices.setAuthorization(token)
    return token
  },

  async login ({ username, password }) {
    baseServices.deleteAuthorization()
    const response = await baseServices.request({
      method: 'POST',
      url: LOGIN_URL,
      data: { username, password }
    })
    const { data: { token_type: tokenType, access_token: accessToken } } = response
    baseServices.setAuthorization(tokenType, accessToken)
    return response
  },

  logout () {
    baseServices.request({
      method: 'POST',
      url: LOGOUT_URL,
    })
    // remove authorization header
    baseServices.deleteAuthorization()
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
