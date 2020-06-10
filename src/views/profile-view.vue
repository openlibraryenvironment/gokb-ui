<template>
  <gokb-page
    title="Profil"
    @submit="updateProfile"
  >
    <gokb-error-component :value="error" />
    <gokb-section title="Allgemein">
      <gokb-email-field
        v-model="email"
        :disabled="updateProfileAvailable"
      />
    </gokb-section>
    <gokb-section title="Kennwort">
      <gokb-password-field
        ref="passwordField"
        v-model="origpass"
        :disabled="updateProfileAvailable"
        label="Bisheriges Kennwort"
        :rules="[isPasswordEmpty, isPasswordWrong]"
      />
      <gokb-password-field
        v-model="newpass"
        :disabled="updateProfileAvailable"
        label="Neues Kennwort"
        autocomplete="new-password"
        :rules="[checkNewPassword, isPasswordEmpty]"
      />
      <gokb-password-field
        v-model="repeatpass"
        :disabled="updateProfileAvailable"
        label="Neues Kennwort (Wiederholung)"
        autocomplete="new-password"
        :rules="[checkNewPassword, isPasswordEmpty]"
      />
    </gokb-section>
    <gokb-add-item-popup
      v-if="addCuratoryGroupPopupVisible"
      v-model="addCuratoryGroupPopupVisible"
      :component="{ type: 'GokbCuratoryGroupField', name: 'Kuratorengruppe' }"
      @add="addNewCuratoryGroup"
    />
    <gokb-section title="Kuratorengruppen">
      <template #buttons>
        <gokb-button
          icon-id="add"
          :disabled="updateProfileAvailable"
          @click.native="showAddNewCuratoryGroup"
        >
          Hinzufügen
        </gokb-button>
        <gokb-button
          class="ml-4"
          icon-id="delete"
          :disabled="isDeleteSelectedDisabled"
          @click.native="confirmDeleteSelectedItems"
        >
          Löschen
        </gokb-button>
      </template>
      <gokb-confirmation-popup
        v-model="confirmationPopUpVisible"
        :message="messageToConfirm"
        @confirmed="executeAction(actionToConfirm, parameterToConfirm)"
      />
      <gokb-table
        :headers="curatoryGroupsTableHeaders"
        :disabled="updateProfileAvailable"
        :items="curatoryGroups"
        :selected-items="selectedCuratoryGroups"
        :total-number-of-items="totalNumberOfItems"
        :options.sync="curatoryGroupsOptions"
        @selected-items="selectedCuratoryGroups = $event"
        @delete-item="confirmDeleteItem"
      />
    </gokb-section>
    <template #buttons>
      <gokb-button
        :disabled="removeProfileAvailable"
        @click.native="confirmRemoveProfile"
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
  import { HOME_ROUTE } from '@/router/route-paths'
  import account from '@/shared/models/account-model'
  import profileServices from '@/shared/services/profile-services'
  import BaseComponent from '@/shared/components/base-component'
  import GokbErrorComponent from '@/shared/components/complex/gokb-error-component'
  import GokbAddItemPopup from '@/shared/popups/gokb-add-item-popup'
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'

  const ROWS_PER_PAGE = 10

  const CURATORY_GROUPS_TABLE_HEADERS = [
    { text: 'Gruppe', align: 'left', value: 'name', sortable: false, width: '100%' },
  ]

  export default {
    name: 'ProfileView',
    components: {
      GokbAddItemPopup,
      GokbErrorComponent,
      GokbConfirmationPopup
    },
    extends: BaseComponent,
    data () {
      return {
        addCuratoryGroupPopupVisible: false,

        email: undefined,
        origpass: undefined,
        newpass: undefined,
        repeatpass: undefined,

        updateProfileUrl: undefined,
        deleteProfileUrl: undefined,

        curatoryGroupsOptions: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
        },
        allCuratoryGroups: [],
        selectedCuratoryGroups: [],
        addedCuratoryGroups: [],

        confirmationPopUpVisible: false,
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        messageToConfirm: undefined,

        passwordWrongMessage: undefined,
      }
    },
    computed: {
      isDeleteSelectedDisabled () {
        return !this.selectedCuratoryGroups.length
      },
      curatoryGroups () {
        return [...this.addedCuratoryGroups, ...this.allCuratoryGroups]
          .sort(({ name: first }, { name: second }) => (first > second) ? 1 : (second > first) ? -1 : 0)
          .slice((this.curatoryGroupsOptions.page - 1) * ROWS_PER_PAGE, this.curatoryGroupsOptions.page * ROWS_PER_PAGE)
      },
      totalNumberOfItems () {
        return this.allCuratoryGroups.length + this.addedCuratoryGroups.length
      },
      removeProfileAvailable () {
        return !this.deleteProfileUrl
      },
      updateProfileAvailable () {
        return !this.updateProfileUrl
      }
    },
    watch: {
      passwordWrongMessage () {
        this.$refs.passwordField.validate()
      }
    },
    async activated () {
      const {
        data: {
          data: {
            email,
            curatoryGroups,
            _links: {
              update: { href: updateProfileUrl },
              delete: { href: deleteProfileUrl }
            }
          }
        }
      } = await this.catchError({
        promise: profileServices.getProfile(this.cancelToken.token),
        instance: this
      })
      this.updateProfileUrl = updateProfileUrl
      this.deleteProfileUrl = deleteProfileUrl
      this.email = email
      this.allCuratoryGroups = curatoryGroups.map(group => ({ ...group, isDeletable: true }))
    },
    created () {
      this.curatoryGroupsTableHeaders = CURATORY_GROUPS_TABLE_HEADERS
    },
    methods: {
      isPasswordEmpty () {
        return (this.newpass || this.repeatpass) && !this.origpass ? 'Bitte erfassen Sie das alte Passwort' : true
      },
      isPasswordWrong () {
        return (this.origpass && this.passwordWrongMessage) || true
      },
      checkNewPassword () {
        return this.newpass && this.repeatpass && this.newpass !== this.repeatpass ? 'Das neue Passwort ist nicht identisch.' : true
      },
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      confirmDeleteSelectedItems () {
        this.actionToConfirm = '_deleteSelectedCuratoryGroups'
        this.messageToConfirm = 'Wollen Sie die ausgewählten Elemente wirklich löschen?'
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      confirmDeleteItem ({ id }) {
        this.actionToConfirm = '_deleteItem'
        this.messageToConfirm = 'Wollen Sie das ausgewählte Elemente wirklich löschen?'
        this.parameterToConfirm = id
        this.confirmationPopUpVisible = true
      },
      confirmRemoveProfile () {
        this.actionToConfirm = '_removeProfile'
        this.messageToConfirm = 'Wollen Sie das Profil wirklich löschen?'
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      _deleteSelectedCuratoryGroups () {
        this.addedCuratoryGroups = this.addedCuratoryGroups.filter(({ id }) => !this.selectedCuratoryGroups
          .find(({ id: selectedId }) => id === selectedId))
        this.allCuratoryGroups = this.allCuratoryGroups.filter(({ id }) => !this.selectedCuratoryGroups
          .find(({ id: selectedId }) => id === selectedId))
        this.selectedCuratoryGroups = []
      },
      _deleteItem (idToDelete) {
        this.addedCuratoryGroups = this.addedCuratoryGroups.filter(({ id }) => id !== idToDelete)
        this.allCuratoryGroups = this.allCuratoryGroups.filter(({ id }) => id !== idToDelete)
        this.selectedCuratoryGroups = this.allCuratoryGroups.filter(({ id }) => id !== idToDelete)
      },
      showAddNewCuratoryGroup () {
        this.addCuratoryGroupPopupVisible = true
      },
      addNewCuratoryGroup ({ id, name }) {
        !this.allCuratoryGroups.find(({ id: idInAll }) => id === idInAll) && !this.addedCuratoryGroups.find(({ id: idInAll }) => id === idInAll) && this.addedCuratoryGroups.push({ id, name, isDeletable: true })
      },

      async updateProfile () {
        const result = await this.catchError({
          promise: profileServices.updateProfile(this.updateProfileUrl, {
            email: this.email,
            ...(this.origpass ? { password: this.origpass } : {}),
            ...(this.newpass ? { new_password: this.newpass } : {}),
            curatoryGroupIds: this.curatoryGroups.map(({ id }) => id)
          }, this.cancelToken.token),
          instance: this
        })
        this.passwordWrongMessage = result?.data?.error?.message
      },
      async _removeProfile () {
        await this.catchError({
          promise: profileServices.deleteProfile(this.deleteProfileUrl, this.cancelToken.token),
          instance: this
        })
        await account.logout()
        await this.$router.push(HOME_ROUTE)
      }
    },
  }
</script>
