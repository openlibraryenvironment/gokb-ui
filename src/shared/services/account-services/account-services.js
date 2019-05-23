const LOGIN_URL = './rest/login'
const LOGOUT_URL = './rest/logout'
const REGISTER_URL = './rest/register'

const api = baseServices => ({
  login ({ username, password }, cancelToken) {
    const data = { username, password }
    return baseServices.request({
      method: 'POST',
      url: LOGIN_URL,
      useAuth: false,
      data
    }, cancelToken)
  },

  logout (cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: LOGOUT_URL,
      useAuth: false,
    }, cancelToken)
  },

  register ({ username, email, password, password2 }, cancelToken) {
    const data = { username, email, password, password2 }
    return baseServices.request({
      method: 'POST',
      url: REGISTER_URL,
      useAuth: false,
      data,
    }, cancelToken)
  },
})

export default api
