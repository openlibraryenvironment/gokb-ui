const SEARCH_URL = './find'

const HEADERS = {
  'Authorization': `Basic ${btoa(`${process.env.VUE_APP_API_USER}:${process.env.VUE_APP_API_PASSWORD}`)}`
}

const api = http => ({
  async globalSearch (searchPattern, cancelToken) {
    const searchResult = await http.request({ method: 'GET', HEADERS, url: `${SEARCH_URL}?name=${searchPattern}`, cancelToken })
    return searchResult.data
  },
})

export default api
