const HEADER_AUTHORIZATION_KEY = 'Authorization'
const REFRESH_URL = '/oauth/access_token'

const headers = {}

const api = (http, log, tokenModel, accountModel) => ({

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

    if (!!headers[HEADER_AUTHORIZATION_KEY] && !tokenModel.getToken()) {
      accountModel.default.logout()
    }

    let response = http.request(parameters)

    if (response.status === 401 && !!headers[HEADER_AUTHORIZATION_KEY] && tokenModel.isExpired()) {
      // Try refreshing the token once
      if (tokenModel.isPersistent()) {

        const refresh_resp = this.refreshAuth()

        if (refresh_resp?.status === 200) {
          response = http.request(parameters)
        } else {
          accountModel.default.logout()
        }
      } else {
        accountModel.default.logout()
      }
    } else if (tokenModel.needsRefresh()) {
      this.refreshAuth()
    }

    return response
  },

  refreshAuth (cancelToken) {
    let response

    const form_data = {
      grant_type: 'refresh_token',
      refresh_token: tokenModel.getRefresh()
    }
    const refresh_data = this.createFormData(form_data)
    const refresh_pars = {
      method: 'POST',
      url: process.env.VUE_APP_API_BASE_URL + REFRESH_URL,
      headers,
      data: refresh_data,
      cancelToken
    }

    response = http.request(refresh_pars)

    if (response.status === 200) {
      tokenModel.setToken(response.access_token, response.refresh_token, response.expires_in, tokenModel.isPersistent())
      this.setAuthorization(response.token_type, response.access_token)
    }

    return response
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
    return url.indexOf('http') == 0 ? url : new URL(url, process.env.VUE_APP_API_BASE_URL)
  },
})

export default api
