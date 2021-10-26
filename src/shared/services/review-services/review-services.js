const REVIEW_PATH = '/rest/reviews'

const api = (baseServices) => ({
  get ({ parameters }, cancelToken) {
    const urlParameters = baseServices.createQueryParameters(parameters)
    const url = process.env.VUE_APP_API_BASE_URL + `${REVIEW_PATH}?${urlParameters}`
    return baseServices.request({
      method: 'GET',
      url,
    }, cancelToken)
  },

  getReview (id, cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: process.env.VUE_APP_API_BASE_URL + `${REVIEW_PATH}/${id}?_include=id,reviewRequest,componentToReview,descriptionOfCause,stdDesc,status,dateCreated,additionalInfo&_embed=allocatedGroups`,
    }, cancelToken)
  },

  createOrUpdateReview (data, cancelToken) {
    const { id } = data
    const url = id ? process.env.VUE_APP_API_BASE_URL + `${REVIEW_PATH}/${id}` : process.env.VUE_APP_API_BASE_URL + REVIEW_PATH
    return baseServices.request({
      method: id ? 'PUT' : 'POST',
      url,
      data,
    }, cancelToken)
  },

  closeReview (id, cancelToken) {
    return baseServices.request({
      method: 'PUT',
      url: process.env.VUE_APP_API_BASE_URL + `${REVIEW_PATH}/${id}`,
      data: { status: 'Closed' },
    }, cancelToken)
  },

  escalate (id, group) {
    return baseServices.request({
      method: 'PUT',
      url: process.env.VUE_APP_API_BASE_URL + `${REVIEW_PATH}/escalate/${id}`,
      data: { id: id, activeGroup: group }
    })
  },

  escalatable (id, group) {
    const result = baseServices.request({
      method: 'GET',
      url: process.env.VUE_APP_API_BASE_URL + `${REVIEW_PATH}/escalatable/${id}/${group}`
    })
    if (result.get(result) === 200) {
      return true
    }
    return false
  },

  bulkUpdate (parameters, field, value, cancelToken) {
    const urlParameters = baseServices.createQueryParameters(parameters)
    const url = process.env.VUE_APP_API_BASE_URL + `${REVIEW_PATH}/bulk?_field=${field}&_value=${value}&${urlParameters}`

    return baseServices.request({
      method: 'GET',
      url,
    }, cancelToken)
  }
})

export default api
