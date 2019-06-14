<template>
  <gokb-page title="Profil">
    <gokb-section title="Allgemein">
      <gokb-email-field v-model="email"></gokb-email-field>
    </gokb-section>
    <gokb-section title="Kennwort">
      <gokb-password-field label="Bisheriges Kennwort" v-model="origpass"/>
      <gokb-password-field label="Neues Kennwort" v-model="newpass"/>
      <gokb-password-field label="Neues Kennwort (Wiederholung)" v-model="repeatpass"/>
    </gokb-section>
    <gokb-section title="Kuratorengruppen">
      <template #buttons>
        <gokb-button @click.native="addNewCuratorGroup">Hinzufügen</gokb-button>
        <gokb-button @click.native="deleteSelectedCuratorGroups">Löschen</gokb-button>
      </template>
      <gokb-table
        :headers="curatorGroupsTableHeaders"
        :items="curatorGroups"
        :selected-items="selectedCuratorGroups"
        :deleted-items="deletedCuratorGroups"
        :added-items="addedCuratorGroups"/>
    </gokb-section>
    <template #buttons>
      <gokb-button>Konto löschen</gokb-button>
      <v-spacer></v-spacer>
      <gokb-button default>Aktualisieren</gokb-button>
    </template>
  </gokb-page>
</template>

<script>
import profileServices from '@/shared/services/profile-services'
import GokbPage from '@/shared/components/complex/PageComponent'
import GokbTable from '@/shared/components/complex/TableComponent'
import GokbSection from '@/shared/components/complex/SectionComponent'
import GokbButton from '@/shared/components/base/ButtonComponent'
import GokbEmailField from '@/shared/components/simple/EmailFieldComponent'
import GokbPasswordField from '@/shared/components/simple/PasswordFieldComponent'

const CURATOR_GROUPS_TABLE_HEADERS = [
  { text: 'Gruppe', align: 'left', value: 'Name', sortable: false, width: '100%' },
]

export default {
  name: 'ProfileComponent',
  components: { GokbPage, GokbSection, GokbTable, GokbEmailField, GokbButton, GokbPasswordField },
  data () {
    return {
      email: undefined,
      origpass: undefined,
      newpass: undefined,
      repeatpass: undefined,
      curatorGroups: undefined,

      selectedCuratorGroups: [],
      deletedCuratorGroups: [],
      addedCuratorGroups: [],
    }
  },
  async created () {
    this.curatorGroupsTableHeaders = CURATOR_GROUPS_TABLE_HEADERS
    const { email, curatorGroups } = await profileServices.loadProfile()
    this.email = email
    this.curatorGroups = curatorGroups
  },
  methods: {
    deleteSelectedCuratorGroups () {
      this.selectedCuratorGroups.forEach(selected => this.deletedCuratorGroups.push(selected))
      this.selectedCuratorGroups = []
    },
    addNewCuratorGroup () {
      this.addedCuratorGroups.push({ Name: 'Name' })
    },
  },
}
</script>

<style scoped>
</style>
