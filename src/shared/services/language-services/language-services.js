import languagesModel from '@/shared/models/languages-model'

const PLATFORM_URL = '/rest/languages'
const DEFAULT_LANG = 'eng'

const requestLanguages = (baseServices, cancelToken) => {
  return baseServices.request({
    method: 'GET',
    url: process.env.VUE_APP_API_BASE_URL + `${PLATFORM_URL}`,
  }, cancelToken);
}

const localetoIso3 = (locale) => {
  var result = languagesModel.iso2toIso3(locale)
  if (!result) {
    result = DEFAULT_LANG
  }
  return result
}

const getLang = (key, value, localeLang) => {
  if (!!value[localeLang]) {
    return ({ "iso3" : key, "name" : value[localeLang] })
  }
  else if (!!value.DEFAULT_LANG) {
    return ({ "iso3" : key, "name" : value.DEFAULT_LANG })
  }
}

const api = (baseServices) => ({
  async fetchLanguagesList (cancelToken) {
    var allLans = await requestLanguages(baseServices, cancelToken)
    languagesModel.setLanguages(allLans.data)
  },
  getLanguages (locale) {
    var result = []
    const localeLang = localetoIso3(locale)
    for (let [key, value] of Object.entries(languagesModel.getLanguages())) {
      result.push(getLang(key, value, localeLang))
    }
    return result
  },
  getLanguage (langKey, locale) {
    const localeLang = localetoIso3(locale)
    const lang = languagesModel.getLanguage(langKey)
    return getLang(langKey, lang, localeLang)
  }
})

export default api
