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

const api = (baseServices) => ({
  async fetchLanguagesList (cancelToken) {
    var allLans = await requestLanguages(baseServices, cancelToken)
    languagesModel.setLanguages(allLans.data)
  },
  getLanguages (locale) {
    var result = {}
    for (let [key, value] of Object.entries(languagesModel.getLanguages())) {
      if (!!value[locale]) {
        result[key] = value.locale
      }
      else if (!!value.DEFAULT_LANG) {
        result[key] = value.DEFAULT_LANG
      }
    }
    result
  }
})

export default api
