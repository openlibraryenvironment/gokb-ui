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
    window.localStorage.setItem('locale', lang)
  },

  request ({ method, url, data }, cancelToken) {
    const parameters = {
      method,
      url,
      headers,
      data,
      cancelToken
    }

    let response
    let failedInit = false

    if (!!tokenModel.getToken() && !headers[HEADER_AUTHORIZATION_KEY]) {
      log.debug("Token exists, but header is missing .. possibly getting refreshed right now.")
      // refresh in progress?
      try {
        response = http.request(parameters)
      }
      catch (e) {
        failedInit = true
      }
    }

    if (!response || failedInit) {
      if (!!headers[HEADER_AUTHORIZATION_KEY] && !tokenModel.getToken()) {
        log.debug("Existing header but no token.. logging out")
        accountModel.default.logout()
      } else if (!!tokenModel.getToken()) {
        if (!!headers[HEADER_AUTHORIZATION_KEY] && tokenModel.isExpired()) {
          if (tokenModel.isPersistent()) {
            log.debug("Persistent token expired, refreshing ..")
            const refresh_resp = this.refreshAuth()

            if (refresh_resp?.status === 200) {
            } else {
              log.debug("Unable to refresh token .. logging out")
              accountModel.default.logout()
            }
          } else {
            log.debug("Non-persistent token expired .. logging out")
            accountModel.default.logout()
          }
        } else if (tokenModel.needsRefresh()) {
          log.debug("Refreshing token ")
          this.refreshAuth()
        }
      }

      response = http.request(parameters)
    }

    return response
  },

  async refreshAuth (cancelToken) {
    this.deleteAuthorization()
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

    try {
      response = await http.request(refresh_pars)
    }
    catch (e) {
      log.debug("Unable to refresh login!")
    }

    if (response?.status === 200) {
      tokenModel.setToken(response.data.access_token, response.data.refresh_token, response.data.expires_in, tokenModel.isPersistent())
      this.setAuthorization(response.data.token_type, response.data.access_token)
      accountModel.default.refresh(response.data)
    }
    else {
      log.debug("No refresh possible!")
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
