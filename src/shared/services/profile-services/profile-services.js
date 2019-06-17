let dummyProfile = {
  email: 'dummy@dummy.de',
  curatorGroups: [
    {
      Id: '0',
      Name: 'LAS:eR'
    },
    {
      Id: '1',
      Name: 'HBZ'
    },
  ]
}

const api = baseServices => ({
  async loadProfile ({ id } = { id: undefined }, cancelToken) {
    return dummyProfile
  },
  async saveProfile ({ id, email, origpass, newpass, repeatpass, curatorGroups }, cancelToken) {
    dummyProfile.email = email
    dummyProfile.curatorGroups = curatorGroups
  },
  async deleteProfile ({ id }, cancelToken) {
    dummyProfile = undefined
  },
})

export default api
