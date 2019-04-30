const LOGIN_URL = './login/authenticate'

const api = baseServices => ({
  async login (username, password, cancelToken) {
    const data = new FormData()
    data.set('username', username)
    data.set('password', password)
    const result = await baseServices.request({
      method: 'POST',
      url: LOGIN_URL,
      useAuth: false,
      data,
      cancelToken
    })
    return result.data
  },
})

export default api
