const AUTH = {
  username: process.env.VUE_APP_API_USER,
  password: process.env.VUE_APP_API_PASSWORD
}

const api = http => ({
  request ({ method, url, useAuth = true, data }, cancelToken) {
    const parameters = {
      method,
      url,
      data,
      cancelToken
    }
    useAuth && (parameters.auth = AUTH)
    return http.request(parameters)
  },

  createQueryParameters (parameters) {
    return Object.entries(parameters)
      .map(([name, value]) => `${name}=${value}`)
      .join('&')
  }
})

export default api
