const api = () => ({
  downloadUri (uri) {
    var link = document.createElement("a")
    link.setAttribute('download', 'searchresult.tsv')
    link.href = uri
    document.body.appendChild(link)
    link.click()
    link.remove()
  },
  toTsv (headers, itemsList) {
    if (!itemsList.length) {
      return 'ERROR'
    }
    let header = headers.map(h => (h.value))
    let result = headers.map(h => (h.text)).join('\t') + '\n'

    for (var i = 0; i < itemsList.length; i++) {
      let row = ''

      for (var k = 0; k < header.length; k++) {
        row += ((itemsList[i][header[k]] ? itemsList[i][header[k]].toString() : '') + (k < header.length-1 ? '\t' : ''))
      }
      result += row + '\r\n'
    }
    this.downloadUri(URL.createObjectURL(new Blob([result], { type: 'data:text/tsv;charset=utf-8,'})))

    return 'OK'
  }
})

export default api
