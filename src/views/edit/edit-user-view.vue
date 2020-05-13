<template>
  <gokb-page
    :title="title"
    @submit="update"
  >
    <gokb-error-component :value="error" />
    <gokb-section sub-title="Allgemein">
      <v-row>
        <v-col md="4">
          <gokb-username-field
            v-model="username"
            hide-icon
            autocomplete="off"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col md="4">
          <gokb-password-field
            v-model="password"
            label="Kennwort"
            hide-icon
            autocomplete="off"
          />
        </v-col>
        <v-col md="3">
          <gokb-checkbox-field
            v-model="passwordExpired"
            label="Kennwort abgelaufen"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col md="4">
          <gokb-email-field
            v-model="email"
            hide-icon
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col md="1">
          <gokb-checkbox-field
            v-model="enabled"
            label="Aktiv"
          />
        </v-col>
        <v-col md="1">
          <gokb-checkbox-field
            v-model="accountLocked"
            label="Gesperrt"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col md="4">
          <gokb-search-provider-field label="Organisation" />
        </v-col>
      </v-row>
    </gokb-section>
    <gokb-add-item-popup
      v-if="addRolePopupVisible"
      v-model="addRolePopupVisible"
      :component="{ type: 'GokbRoleField', name: 'Rolle' }"
      @add="addNewRole"
    />
    <gokb-section sub-title="Rollen">
      <template #buttons>
        <gokb-button
          class="mr-4"
          icon-id="add"
          @click.native="showAddNewRole"
        >
          Hinzufügen
        </gokb-button>
        <gokb-button
          icon-id="delete"
          :disabled="isDeleteSelectedRolesDisabled"
          @click.native="confirmDeleteSelectedRoles"
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
        :headers="rolesTableHeaders"
        :disabled="updateUserAvailable"
        :items="roles"
        :selected-items="selectedRoles"
        :total-number-of-items="totalNumberOfRoles"
        :options.sync="rolesOptions"
        @selected-items="selectedRoles = $event"
        @delete-item="confirmDeleteRole"
      />
    </gokb-section>
    <!--    <gokb-section sub-title="Kuratorengruppen">-->
    <!--      <template #buttons>-->
    <!--        <gokb-button-->
    <!--          class="mr-4"-->
    <!--          icon-id="add"-->
    <!--          @click.native="showAddNewCuratoryGroup"-->
    <!--        >-->
    <!--          Hinzufügen-->
    <!--        </gokb-button>-->
    <!--        <gokb-button-->
    <!--          icon-id="delete"-->
    <!--          @click.native="deleteSelectedCuratoryGroups"-->
    <!--        >-->
    <!--          Löschen-->
    <!--        </gokb-button>-->
    <!--      </template>-->
    <!--      <gokb-table-->
    <!--        :headers="curatoryHeaders"-->
    <!--      />-->
    <!--    </gokb-section>-->
    <template #buttons>
      <v-spacer />
      <gokb-button
        text
        @click.native="pageBack"
      >
        Abbrechen
      </gokb-button>
      <gokb-button default>
        {{ updateButtonText }}
      </gokb-button>
    </template>
  </gokb-page>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import GokbErrorComponent from '@/shared/components/complex/gokb-error-component'
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import GokbAddItemPopup from '@/shared/popups/gokb-add-item-popup'
  import GokbSearchProviderField from '@/shared/components/simple/gokb-search-provider-field'
  import loading from '@/shared/models/loading'
  import userServices from '@/shared/services/user-services'

  const ROWS_PER_PAGE = 10

  const ROLES_TABLE_HEADERS = [
    { text: 'Rolle', align: 'left', value: 'name', sortable: false, width: '100%' },
  ]

  export default {
    name: 'EditUserView',
    components: { GokbAddItemPopup, GokbConfirmationPopup, GokbErrorComponent, GokbSearchProviderField },
    extends: BaseComponent,
    props: {
      id: {
        type: Number,
        required: true,
      }
    },
    data () {
      return {
        addRolePopupVisible: false,

        username: undefined,
        password: undefined,
        passwordExpired: undefined,
        email: undefined,
        enabled: undefined,
        accountLocked: undefined,

        rolesOptions: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
        },
        roleHeaders: [
          {
            text: 'Rolle',
            align: 'left',
            sortable: false,
            value: 'role'
          },
        ],
        allRoles: [],
        selectedRoles: [],
        addedRoles: [],

        curatoryHeaders: [
          {
            text: 'Gruppe',
            align: 'left',
            sortable: false,
            value: 'group'
          },
        ],

        updateUserUrl: undefined,

        confirmationPopUpVisible: false,
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        messageToConfirm: undefined,
      }
    },
    computed: {
      updateUserAvailable () {
        return !this.updateUserUrl
      },
      isDeleteSelectedRolesDisabled () {
        return !this.selectedRoles.length
      },
      roles () {
        return [...this.addedRoles, ...this.allRoles]
          .sort(({ name: first }, { name: second }) => (first > second) ? 1 : (second > first) ? -1 : 0)
          .slice((this.rolesOptions.page - 1) * ROWS_PER_PAGE, this.rolesOptions.page * ROWS_PER_PAGE)
      },
      totalNumberOfRoles () {
        return this.allRoles.length + this.addedRoles.length
      },
      isEdit () {
        return !!this.id
      },
      title () {
        return this.isEdit ? 'Benutzer bearbeiten' : 'Benutzer hinzufügen'
      },
      updateButtonText () {
        return this.id ? 'Aktualisieren' : 'Hinzufügen'
      }
    },
    async created () {
      this.rolesTableHeaders = ROLES_TABLE_HEADERS
      if (this.isEdit) {
        loading.startLoading()
        const {
          data: {
            data: {
              username,
              email,
              accountLocked,
              enabled,
              passwordExpired,
              roles,
              _links: {
                update: { href: updateUserUrl },
              }
            }
          }
        } = await this.catchError({
          promise: userServices.getUser(this.id, this.cancelToken.token),
          instance: this
        })
        this.username = username
        this.password = undefined
        this.email = email
        this.accountLocked = accountLocked
        this.enabled = enabled
        this.passwordExpired = passwordExpired
        this.allRoles = roles.map(({ authority, ...rest }) => ({ ...rest, name: authority }))
        this.updateUserUrl = updateUserUrl
        loading.stopLoading()
      }
    },
    methods: {
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      addNewRole ({ id, name }) {
        console.log('addNewRole', id, name)
        !this.allRoles.find(({ id: idInAll }) => id === idInAll) && !this.addedRoles.find(({ id: idInAll }) => id === idInAll) && this.addedRoles.push({ id, name, isDeletable: true })
      },
      showAddNewRole () {
        this.addRolePopupVisible = true
      },
      async update () {
        loading.startLoading()
        const data = {
          id: this.id,
          username: this.username,
          password: this.password,
          email: this.email,
          accountLocked: this.accountLocked,
          enabled: this.enabled,
          passwordExpired: this.passwordExpired,
          roles: this.roles.map(({ id }) => id)
        }
        await this.catchError({
          promise: userServices.createOrUpdateUser(data, this.cancelToken.token),
          instance: this
        })
        loading.stopLoading()
        this.pageBack()
      },
      pageBack () {
        this.$router.go(-1)
      },
      confirmDeleteRole ({ id }) {
        this.actionToConfirm = '_deleteRole'
        this.messageToConfirm = 'Wollen Sie das ausgewählte Elemente wirklich löschen?'
        this.parameterToConfirm = id
        this.confirmationPopUpVisible = true
      },
      _deleteRole (idToDelete) {
        this.addedRoles = this.addedRoles.filter(({ id }) => id !== idToDelete)
        this.allRoles = this.allRoles.filter(({ id }) => id !== idToDelete)
        this.selectedRoles = this.selectedRoles.filter(({ id }) => id !== idToDelete)
      },
      confirmDeleteSelectedRoles () {
        this.actionToConfirm = '_deleteSelectedRoles'
        this.messageToConfirm = 'Wollen Sie die ausgewählten Elemente wirklich löschen?'
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      _deleteSelectedRoles () {
        this.addedRoles = this.addedRoles.filter(({ id }) => !this.selectedRoles
          .find(({ id: selectedId }) => id === selectedId))
        this.allRoles = this.allRoles.filter(({ id }) => !this.selectedRoles
          .find(({ id: selectedId }) => id === selectedId))
        this.selectedRoles = []
      },

    }
  }
</script>
