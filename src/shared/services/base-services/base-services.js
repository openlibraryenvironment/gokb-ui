const HEADER_AUTHORIZATION_KEY = 'Authorization'

const headers = {}

const api = (http, utils) => ({

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
      .filter(([, value]) => value)
      .map(([name, value]) => `${name}=${value}`)
      .join('&')
  },

  createFormData (parameters) {
    const data = new FormData()
    Object.entries(parameters)
      .forEach(([name, value]) => (data.append(name, value)))
    return data
  },

  relativeUrl (url) {
    return utils.isProduction() ? url : url.replace(process.env.VUE_APP_API_BASE_URL, '')
  },
})

export default api
