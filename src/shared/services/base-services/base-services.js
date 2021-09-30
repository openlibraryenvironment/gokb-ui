const HEADER_AUTHORIZATION_KEY = 'Authorization'

const headers = {}

const api = (http, utils) => ({

  deleteAuthorization () {
    delete headers[HEADER_AUTHORIZATION_KEY]
  },
  setAuthorization (tokenType, accessToken) {
    headers[HEADER_AUTHORIZATION_KEY] = `${tokenType} ${accessToken}`
  },
  setLanguage (lang) {
    headers['Accept-Language'] = lang
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
    const pars = []

    Object.entries(parameters)
      .forEach(([name, value]) => {
        if (Array.isArray(value)) {
          value.forEach(val =>
            pars.push(`${name}=${typeof val === 'string' ? encodeURIComponent(val.trim()) : val}`)
          )
        } else if (value !== undefined && value !== null) {
          pars.push(`${name}=${typeof value === 'string' ? encodeURIComponent(value.trim()) : value}`)
        }
      })

    return pars.join('&')
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
