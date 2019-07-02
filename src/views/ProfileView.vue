<template>
  <gokb-page title="Profil" @submit="updateProfile">
    <gokb-section title="Allgemein">
      <gokb-email-field v-model="email"></gokb-email-field>
    </gokb-section>
    <gokb-section title="Kennwort">
      <gokb-password-field label="Bisheriges Kennwort" v-model="origpass"/>
      <gokb-password-field label="Neues Kennwort" v-model="newpass"/>
      <gokb-password-field label="Neues Kennwort (Wiederholung)" v-model="repeatpass"/>
    </gokb-section>
    <gokb-add-curatory-groups-popup v-if="addCuratoryGroupsPopupVisible" v-model="addCuratoryGroupsPopupVisible" @add="addNewCuratoryGroup"/>
    <gokb-section title="Kuratorengruppen">
      <template #buttons>
        <gokb-button @click.native="showAddNewCuratoryGroup">Hinzufügen</gokb-button>
        <gokb-button @click.native="deleteSelectedCuratoryGroups">Löschen</gokb-button>
      </template>
      <gokb-table
        :headers="curatoryGroupsTableHeaders"
        :items="curatoryGroups"
        :selected-items="selectedCuratoryGroups"
        :deleted-items="deletedCuratoryGroups"
        :added-items="addedCuratoryGroups"/>
    </gokb-section>
    <template #buttons>
      <gokb-button @click.native="removeProfile">Konto löschen</gokb-button>
      <v-spacer></v-spacer>
      <gokb-button default>Aktualisieren</gokb-button>
    </template>
  </gokb-page>
</template>

<script>
import { HOME_ROUTE } from '@/router/route-names'
import account from '@/shared/models/account'
import profileServices from '@/shared/services/profile-services'
import BaseComponent from '@/shared/components/BaseComponent'
import GokbAddCuratoryGroupsPopup from '@/shared/components/popups/AddCuratoryGroupsPopup'
import GokbPage from '@/shared/components/complex/PageComponent'
import GokbTable from '@/shared/components/complex/TableComponent'
import GokbSection from '@/shared/components/complex/SectionComponent'
import GokbButton from '@/shared/components/base/ButtonComponent'
import GokbEmailField from '@/shared/components/simple/EmailFieldComponent'
import GokbPasswordField from '@/shared/components/simple/PasswordFieldComponent'

const CURATORY_GROUPS_TABLE_HEADERS = [
  { text: 'Gruppe', align: 'left', value: 'name', sortable: false, width: '100%' },
]

export default {
  name: 'ProfileComponent',
  extends: BaseComponent,
  components: {
    GokbAddCuratoryGroupsPopup,
    GokbPage,
    GokbSection,
    GokbTable,
    GokbEmailField,
    GokbButton,
    GokbPasswordField
  },
  data () {
    return {
      addCuratoryGroupsPopupVisible: false,

      email: undefined,
      origpass: undefined,
      newpass: undefined,
      repeatpass: undefined,
      curatoryGroups: undefined,

      selectedCuratoryGroups: [],
      deletedCuratoryGroups: [],
      addedCuratoryGroups: [],
    }
  },
  async created () {
    this.curatoryGroupsTableHeaders = CURATORY_GROUPS_TABLE_HEADERS
    const { data: { email, curatoryGroups } } = await profileServices.loadProfile(this.cancelToken.token)
    this.email = email
    this.curatoryGroups = curatoryGroups.map(({ id, name }) => ({ id: `org.gokb.cred.CuratoryGroup:${id}`, name }))
  },
  methods: {
    deleteSelectedCuratoryGroups () {
      this.selectedCuratoryGroups.forEach(selected => this.deletedCuratoryGroups.push(selected))
      this.selectedCuratoryGroups = []
    },
    showAddNewCuratoryGroup () {
      this.addCuratoryGroupsPopupVisible = true
    },
    addNewCuratoryGroup (item) {
      const { id, text: name } = item
      this.addedCuratoryGroups.push({ id, name })
    },
    async updateProfile () {
      const curatoryGroupsToDelete = this.curatoryGroups.filter(group => this.deletedCuratoryGroups.includes(group))
      const curatoryGroupsToAdd = this.addedCuratoryGroups.filter(group => !this.deletedCuratoryGroups.includes(group))
      await profileServices.saveProfile({
        id: account.state().id,
        email: this.email,
        origpass: this.origpass,
        newpass: this.newpass,
        repeatpass: this.repeatpass,
        curatoryGroupsToDelete,
        curatoryGroupsToAdd
      })
      this.curatoryGroups = [
        ...this.curatoryGroups.filter(group => !this.deletedCuratoryGroups.includes(group)),
        ...this.addedCuratoryGroups.filter(group => !this.deletedCuratoryGroups.includes(group))
      ]
      this.selectedCuratoryGroups = []
      this.deletedCuratoryGroups = []
      this.addedCuratoryGroups = []
    },
    async removeProfile () {
      await profileServices.deleteProfile({ id: account.state().id })
      await account.logout()
      this.$router.push(HOME_ROUTE)
    },
  },
}
</script>

<style scoped>
</style>
