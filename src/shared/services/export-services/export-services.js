const HEADER_AUTHORIZATION_KEY = 'Authorization'

var format = undefined
const headers = []
const data = []
const separator = '\t'

const api = (http, utils) => ({
  downloadUri (uri) {
    var link = document.createElement("a")
    link.setAttribute('download', '')
    link.href = uri
    document.body.appendChild(link)
    link.click()
    link.remove()
  },
  toTsv (itemsList, maxRows, maxLevels) {
    if (!itemsList.length) {
      return ""
    }
    let header = Object.getOwnPropertyNames({ ...itemsList[0] })
    let result = header.join('\t') + '\n'
    let row = ''
    let type = ''
    for (var i = 0; i < itemsList.length && i < maxRows; i++) {
      row = ''
      Object.keys(header).map(function (k, s) {
        type = typeof itemsList[i][header[k]]
        if (type === 'number' || type === 'float') {
          row += itemsList[i][header[k]] + separator
        }
        else {
          if (itemsList[i][header[k]] !== undefined) {
            row += '"' + itemsList[i][header[k]] + '"'
          }
          row += separator
        }
      })
      row = row.slice(0, -1)
      result += row + '\r\n'
    }
    return result
  }
})

export default api
