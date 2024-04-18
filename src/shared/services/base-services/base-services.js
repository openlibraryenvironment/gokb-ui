const HEADER_AUTHORIZATION_KEY = 'Authorization'
const REFRESH_URL = '/oauth/access_token'

const headers = {}

const api = (http, log, utils, tokenModel, accountModel) => ({

  deleteAuthorization () {
    log.debug("Deleting header config ..")

    delete headers[HEADER_AUTHORIZATION_KEY]

    return
  },
  setAuthorization (tokenType, accessToken) {
    headers[HEADER_AUTHORIZATION_KEY] = `${tokenType} ${accessToken}`
  },
  setLanguage (lang) {
    headers['Accept-Language'] = lang
    window.localStorage.setItem('locale', lang)
  },

  async request ({ method, url, data }, cancelToken) {
    let response

    if (!!tokenModel.getToken()) {
      if (!headers[HEADER_AUTHORIZATION_KEY]) {
        log.debug("Token exists but no header is defined!")
        this.setAuthorization('Bearer', tokenModel.getToken())
      }

      if (tokenModel.isExpired()) {
        if (tokenModel.isPersistent()) {
          log.debug("Persistent token expired, refreshing ..")
          const refresh_resp = await this.refreshAuth()

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
        log.debug("Refreshing token ..")
        await this.refreshAuth()
      }

      response = await http.request({ method, url, headers, data, cancelToken }).catch(e => {
        return e.response
      })
    }
    else {
      if (!!headers[HEADER_AUTHORIZATION_KEY]) {
        log.debug("No token but remaining header to delete")
        accountModel.default.logout()
      }

      response = http.request({ method, url, headers, data, cancelToken })
    }

    return response
  },

  async refreshAuth (cancelToken) {
    this.deleteAuthorization()

    const form_data = {
      grant_type: 'refresh_token',
      refresh_token: tokenModel.getRefresh()
    }
    const refresh_data = this.createFormData(form_data)
    const refresh_pars = {
      method: 'POST',
      url: import.meta.env.VITE_API_BASE_URL + REFRESH_URL,
      headers,
      data: refresh_data,
      cancelToken
    }

    let response = await http.request(refresh_pars).catch(e => {
      log.debug("Unable to refresh login!")
    })

    if (response?.status === 200) {
      log.debug("Refreshed token!")
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
    return utils.createQueryParameters(parameters)
  },

  createFormData (parameters) {
    const data = new FormData()
    Object.entries(parameters)
      .forEach(([name, value]) => (data.append(name, value)))
    return data
  },

  relativeUrl (url) {
    return url.indexOf('http') == 0 ? url : new URL(url, import.meta.env.VITE_API_BASE_URL)
  },
})

export default api
