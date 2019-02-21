const SEARCH_URL = './suggest'

const HEADERS = {
  'Authorization': `Basic ${btoa(`${process.env.VUE_APP_API_USER}:${process.env.VUE_APP_API_PASSWORD}`)}`
}

const api = http => ({
  async globalSearch (searchPattern, cancelToken) {
    if (!searchPattern) {
      return { records: [] }
    }
    const searchResult = await http.request({ method: 'GET', HEADERS, url: `${SEARCH_URL}?q=${searchPattern}`, cancelToken })
    return searchResult.data
  },
})

export default api
