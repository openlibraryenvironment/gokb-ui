const AUTH = {
  username: process.env.VUE_APP_API_USER,
  password: process.env.VUE_APP_API_PASSWORD
}

const api = http => ({
  request ({ method, url, data }, cancelToken) {
    return http.request({ method, url, auth: AUTH, data, cancelToken })
  },
})

export default api
