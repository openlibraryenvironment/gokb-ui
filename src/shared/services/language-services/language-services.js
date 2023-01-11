import languagesModel from '@/shared/models/languages-model'

const PLATFORM_URL = '/rest/languages'

const requestLanguages = (baseServices, cancelToken) => {
  return baseServices.request({
    method: 'GET',
    url: process.env.VUE_APP_API_BASE_URL + `${PLATFORM_URL}`,
  }, cancelToken);
}

const api = (baseServices) => ({
  async fetchLanguagesList (cancelToken) {
    var allLans = await requestLanguages(baseServices, cancelToken)
    for (const lan of allLans.data?.data) {
      languagesModel.addLanguage(lan)
    }
  }
})

export default api
