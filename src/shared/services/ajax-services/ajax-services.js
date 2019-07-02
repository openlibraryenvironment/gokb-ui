const LOOKUP_URL = './ajaxSupport/lookup'
const SET_VALUE_URL = './ajaxSupport/editableSetValue'
const ADD_URL = './ajaxSupport/addToStdCollection'
const REMOVE_URL = './ajaxSupport/unlinkManyToMany'

const api = baseServices => ({
  lookup (parameters, cancelToken) {
    const queryParameters = baseServices.createQueryParameters(parameters)
    return baseServices.request({
      method: 'GET',
      url: `${LOOKUP_URL}?${queryParameters}`,
    }, cancelToken)
  },

  update (parameters, cancelToken) {
    return baseServices.request({
      method: 'POST',
      url: SET_VALUE_URL,
      data: baseServices.createFormData(parameters)
    }, cancelToken)
  },

  add (parameters, cancelToken) {
    return baseServices.request({
      method: 'POST',
      url: ADD_URL,
      data: baseServices.createFormData(parameters)
    }, cancelToken)
  },

  remove (parameters, cancelToken) {
    const queryParameters = baseServices.createQueryParameters(parameters)
    return baseServices.request({
      method: 'GET',
      url: `${REMOVE_URL}?${queryParameters}`,
    }, cancelToken)
  },
})

export default api
