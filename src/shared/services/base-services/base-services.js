const AUTH = {
  username: process.env.VUE_APP_API_USER,
  password: process.env.VUE_APP_API_PASSWORD
}
// const HEADERS = {
//   'Content-Type': 'application/json;charset=UTF-8'
// }

const api = http => ({
  request ({ method, url, data }, cancelToken) {
    return http.request({
      method,
      url,
      auth: AUTH,
      /* headers: HEADERS, */
      data,
      cancelToken
    })
  },

  createQueryParameters (parameters) {
    return Object.entries(parameters)
      .map(([name, value]) => `${name}=${value}`)
      .join('&')
  }
})

export default api
