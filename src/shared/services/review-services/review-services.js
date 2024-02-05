const REVIEW_PATH = '/rest/reviews'

const api = (baseServices) => ({
  search ({ parameters }, cancelToken) {
    const urlParameters = baseServices.createQueryParameters(parameters)
    const url = import.meta.env.VITE_API_BASE_URL + `${REVIEW_PATH}?${urlParameters}`
    return baseServices.request({
      method: 'GET',
      url,
    }, cancelToken)
  },

  get (id, cancelToken) {
    return baseServices.request({
      method: 'GET',
      url: import.meta.env.VITE_API_BASE_URL + `${REVIEW_PATH}/${id}?_include=id,reviewRequest,componentToReview,descriptionOfCause,stdDesc,status,dateCreated,additionalInfo&_embed=allocatedGroups`,
    }, cancelToken)
  },

  createOrUpdate (data, cancelToken) {
    const { id } = data
    const url = id ? import.meta.env.VITE_API_BASE_URL + `${REVIEW_PATH}/${id}` : import.meta.env.VITE_API_BASE_URL + REVIEW_PATH
    return baseServices.request({
      method: id ? 'PUT' : 'POST',
      url,
      data,
    }, cancelToken)
  },

  close (id, cancelToken) {
    return baseServices.request({
      method: 'PUT',
      url: import.meta.env.VITE_API_BASE_URL + `${REVIEW_PATH}/${id}`,
      data: { status: 'Closed' },
    }, cancelToken)
  },

  deescalate (id, group) {
    return baseServices.request({
      method: 'PUT',
      url: import.meta.env.VITE_API_BASE_URL + `${REVIEW_PATH}/deescalate/${id}`,
      data: { id: id, activeGroup: group }
    })
  },

  deescalatable (id, group) {
    return baseServices.request({
      method: 'GET',
      url: import.meta.env.VITE_API_BASE_URL + `${REVIEW_PATH}/deescalatable/${id}/${group}`
    })
  },

  escalate (id, group) {
    return baseServices.request({
      method: 'PUT',
      url: import.meta.env.VITE_API_BASE_URL + `${REVIEW_PATH}/escalate/${id}`,
      data: { id: id, activeGroup: group }
    })
  },

  escalatable (id, group) {
    const result = baseServices.request({
      method: 'GET',
      url: import.meta.env.VITE_API_BASE_URL + `${REVIEW_PATH}/escalatable/${id}/${group}`
    })
    return result
  },

  bulkUpdate (parameters, field, value, cancelToken) {
    const urlParameters = baseServices.createQueryParameters(parameters)
    const url = import.meta.env.VITE_API_BASE_URL + `${REVIEW_PATH}/bulk?_field=${field}&_value=${value}&${urlParameters}`

    return baseServices.request({
      method: 'GET',
      url,
    }, cancelToken)
  }
})

export default api
