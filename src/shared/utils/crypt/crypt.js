const XOR_PATTERN = '6$5336ou7123st564insl&54per989)()deyolf.'

const api = {
  // I use a simple algorithm to make the password not readable on first sight, the rest does https for us
  encode (value) { // encode
    if (!value) {
      return value
    }
    const pattern = XOR_PATTERN.repeat((value.length / XOR_PATTERN.length) + 1)
    let encoded = ''
    for (let i = 0; i < value.length; i++) {
      const code = (value.charCodeAt(i) ^ pattern.charCodeAt(i)).toString('16')
      encoded += code.length !== 2 ? `0${code}` : code
    }
    return encoded
  },

  decode (value) { // decode
    if (!value) {
      return value
    }
    const pattern = XOR_PATTERN.repeat((value.length / 2 / XOR_PATTERN.length) + 1)
    let decoded = ''
    for (let i = 0; i < value.length / 2; i++) {
      const char = parseInt(value[i * 2] + value[i * 2 + 1], 16)
      decoded += String.fromCharCode(char ^ pattern.charCodeAt(i))
    }
    return decoded
  },
}

export default api
