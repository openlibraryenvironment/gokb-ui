const api = (vue) => {
  const languages = vue.observable({})

  return {
    addLanguage (lan) {
      if (this.isValid(lan)) {
        languages[lan.value] = lan
      }
    },
    isValid (lan) {
      if (!lan || !lan.value) {
        return false
      }
      return true
    },
    getLanguage (lanValue) {
      return languages[lanValue]
    }
  }
}

export default api
