<template>
  <gokb-page
    title="Profil"
    @submit="updateProfile"
  >
    <gokb-section title="Allgemein">
      <gokb-email-field v-model="email" />
    </gokb-section>
    <gokb-section title="Kennwort">
      <gokb-password-field
        v-model="origpass"
        label="Bisheriges Kennwort"
      />
      <gokb-password-field
        v-model="newpass"
        label="Neues Kennwort"
      />
      <gokb-password-field
        v-model="repeatpass"
        label="Neues Kennwort (Wiederholung)"
      />
    </gokb-section>
    <gokb-add-curatory-groups-popup
      v-if="addCuratoryGroupsPopupVisible"
      v-model="addCuratoryGroupsPopupVisible"
      @add="addNewCuratoryGroup"
    />
    <gokb-section title="Kuratorengruppen">
      <template #buttons>
        <gokb-button @click.native="showAddNewCuratoryGroup">
          Hinzufügen
        </gokb-button>
        <gokb-button @click.native="deleteSelectedCuratoryGroups">
          Löschen
        </gokb-button>
      </template>
      <gokb-table
        :added-items="addedCuratoryGroups"
        :deleted-items="deletedCuratoryGroups"
        :headers="curatoryGroupsTableHeaders"
        :items="curatoryGroups"
        :selected-items="selectedCuratoryGroups"
      />
    </gokb-section>
    <template #buttons>
      <gokb-button @click.native="removeProfile">
        Konto löschen
      </gokb-button>
      <v-spacer />
      <gokb-button default>
        Aktualisieren
      </gokb-button>
    </template>
  </gokb-page>
</template>

<script>
  import { HOME_ROUTE } from '@/router/route-names'
  import loading from '@/shared/models/loading'
  import account from '@/shared/models/account'
  import profileServices from '@/shared/services/profile-services'
  import BaseComponent from '@/shared/components/base-component'
  import GokbAddCuratoryGroupsPopup from '@/shared/components/popups/add-curatory-groups-popup'
  import GokbPage from '@/shared/components/complex/page-component'
  import GokbTable from '@/shared/components/complex/table-component'
  import GokbSection from '@/shared/components/complex/section-component'
  import GokbButton from '@/shared/components/base/button-component'
  import GokbEmailField from '@/shared/components/simple/email-field-component'
  import GokbPasswordField from '@/shared/components/simple/password-field-component'

  const CURATORY_GROUPS_TABLE_HEADERS = [
    { text: 'Gruppe', align: 'left', value: 'name', sortable: false, width: '100%' },
  ]

  export default {
    name: 'ProfileComponent',
    components: {
      GokbAddCuratoryGroupsPopup,
      GokbPage,
      GokbSection,
      GokbTable,
      GokbEmailField,
      GokbButton,
      GokbPasswordField
    },
    extends: BaseComponent,
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
      loading.startLoading()
      this.curatoryGroupsTableHeaders = CURATORY_GROUPS_TABLE_HEADERS
      const { data: { email, curatoryGroups } } = await profileServices.loadProfile(this.cancelToken.token)
      this.email = email
      this.curatoryGroups = curatoryGroups.map(({ id, name }) => ({ id: `org.gokb.cred.CuratoryGroup:${id}`, name }))
      loading.stopLoading()
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
        await profileServices.deleteProfile({ id: account.state().id }, this.cancelToken.token)
        await account.logout()
        await this.$router.push(HOME_ROUTE)
      },
    },
  }
</script>
