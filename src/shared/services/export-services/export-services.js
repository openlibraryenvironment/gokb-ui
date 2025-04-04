const api = () => ({
  downloadUri (uri, opts) {
    var link = document.createElement("a")
    let filename = 'searchresult.csv'
    if (opts.filename) {
      filename = opts.filename
    }
    link.setAttribute('download', filename)
    link.href = uri
    document.body.appendChild(link)
    link.click()
    link.remove()
  },
  toTsv (headers, itemsList, opts) {
    if (!itemsList.length) {
      return 'ERROR'
    }
    let header = headers.map(h => (h.value))
    let result = headers.map(h => (h.text)).join(',') + '\n'

    for (var i = 0; i < itemsList.length; i++) {
      let row = ''

      for (var k = 0; k < header.length; k++) {
        row += ((itemsList[i][header[k]] ? itemsList[i][header[k]].toString().includes(',') ? '"' + itemsList[i][header[k]].toString() + '"' : itemsList[i][header[k]].toString() : '') + (k < header.length-1 ? ',' : ''))
      }
      result += row + '\r\n'
    }
    this.downloadUri(URL.createObjectURL(new Blob([result], { type: 'data:text/csv;charset=utf-8,'})), opts)

    return 'OK'
  }
})

export default api
