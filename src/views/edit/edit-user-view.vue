<template>
  <gokb-page
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
            autocomplete="off"
            :rules="[]"
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
      :component="{ type: 'GokbRoleField', name: 'Rolle', properties: { returnObject: true } }"
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
              icon-id="add"
              @click="showAddNewRole"
            >
              {{ $t('btn.add') }}
            </gokb-button>
            <gokb-button
              icon-id="delete"
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
            :disabled="updateUserAvailable"
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
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import { NO_ACCESS_ROUTE } from '@/router/route-paths'
  import account from '@/shared/models/account-model'
  import GokbErrorComponent from '@/shared/components/complex/gokb-error-component'
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import GokbAddItemPopup from '@/shared/popups/gokb-add-item-popup'
  import GokbCuratoryGroupSection from '@/shared/components/complex/gokb-curatory-group-section'

  import userServices from '@/shared/services/user-services'

  const ROWS_PER_PAGE = 10

  export default {
    name: 'EditUserView',
    components: { GokbAddItemPopup, GokbConfirmationPopup, GokbErrorComponent, GokbCuratoryGroupSection },
    extends: BaseComponent,
    props: {
      id: {
        type: [Number, String],
        required: false,
        default: undefined
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
      rolesTableHeaders () {
        return [
          { text: this.$i18n.tc('component.user.role.label'), align: 'left', value: 'localName', sortable: false, width: '100%' },
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
      valid () {
        return this.username && (this.isEdit || (this.password.length > 5 && this.password.length < 64))
      }
    },
    async created () {
      if (account.loggedIn() && account.hasRole('ROLE_ADMIN')) {
        if (this.isEdit) {
          this.fetch()
        }
      } else {
        this.$router.push(NO_ACCESS_ROUTE)
      }
    },
    methods: {
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      addNewRole ({ id, name }) {
        // console.log('addNewRole', id, name)
        !this.allRoles.find(({ id: idInAll }) => id === idInAll) && !this.addedRoles.find(({ id: idInAll }) => id === idInAll) && this.addedRoles.push({ id, name, isDeletable: true })
      },
      showAddNewRole () {
        this.addRolePopupVisible = true
      },
      async update () {
        const data = {
          id: this.id,
          username: this.username,
          password: this.password,
          email: this.email,
          accountLocked: this.accountLocked,
          enabled: this.enabled,
          passwordExpired: this.passwordExpired,
          roleIds: this.roles.map(({ id }) => id),
          curatoryGroupIds: this.allCuratoryGroups.map(({ id }) => id),
          // organisation: this.organisation
        }
        const response = await this.catchError({
          promise: userServices.createOrUpdateUser(data, this.cancelToken.token),
          instance: this
        })
        // todo: check error code
        if (response.status === 200) {
          if (this.isEdit) {
            this.fetch()
          } else {
            this.$router.put('/user/' + response.data.id)
          }
        }
      },
      pageBack () {
        this.$router.go(-1)
      },
      async fetch () {
        const {
          data: {
            data: {
              username,
              email,
              accountLocked,
              enabled,
              passwordExpired,
              roles,
              curatoryGroups,
              _links: {
                update: { href: updateUserUrl },
              },
              // organisation
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
        this.allCuratoryGroups = curatoryGroups.map(group => ({ ...group, isDeletable: true }))
        // this.organisation = organisation
      },
      confirmDeleteRole ({ id, value }) {
        this.actionToConfirm = '_deleteRole'
        this.messageToConfirm = { text: 'popups.confirm.delete.list', vars: [this.$i18n.tc('component.user.role.label'), value] }
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
        this.messageToConfirm = { text: 'popups.confirm.delete.list', vars: [this.selectedItems.length, this.$i18n.tc('component.user.role.label', this.selectedItems.length)] }
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
