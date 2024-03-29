<template>
  <div>
    <v-snackbars :objects.sync="eventMessages">
      <template #action="{ close }">
        <v-btn icon @click="close()"><v-icon>mdi-close</v-icon></v-btn>
      </template>
    </v-snackbars>
    <gokb-page
      v-if="accessible && !notFound"
      :title="title"
      @submit="update"
    >
      <gokb-error-component :value="error" />
      <gokb-section :sub-title="$t('component.general.general')">
        <v-row>
          <v-col
            class="pt-8"
            md="4"
          >
            <gokb-username-field
              v-model="username"
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
              v-model="password"
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
              v-model="email"
              hide-icon
              dense
            />
          </v-col>
          <!--        <v-col md="4">-->
          <!--          <gokb-search-organisation-field-->
          <!--            v-model="organisation"-->
          <!--          />-->
          <!--        </v-col>-->
        </v-row>
        <v-row>
          <v-col cols="2">
            <gokb-checkbox-field
              v-model="enabled"
              :label="$t('component.user.enabled.active.label')"
            />
          </v-col>
          <v-col cols="2">
            <gokb-checkbox-field
              v-model="accountLocked"
              :label="$t('component.user.locked.label')"
            />
          </v-col>
          <v-col md="3">
            <gokb-checkbox-field
              v-model="passwordExpired"
              :label="$t('component.user.passwordExpired')"
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
              :selected-items="selectedRoles"
              :total-number-of-items="totalNumberOfRoles"
              :options.sync="rolesOptions"
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
            v-model="allCuratoryGroups"
            :sub-title="$tc('component.curatoryGroup.label', 2)"
          />
        </v-col>
      </v-row>
      <template #buttons>
        <v-spacer />
        <gokb-button
          text
          @click="pageBack"
        >
          {{ $t('btn.cancel') }}
        </gokb-button>
        <gokb-button
          default
          :disabled="!valid"
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
        <v-card-text>
          <div class="text-h5 primary--text">
            {{ $t('component.general.notFound', [$tc('component.user.label')]) }}
          </div>
        </v-card-text>
      </v-card>
    </gokb-page>
  </div>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import account from '@/shared/models/account-model'
  import GokbErrorComponent from '@/shared/components/complex/gokb-error-component'
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import GokbAddItemPopup from '@/shared/popups/gokb-add-item-popup'
  import GokbCuratoryGroupSection from '@/shared/components/complex/gokb-curatory-group-section'
  import VSnackbars from 'v-snackbars'

  import userServices from '@/shared/services/user-services'

  const ROWS_PER_PAGE = 10

  export default {
    name: 'EditUserView',
    components: {
      GokbAddItemPopup,
      GokbConfirmationPopup,
      GokbErrorComponent,
      GokbCuratoryGroupSection,
      VSnackbars
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
        username: undefined,
        password: undefined,
        passwordExpired: undefined,
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
        allRoles: [],
        selectedRoles: [],
        addedRoles: [],
        allCuratoryGroups: [],
        updateUserUrl: undefined,
        notFound: false,
        confirmationPopUpVisible: false,
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        messageToConfirm: undefined,
        eventMessages: []
      }
    },
    computed: {
      accessible () {
        return account.loggedIn() && account.hasRole('ROLE_ADMIN')
      },
      rolesTableHeaders () {
        return [
          {
            text: this.$i18n.tc('component.user.role.label'),
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
        return (this.password?.length > 5 && this.password?.length < 64)
      },
      passwordValidMessage () {
        return this.isPasswordValid || this.$i18n.t('validation.passwordLength')
      },
      valid () {
        return this.username && (this.isEdit || this.isPasswordValid)
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
          this.eventMessages.push({
            message: this.$i18n.t('success.create', [this.$i18n.tc('component.user.label'), this.username]),
            color: 'success',
            timeout: 2000
          })
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
      async update () {
        this.eventMessages = []

        const data = {
          username: this.username,
          password: this.password,
          email: this.email,
          accountLocked: this.accountLocked,
          enabled: this.enabled,
          version: this.version,
          passwordExpired: this.passwordExpired,
          roleIds: this.roles.map(({ id }) => id),
          curatoryGroupIds: this.allCuratoryGroups.map(({ id }) => id),
          // organisation: this.organisation
        }
        const response = await this.catchError({
          promise: userServices.createOrUpdate(this.id, data, this.cancelToken.token),
          instance: this
        })
        // todo: check error code
        if (response?.status < 400) {
          if (this.isEdit) {
            this.eventMessages.push({
              message: this.$i18n.t('success.update', [this.$i18n.tc('component.user.label'), this.username]),
              color: 'success',
              timeout: 2000
            })
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
          this.eventMessages.push({
            message: this.$i18n.t('error.update.409', [this.$i18n.tc('component.user.label')]),
            color: 'error',
            timeout: -1
          })
        } else if (response?.status === 404) {
          this.notFound = true
        } else {
          this.eventMessages.push({
            message: this.$i18n.t('error.general.500', [this.$i18n.tc('component.user.label')]),
            color: 'error',
            timeout: -1
          })
        }
      },
      pageBack () {
        this.$router.go(-1)
      },
      async fetch () {
        const response = await this.catchError({
          promise: userServices.get(this.id, this.cancelToken.token),
          instance: this
        })

        if (response?.status === 200) {
          this.addedRoles = []
          this.username = response.data.data.username
          this.password = undefined
          this.email = response.data.data.email
          this.version = response.data.data.version
          this.accountLocked = response.data.data.accountLocked
          this.enabled = response.data.data.enabled
          this.passwordExpired = response.data.data.passwordExpired
          this.allRoles = response.data.data.roles.map(({ authority, ...rest }) => ({
            ...rest,
            name: authority
          }))
          this.updateUserUrl = response.data.data.updateUserUrl
          this.allCuratoryGroups = response.data.data.curatoryGroups.map(group => ({
            ...group,
            isDeletable: true
          }))
          // this.organisation = organisation
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
          vars: [this.selectedItems.length, this.$i18n.tc('component.user.role.label', this.selectedItems.length)]
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
