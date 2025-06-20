<template>
  <v-snackbar v-model="showSnackbar" :color="messageColor" :timeout="currentSnackBarTimeout">
      {{ snackbarMessage }}
      <template #actions>
        <v-icon @click="showSnackbar = false" color="white">mdi-close</v-icon>
      </template>
  </v-snackbar>
  <gokb-page
    v-if="loggedIn"
    :title="$t('profile.label')"
    @valid="valid = $event"
  >
    <gokb-error-component :value="error" />
    <gokb-section :title="$t('component.general.general')">
      <v-row>
        <v-col>
          <gokb-email-field
            id="email"
            v-model="email"
            :label="$t('component.user.email')"
            :disabled="!updateProfileAvailable"
            :api-errors="errors.email"
          />
        </v-col>
        <v-col>
          <div style="width:200px">
            <v-select
              v-model="preferredLocaleString"
              :items="languageOptions"
              variant="underlined"
              :label="$t('component.user.preferredLocaleString.label')"
              clearable
            />
          </div>
        </v-col>
      </v-row>
    </gokb-section>
    <gokb-section :title="$t('component.user.password')">
      <gokb-password-field
        id="current-password"
        ref="passwordField"
        v-model="origpass"
        :disabled="!updateProfileAvailable"
        autocomplete="current-password"
        :label="$t('profile.currentPass.label')"
        :rules="[isOldPasswordEmpty, isPasswordWrong]"
      />
      <gokb-password-field
        id="new-password"
        ref="newpass"
        v-model="newpass"
        :disabled="!updateProfileAvailable"
        :label="$t('profile.newPass.label')"
        autocomplete="new-password"
        :rules="[checkNewPassword, isPasswordEmpty, isPasswordConfirmed]"
      />
      <gokb-password-field
        id="repeat-password"
        ref="repeatpass"
        v-model="repeatpass"
        :disabled="!updateProfileAvailable"
        :label="$t('profile.newPassConfirm.label')"
        autocomplete="new-password"
        :rules="[checkNewPasswordConfirm, isPasswordEmpty, isPasswordConfirmed]"
      />
    </gokb-section>
    <gokb-curatory-group-section
      v-model="allCuratoryGroups"
      :disabled="!isAdmin"
      :title="$tc('component.curatoryGroup.label', 2)"
    />

    <div v-for="group in allCuratoryGroups">
      <gokb-section
        v-if="group.updateEnabled"
        :sub-title=group.name
      >
        <v-row dense>
          <v-col>
            <gokb-email-field
              class="ml-2"
              v-model="group.email"
              width="400px"
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <gokb-checkbox-field
              v-model="group.cancelledImportAlerts"
              :disabled="!group.email"
              :label="$t('component.curatoryGroup.cancelledImportAlerts.label')"
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <gokb-checkbox-field
              v-model="group.newReviewsAlerts"
              :disabled="!group.email"
              :label="$t('component.curatoryGroup.newReviewsAlerts.label')"
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <gokb-button class="ma-3" @click="updateGroupInfo(group)">
              {{ $t('btn.update') }}
            </gokb-button>
          </v-col>
        </v-row>
      </gokb-section>
    </div>

    <gokb-confirmation-popup
      v-model="confirmationPopUpVisible"
      :message="messageToConfirm"
      @confirmed="executeAction(actionToConfirm, parameterToConfirm)"
    />
    <template #buttons>
      <gokb-button
        :disabled="!removeProfileAvailable"
        @click="confirmRemoveProfile"
      >
        {{ $t('profile.delete.label') }}
      </gokb-button>
      <v-spacer />
      <gokb-button
        :disabled="!updateProfileAvailable || !valid"
        @click="updateProfile"
      >
        {{ $t('btn.update') }}
      </gokb-button>
    </template>
  </gokb-page>
  <gokb-no-access-field v-else />
</template>

<script>
  import { HOME_ROUTE } from '@/router/route-paths'
  import account from '@/shared/models/account-model'
  import profileServices from '@/shared/services/profile-services'
  import curatoryGroupServices from '@/shared/services/curatory-group-services'
  import BaseComponent from '@/shared/components/base-component'
  import GokbErrorComponent from '@/shared/components/complex/gokb-error-component'
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import GokbCuratoryGroupSection from '@/shared/components/complex/gokb-curatory-group-section'

  export default {
    name: 'ProfileView',
    components: {
      GokbErrorComponent,
      GokbConfirmationPopup,
      GokbCuratoryGroupSection
    },
    extends: BaseComponent,
    props: {
      successMsgShown: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data () {
      return {
        valid: true,
        email: undefined,
        errors: {},
        origpass: undefined,
        newpass: undefined,
        repeatpass: undefined,
        allCuratoryGroups: [],
        languageOptions: ['de', 'en'],
        preferredLocaleString: undefined,
        updateProfileUrl: undefined,
        deleteProfileUrl: undefined,
        confirmationPopUpVisible: false,
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        messageToConfirm: {
          text: undefined,
          vars: undefined
        },
        showSnackbar: false,
        snackbarMessage: undefined,
        messageColor: undefined,
        currentSnackBarTimeout: '-1',
        passwordWrongMessage: undefined,
      }
    },
    computed: {
      removeProfileAvailable () {
        return !!this.deleteProfileUrl
      },
      updateProfileAvailable () {
        return !!this.updateProfileUrl
      },
      isAdmin () {
        return account.hasRole('ROLE_ADMIN')
      },
      loggedIn () {
        return account.loggedIn()
      }
    },
    watch: {
      passwordWrongMessage () {
        this.$refs.passwordField.validate()
      },
      repeatpass () {
        this.$refs.newpass.validate()
        this.$refs.repeatpass.validate()
      },
      newpass () {
        this.$refs.newpass.validate()
        this.$refs.repeatpass.validate()
      },
      loggedIn (acc) {
        if (acc) {
          this.fetchProfile()

          document.title = this.$i18n.t('route.profile')
        }
      }
    },
    async activated () {
      if (account.loggedIn()) {
        this.fetchProfile()
      }
      else {
        document.title = this.$i18n.t('route.profile') + ' - ' + this.$i18n.t('default.401.title')
      }
    },
    methods: {
      isOldPasswordEmpty () {
        return (!this.newpass && !this.repeatpass) || !!this.origpass || this.$i18n.t('profile.currentPass.missing')
      },
      isPasswordEmpty () {
        return (!!this.newpass && !!this.repeatpass) || (!this.origpass && !this.newpass && !this.repeatpass) || this.$i18n.t('profile.newPass.missing')
      },
      isPasswordWrong () {
        return (!!this.origpass && !!this.passwordWrongMessage) || true
      },
      isPasswordConfirmed () {
        return (!!this.newpass && !!this.repeatpass && this.newpass === this.repeatpass) || (!this.newpass && !this.repeatpass) || this.$i18n.t('profile.newPassConfirm.nomatch')
      },
      checkNewPassword () {
        return (!this.newpass || (this.newpass.length >= 6 && this.newpass.length <= 64)) || this.$i18n.t('validation.passwordLength')
      },
      checkNewPasswordConfirm () {
        return (!this.repeatpass || (this.repeatpass.length >= 6 && this.repeatpass.length <= 64)) || this.$i18n.t('validation.passwordLength')
      },
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      confirmRemoveProfile () {
        this.actionToConfirm = '_removeProfile'
        this.messageToConfirm = { text: this.$i18n.t('profile.delete.confirm') }
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      async fetchProfile () {
        const response = await this.catchError({
          promise: profileServices.get(this.cancelToken.token),
          instance: this
        })

        if (response.status === 200) {
          this.updateProfileUrl = response.data.data._links.update?.href
          this.deleteProfileUrl = response.data.data._links.delete?.href
          this.preferredLocaleString = response.data.data.preferredLocaleString
          this.email = response.data.data.email
          this.allCuratoryGroups = response.data.data.curatoryGroups.map(group => ({
            ...group,
            cancelledImportAlerts: (group.cancelledImportAlerts === true),
            newReviewsAlerts: (group.newReviewsAlerts === true),
            updateEnabled: (!!group._links?.update?.href),
            isDeletable: true
          }))
        }
      },
      async updateProfile () {
        this.showSnackbar = false

        const result = await this.catchError({
          promise: profileServices.update(this.updateProfileUrl, {
            email: this.email,
            preferredLocaleString: this.preferredLocaleString,
            ...(this.origpass ? { password: this.origpass } : {}),
            ...(this.newpass ? { new_password: this.newpass } : {}),
            ...(account.hasRole('ROLE_ADMIN') ? { curatoryGroupIds: this.allCuratoryGroups.map(({ id }) => id) } : {}),
          }, this.cancelToken.token),
          instance: this
        })
        // todo: sometimes error is an array and sometimes an object
        const message = result?.data?.errors ? Object.values(result.data.errors)
          .reduce((result, { message }) => `${result} ${message}`, '') : undefined
        this.passwordWrongMessage = message
        this.origpass = undefined
        this.newpass = undefined
        this.repeatpass = undefined

        if (result.status === 200) {
          this.snackbarMessage = this.$i18n.t('success.update', [this.$i18n.t('profile.label')])
          this.messageColor = 'success'
          this.showSnackbar = true
          this.fetchProfile()
        } else {
          this.errors = result.data.errors
          this.snackbarMessage = this.$i18n.t('error.update.400')
          this.messageColor = 'error'
          this.showSnackbar = true
        }
      },
      async _removeProfile () {
        await this.catchError({
          promise: profileServices.delete(this.deleteProfileUrl, this.cancelToken.token),
          instance: this
        })
        await account.logout()
        await this.$router.push(HOME_ROUTE)
      },
      async updateGroupInfo (info) {
        const result = await this.catchError({
          promise: curatoryGroupServices.createOrUpdate(info, this.cancelToken.token),
          instance: this
        })

        if (result.status === 200) {
          this.snackbarMessage = this.$i18n.t('success.update', [this.$i18n.tc('component.curatoryGroup.label')])
          this.messageColor = 'success'
          this.showSnackbar = true
        }
        else {
          this.snackbarMessage = this.$i18n.t('error.update.400')
          this.messageColor = 'error'
          this.showSnackbar = true
        }
      }
    },
  }
</script>
