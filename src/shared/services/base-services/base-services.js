const api = http => ({
  request ({ method, url, data }, cancelToken) {
    const parameters = {
      method,
      url,
      data,
      cancelToken
    }
    return http.request(parameters)
  },

  createQueryParameters (parameters) {
    return Object.entries(parameters)
      .map(([name, value]) => `${name}=${value}`)
      .join('&')
  }
})

export default api
