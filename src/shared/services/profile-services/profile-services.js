const api = (baseServices, ajaxServices) => ({
  loadProfile (cancelToken) {
    const url = 'home/profile?format=json'
    return baseServices.request({
      method: 'GET',
      url,
    }, cancelToken)
  },
  saveProfile ({ id, email, origpass, newpass, repeatpass, curatoryGroupsToDelete, curatoryGroupsToAdd }, cancelToken) {
    ajaxServices.update({ name: 'email', value: email, pk: `org.gokb.cred.User:${id}` })
    curatoryGroupsToAdd.forEach(({ id: curatoryId }) => (
      ajaxServices.add({
        __context: `org.gokb.cred.User:${id}`,
        __property: 'curatoryGroups',
        __relatedObject: curatoryId
      })
    ))
    curatoryGroupsToDelete.forEach(({ id: curatoryId }) => (
      ajaxServices.remove({
        __context: `org.gokb.cred.User:${id}`,
        __property: 'curatoryGroups',
        __itemToRemove: curatoryId
      })
    ))
  },

  deleteProfile ({ id }, cancelToken) {
    // dummyProfile = undefined
  },
})

export default api

/*

Zugehörigkeit zu Kuratorengruppe aufnehmen
------------------------------------------
POST
https://phaeton-dev.hbz-nrw.de/gokb/ajaxSupport/addToStdCollection
__context: org.gokb.cred.User:814062
__property: curatoryGroups
__relatedObject: org.gokb.cred.CuratoryGroup:62903

Zugehörigkeit zu Kuratorengruppe entfernen
------------------------------------------
GET
https://phaeton-dev.hbz-nrw.de/gokb/ajaxSupport/unlinkManyToMany?__property=curatoryGroups&__context=org.gokb.cred.User%3A814062&__itemToRemove=org.gokb.cred.CuratoryGroup%3A62903

Passwort ändern
---------------
POST
https://phaeton-dev.hbz-nrw.de/gokb/home/changePass
origpass: Test123456#
newpass: Test123456#
repeatpass: Test123456#

*/
