const api = baseServices => ({
  async loadProfile (cancelToken) {
    const url = 'home/profile?format=json'
    return baseServices.request({
      method: 'GET',
      url,
    }, cancelToken)
  },
  async saveProfile ({ id, email, origpass, newpass, repeatpass, curatorGroups }, cancelToken) {
    // dummyProfile.email = email
    // dummyProfile.curatorGroups = curatorGroups
  },
  async deleteProfile ({ id }, cancelToken) {
    // dummyProfile = undefined
  },
})

export default api
