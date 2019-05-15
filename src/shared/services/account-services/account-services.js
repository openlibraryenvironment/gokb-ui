const LOGIN_URL = './login/authenticate'
const REGISTER_URL = './register/register'

const createFormData = data => {
  const formData = new FormData()
  Object.entries(data).forEach(([k, v]) => {
    formData.set(k, v)
  })
  return formData
}

const api = baseServices => ({
  async login ({ username, password }, cancelToken) {
    const data = createFormData({ username, password })
    const result = await baseServices.request({
      method: 'POST',
      url: LOGIN_URL,
      useAuth: false,
      data,
      cancelToken
    })
    return result
  },

  async register ({ username, email, password, password2 }, cancelToken) {
    const data = { username, email, password, password2 }
    const result = await baseServices.request({
      method: 'POST',
      url: REGISTER_URL,
      useAuth: false,
      data,
      cancelToken
    })
    return result
  }
})

export default api
