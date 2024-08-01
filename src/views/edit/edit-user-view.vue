<template>
  <div>
    <v-snackbar v-model="showSnackbar" :color="messageColor" :timeout="currentSnackBarTimeout">
        {{ snackbarMessage }}
    </v-snackbar>
    <gokb-page
      v-if="accessible && !notFound"
      :key="version"
      :title="title"
    >
      <gokb-error-component :value="error" />
      <gokb-section :sub-title="$t('component.general.general')">
        <v-row>
          <v-col
            class="pt-8"
            md="4"
          >
            <gokb-username-field
              v-model="active.username"
              :label="$t('component.user.username')"
              required
              hide-icon
              autocomplete="off"
              dense
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col
            v-if="!id"
            md="4"
          >
            <gokb-password-field
              v-model="active.password"
              :label="$t('component.user.password')"
              hide-icon
              required
              validate-on-blur
              autocomplete="off"
              :rules="[passwordValidMessage]"
              dense
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col md="4">
            <gokb-email-field
              v-model="active.email"
              hide-icon
              dense
            />
          </v-col>
          <v-col>
            <div style="width:200px">
              <v-select
                v-model="active.preferredLocaleString"
                :items="languageOptions"
                :label="$t('component.user.preferredLocaleString.label')"
                variant="underlined"
                density="compact"
                clearable
              />
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <gokb-checkbox-field
              v-model="active.enabled"
              :label="$t('component.user.enabled.active.label')"
            />
          </v-col>
          <v-col cols="2">
            <gokb-checkbox-field
              v-model="active.accountLocked"
              :label="$t('component.user.locked.label')"
            />
          </v-col>
        </v-row>
      </gokb-section>
      <gokb-add-item-popup
        v-if="addRolePopupVisible"
        v-model="addRolePopupVisible"
        :component="{ type: 'GokbRoleField', properties: { returnObject: true } }"
        @add="addNewRole"
      />
      <v-row>
        <v-col
          cols="12"
          xl="6"
        >
          <gokb-section :sub-title="$tc('component.user.role.label', 2)">
            <template #buttons>
              <gokb-button
                class="mr-4"
                icon-id="mdi-plus"
                color="primary"
                @click="showAddNewRole"
              >
                {{ $t('btn.add') }}
              </gokb-button>
              <gokb-button
                icon-id="mdi-delete"
                :disabled="isDeleteSelectedRolesDisabled"
                @click="confirmDeleteSelectedRoles"
              >
                {{ $t('btn.delete') }}
              </gokb-button>
            </template>
            <gokb-confirmation-popup
              v-model="confirmationPopUpVisible"
              :message="messageToConfirm"
              @confirmed="executeAction(actionToConfirm, parameterToConfirm)"
            />
            <gokb-table
              :headers="rolesTableHeaders"
              :items="roles"
              :editable="accessible"
              :selected-items="selectedRoles"
              :total-number-of-items="totalNumberOfRoles"
              :options.sync="rolesOptions"
              :hide-select="!accessible"
              @selected-items="selectedRoles = $event"
              @delete-item="confirmDeleteRole"
            />
          </gokb-section>
        </v-col>
        <v-col
          cols="12"
          xl="6"
        >
          <gokb-curatory-group-section
            v-model="active.curatoryGroups"
            :sub-title="$tc('component.curatoryGroup.label', 2)"
          />
        </v-col>
      </v-row>
      <template #buttons>
        <gokb-confirmation-popup
          v-model="deleteConfirmationPopUpVisible"
          :message="messageToConfirm"
          @confirmed="executeAction(actionToConfirm, parameterToConfirm)"
        />
        <gokb-button
          v-if="isEdit"
          :disabled="!isUserDeletable"
          @click="confirmDeleteUser"
        >
          {{ $t('profile.delete.label') }}
        </gokb-button>
        <v-spacer />
        <gokb-button
          @click="fetch"
        >
          {{ $t('btn.reset') }}
        </gokb-button>
        <gokb-confirm-activate-popup
          v-if="activateOptionsVisible"
          v-model="activateOptionsVisible"
          @submit="activate"
        />
        <gokb-button
          v-if="isEdit && !isActivated"
          :disabled="!valid || isActivated"
          color="primary"
          @click="showActivateOptions"
        >
          {{ $t('btn.activate') }}
        </gokb-button>
        <gokb-button
          :disabled="!valid"
          is-submit
          @click="update"
        >
          {{ updateButtonText }}
        </gokb-button>
      </template>
    </gokb-page>
    <gokb-no-access-field v-else-if="!accessible" />
    <gokb-page
      v-else
      title=""
    >
      <v-card>
        <v-card-text align="center">
          <div class="text-h5 primary--text">
            {{ $t('component.general.notFound', [$tc('component.user.label')]) }}
          </div>
        </v-card-text>
      </v-card>
    </gokb-page>
  </div>
</template>

<script>
  import { SEARCH_USER_ROUTE } from '@/router/route-paths'
  import BaseComponent from '@/shared/components/base-component'
  import account from '@/shared/models/account-model'
  import GokbErrorComponent from '@/shared/components/complex/gokb-error-component'
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import GokbConfirmActivatePopup from '@/shared/popups/gokb-confirm-activate-popup'
  import GokbAddItemPopup from '@/shared/popups/gokb-add-item-popup'
  import GokbCuratoryGroupSection from '@/shared/components/complex/gokb-curatory-group-section'

  import userServices from '@/shared/services/user-services'

  const ROWS_PER_PAGE = 10

  export default {
    name: 'EditUserView',
    components: {
      GokbAddItemPopup,
      GokbConfirmationPopup,
      GokbConfirmActivatePopup,
      GokbErrorComponent,
      GokbCuratoryGroupSection
    },
    extends: BaseComponent,
    props: {
      id: {
        type: [Number, String],
        required: false,
        default: undefined
      },
      isCreated: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data () {
      return {
        addRolePopupVisible: false,
        activateOptionsVisible: false,
        username: undefined,
        email: undefined,
        enabled: undefined,
        version: undefined,
        successMsg: undefined,
        accountLocked: undefined,
        // organisation: undefined,

        rolesOptions: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
        },
        persisted: {
          username: undefined,
          password: undefined,
          email: undefined,
          enabled: undefined,
          successMsg: undefined,
          accountLocked: undefined,
          curatoryGroups: []
        },
        active: {
          username: undefined,
          password: undefined,
          email: undefined,
          enabled: undefined,
          successMsg: undefined,
          accountLocked: undefined,
          curatoryGroups: []
        },
        languageOptions: ['de', 'en'],
        preferredLocaleString: undefined,
        allRoles: [],
        selectedRoles: [],
        addedRoles: [],
        curatoryGroups: [],
        updateUserUrl: undefined,
        notFound: false,
        confirmationPopUpVisible: false,
        deleteConfirmationPopUpVisible: false,
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        messageToConfirm: undefined,
        showSnackbar: false,
        snackbarMessage: undefined,
        messageColor: undefined,
        currentSnackBarTimeout: '-1'
      }
    },
    computed: {
      accessible () {
        return account?.loggedIn() && account?.hasRole('ROLE_ADMIN')
      },
      rolesTableHeaders () {
        return [
          {
            title: this.$i18n.tc('component.user.role.label'),
            align: 'left',
            value: 'localName',
            sortable: false,
            width: '100%'
          }
        ]
      },
      isDeleteSelectedRolesDisabled () {
        return !this.selectedRoles.length
      },
      roles () {
        return [...this.addedRoles, ...this.allRoles]
          .map(role => ({ ...role, localName: this.$i18n.t('component.user.role.' + role.name) }))
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
        return this.isEdit ? this.$i18n.t('header.edit.label', [this.$i18n.tc('component.user.label')]) : this.$i18n.t('header.add.label', [this.$i18n.tc('component.user.label')])
      },
      updateButtonText () {
        return this.id ? this.$i18n.t('btn.update') : this.$i18n.t('btn.add')
      },
      isPasswordValid () {
        return (this.active.password?.length > 5 && this.active.password?.length < 64)
      },
      passwordValidMessage () {
        return this.isPasswordValid || this.$i18n.t('validation.passwordLength')
      },
      valid () {
        return this.active.username && (this.isEdit || this.isPasswordValid)
      },
      isActivated () {
        return !this.isEdit || this.allRoles.length > 1 || (!this.persisted?.accountLocked && this.persisted?.enabled)
      },
      isUserDeletable () {
        return account.hasRole('ROLE_SUPERUSER') || this.allRoles.filter(role => (role.name === 'ROLE_ADMIN')).length === 0
      }
    },
    watch: {
      accessible (acc) {
        if (acc) {
          this.fetch()
        }
      }
    },
    async created () {
      if (account.loggedIn() && account.hasRole('ROLE_ADMIN')) {
        if (this.isEdit) {
          this.fetch()
        }

        if (this.isCreated) {
          this.messageColor = 'success'
          this.snackbarMessage = this.$i18n.t('success.create', [this.$i18n.tc('component.user.label'), this.username])
          this.currentSnackBarTimeout = 4000
          this.showSnackbar = true
        }
      }
    },
    methods: {
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      addNewRole (role) {
        !this.allRoles.find(
          ({ id: idInAll }) => role.id === idInAll
        ) && !this.addedRoles.find(
          ({ id: idInAll }) => role.id === idInAll
        ) && this.addedRoles.push(
          { id: role.id, name: role.value, isDeletable: true }
        )
      },
      showAddNewRole () {
        this.addRolePopupVisible = true
      },
      showActivateOptions () {
        this.activateOptionsVisible = true
      },
      confirmDeleteUser () {
        this.actionToConfirm = '_deleteUser'
        this.messageToConfirm = { text: this.$i18n.t('profile.delete.confirm') }
        this.parameterToConfirm = undefined
        this.deleteConfirmationPopUpVisible = true
      },
      async _deleteUser () {
        const response = await this.catchError({
          promise: userServices.delete(this.id, this.cancelToken.token),
          instance: this
        })

        if (response?.status < 400) {
          await this.$router.push({
            name: SEARCH_USER_ROUTE,
            params: {
              initRefresh: true
            }
          })
        } else if (response?.status == 403) {
          this.messageColor = 'error'
          this.snackbarMessage = this.$i18n.t('user.error.update.forbidden')
          this.currentSnackBarTimeout = -1
          this.showSnackbar = true
        } else if (response?.status === 404) {
          this.notFound = true
        } else {
          this.messageColor = 'error'
          this.snackbarMessage = this.$i18n.t('error.general.500', [this.$i18n.tc('component.user.label')])
          this.currentSnackBarTimeout = -1
          this.showSnackbar = true
        }
      },
      async update () {
        this.showSnackbar = false

        const data = {
          ...this.active,
          version: this.version,
          roleIds: this.roles.map(({ id }) => id)
        }
        const response = await this.catchError({
          promise: userServices.createOrUpdate(this.id, data, this.cancelToken.token),
          instance: this
        })
        // todo: check error code
        if (response?.status < 400) {
          if (this.isEdit) {
            this.messageColor = 'success'
            this.snackbarMessage = this.$i18n.t('success.update', [this.$i18n.tc('component.user.label'), this.username])
            this.currentSnackBarTimeout = 4000
            this.showSnackbar = true

            this.fetch()
          } else {
            console.log("No ID")
            this.$router.push({
              name: '/user',
              params: {
                id: response.data.data.id,
                isCreated: true
              }
            })
          }
        } else if (response.status === 409) {
          this.messageColor = 'error'
          this.snackbarMessage = this.$i18n.t('error.update.409', [this.$i18n.tc('component.user.label')])
          this.currentSnackBarTimeout = -1
          this.showSnackbar = true
        } else if (response?.status === 404) {
          this.notFound = true
        } else if (response?.status === 403) {
          this.messageColor = 'error'
          this.snackbarMessage = this.$i18n.t('user.error.update.forbidden')
          this.currentSnackBarTimeout = -1
          this.showSnackbar = true
        } else {
          this.messageColor = 'error'
          this.snackbarMessage = this.$i18n.t('error.general.500', [this.$i18n.tc('component.user.label')])
          this.currentSnackBarTimeout = -1
          this.showSnackbar = true
        }
      },
      async activate (alertUser) {
        this.showSnackbar = false

        const response = await this.catchError({
          promise: userServices.activate(this.id, alertUser, this.cancelToken.token),
          instance: this
        })

        if (response?.status === 200) {
          if (response.data.warnings) {
            response.data.warnings.forEach (warning => {
              if (warning.messageCode) {
                this.messageColor = 'warning'
                this.snackbarMessage = this.$i18n.t(warning.messageCode)
                this.currentSnackBarTimeout = -1
                this.showSnackbar = true
              }
            })
          }
          else {
            this.messageColor = 'success'
            this.snackbarMessage = this.$i18n.t('success.update', [this.$i18n.tc('component.user.label'), this.username])
            this.currentSnackBarTimeout = 4000
            this.showSnackbar = true
          }

          this.fetch()
        }
        else if (response.status === 404) {
          this.notFound = true
        }
      },
      async fetch () {
        const response = await this.catchError({
          promise: userServices.get(this.id, this.cancelToken.token),
          instance: this
        })

        if (response?.status === 200) {
          this.addedRoles = []
          this.version = response.data.data.version
          this.persisted.username = response.data.data.username
          this.persisted.email = response.data.data.email
          this.persisted.accountLocked = response.data.data.accountLocked
          this.persisted.preferredLocaleString = response.data.data.preferredLocaleString
          this.persisted.enabled = response.data.data.enabled
          this.persisted.curatoryGroups = response.data.data.curatoryGroups.map(group => ({
            ...group,
            isDeletable: true
          }))

          this.active = this.persisted

          this.allRoles = response.data.data.roles.map(({ authority, ...rest }) => ({
            ...rest,
            name: authority
          }))
          this.updateUserUrl = response.data.data.updateUserUrl


        } else {
          this.notFound = true
        }
      },
      confirmDeleteRole ({ id, value }) {
        this.actionToConfirm = '_deleteRole'
        this.messageToConfirm = {
          text: 'popups.confirm.delete.list',
          vars: [this.$i18n.tc('component.user.role.label'), value]
        }
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
        this.messageToConfirm = {
          text: 'popups.confirm.delete.list',
          vars: [this.selectedRoles.length, this.$i18n.tc('component.user.role.label', this.selectedRoles.length)]
        }
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
