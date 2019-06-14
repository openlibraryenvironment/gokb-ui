const api = baseServices => ({
  async loadProfile ({ id } = { id: undefined }, cancelToken) {
    return {
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
  },
  async saveProfile ({ id, email, origpass, newpass, repeatpass, curatorGroups }, cancelToken) {
  },
  async deleteProfile ({ id }, cancelToken) {
  },
})

export default api
