const LOGIN_URL = './login/authenticate'
const LOGOUT_URL = './logoff'
const REGISTER_URL = './register/register'

const createFormData = data => {
  const formData = new FormData()
  Object.entries(data).forEach(([k, v]) => {
    formData.set(k, v)
  })
  return formData
}

const api = baseServices => ({
  login ({ username, password }, cancelToken) {
    const data = createFormData({ username, password }) // does not work with JSON
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
