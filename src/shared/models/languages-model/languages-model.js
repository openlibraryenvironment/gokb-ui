const api = (vue) => {

  var languages = vue.observable({})
  var iso2iso3 = {
    "de" : "ger",
    "en" : "eng"
  }

  return {
    setLanguages (lans) {
      languages = lans
    },
    getLanguage (lanValue) {
      return languages[lanValue]
    },
    getLanguages () {
      return languages
    },
    iso2toIso3 (iso2) {
      return iso2iso3[iso2]
    }
  }
}

export default api
