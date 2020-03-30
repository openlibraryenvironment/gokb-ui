export default {
  asPercent (value, decimalFactor = 1) {
    return this.round(value * 100, decimalFactor)
  },

  round (value, decimalFactor = 1) {
    return decimalFactor === 1 ? Math.round(value) : Math.round(value * decimalFactor) / decimalFactor
  },
}
