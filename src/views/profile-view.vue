<template>
  <gokb-page
    title="Profil"
    @submit="updateProfile"
  >
    <gokb-section title="Allgemein">
      <gokb-email-field
        v-model="email"
        :disabled="updateProfileAvailable"
      />
    </gokb-section>
    <gokb-section title="Kennwort">
      <gokb-password-field
        v-model="origpass"
        :disabled="updateProfileAvailable"
        label="Bisheriges Kennwort"
      />
      <gokb-password-field
        v-model="newpass"
        :disabled="updateProfileAvailable"
        label="Neues Kennwort"
      />
      <gokb-password-field
        v-model="repeatpass"
        :disabled="updateProfileAvailable"
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
        <gokb-button
          :disabled="updateProfileAvailable"
          @click.native="showAddNewCuratoryGroup"
        >
          Hinzufügen
        </gokb-button>
        <gokb-button
          class="ml-4"
          :disabled="updateProfileAvailable"
          @click.native="deleteSelectedCuratoryGroups"
        >
          Löschen
        </gokb-button>
      </template>
      <gokb-table
        :disabled="updateProfileAvailable"
        :added-items="addedCuratoryGroups"
        :deleted-items="deletedCuratoryGroups"
        :headers="curatoryGroupsTableHeaders"
        :items="curatoryGroups"
        :selected-items="selectedCuratoryGroups"
      />
    </gokb-section>
    <template #buttons>
      <gokb-button
        :disabled="removeProfileAvailable"
        @click.native="removeProfile"
      >
        Konto löschen
      </gokb-button>
      <v-spacer />
      <gokb-button
        :disabled="updateProfileAvailable"
        default
      >
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
  import BaseComponent from '@/shared/base-component'
  import GokbAddCuratoryGroupsPopup from '@/shared/popups/add-curatory-groups-popup'

  const CURATORY_GROUPS_TABLE_HEADERS = [
    { text: 'Gruppe', align: 'left', value: 'name', sortable: false, width: '100%' },
  ]

  export default {
    name: 'ProfileComponent',
    components: {
      GokbAddCuratoryGroupsPopup,
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

        updateProfileUrl: undefined,
        deleteProfileUrl: undefined,
      }
    },
    computed: {
      removeProfileAvailable () {
        return !this.deleteProfileUrl
      },
      updateProfileAvailable () {
        return !this.updateProfileUrl
      }
    },
    async created () {
      loading.startLoading()
      this.curatoryGroupsTableHeaders = CURATORY_GROUPS_TABLE_HEADERS
      const { data: { email, curatoryGroups, _links: {
        update: { href: updateProfileUrl },
        delete: { href: deleteProfileUrl }
      } = { update: { href: undefined }, delete: { href: undefined } } } } =
        await profileServices.getProfile(this.cancelToken.token)
      this.updateProfileUrl = updateProfileUrl
      this.deleteProfileUrl = deleteProfileUrl
      this.email = email
      this.curatoryGroups = curatoryGroups
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
        const { id, name } = item
        this.addedCuratoryGroups.push({ id, name })
      },
      async updateProfile () {
        loading.startLoading()
        const curatoryGroups = [
          ...this.curatoryGroups.filter(group => !this.deletedCuratoryGroups.includes(group)),
          ...this.addedCuratoryGroups.filter(group => !this.deletedCuratoryGroups.includes(group))
        ] // .map(({ id }) => id)
        await profileServices.updateProfile(this.updateProfileUrl, {
          email: this.email,
          ...(this.origpass ? { origpass: this.origpass } : {}),
          ...(this.newpass ? { newpass: this.newpass } : {}),
          ...(this.repeatpass ? { repeatpass: this.repeatpass } : {}),
          curatoryGroups
        }, this.cancelToken.token)

        this.selectedCuratoryGroups = []
        this.deletedCuratoryGroups = []
        this.addedCuratoryGroups = []
        loading.stopLoading()
      },
      async removeProfile () {
        loading.startLoading()
        await profileServices.deleteProfile(this.deleteProfileUrl, this.cancelToken.token)
        await account.logout()
        loading.stopLoading()
        await this.$router.push(HOME_ROUTE)
      },
    },
  }
</script>
