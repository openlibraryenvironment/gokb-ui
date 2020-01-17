const HEADER_AUTHORIZATION_KEY = 'Authorization'

const headers = {}

const api = http => ({

  deleteAuthorization () {
    delete headers[HEADER_AUTHORIZATION_KEY]
  },
  setAuthorization (tokenType, accessToken) {
    headers[HEADER_AUTHORIZATION_KEY] = `${tokenType} ${accessToken}`
  },

  request ({ method, url, data }, cancelToken) {
    const parameters = {
      method,
      url,
      headers,
      data,
      cancelToken
    }
    return http.request(parameters)
  },

  createQueryParameters (parameters) {
    return Object.entries(parameters)
      .map(([name, value]) => `${name}=${value}`)
      .join('&')
  },

  createFormData (parameters) {
    const data = new FormData()
    Object.entries(parameters)
      .forEach(([name, value]) => (data.append(name, value)))
    return data
  }
})

export default api
