<template>
  <gokb-page
    title="Profil"
    @valid="valid = $event"
    @submit="updateProfile"
  >
    <gokb-error-component :value="error" />
    <span v-if="successMsgShown">
      <v-alert type="success">
        {{ $t('success.update', [$t('profile.label'),'']) }}
      </v-alert>
    </span>
    <gokb-section :title="$t('component.general.general')">
      <gokb-email-field
        v-model="email"
        :label="$t('component.user.email')"
        :disabled="updateProfileAvailable"
      />
    </gokb-section>
    <gokb-section :title="$t('component.user.password')">
      <gokb-password-field
        ref="passwordField"
        v-model="origpass"
        :disabled="updateProfileAvailable"
        :label="$t('profile.currentPass.label')"
        :rules="[isOldPasswordEmpty, isPasswordWrong]"
      />
      <gokb-password-field
        ref="newpass"
        v-model="newpass"
        :disabled="updateProfileAvailable"
        :label="$t('profile.newPass.label')"
        autocomplete="new-password"
        :rules="[checkNewPassword, isPasswordEmpty]"
      />
      <gokb-password-field
        ref="repeatpass"
        v-model="repeatpass"
        :disabled="updateProfileAvailable"
        :label="$t('profile.newPassConfirm.label')"
        autocomplete="new-password"
        :rules="[checkNewPassword, isPasswordEmpty]"
      />
    </gokb-section>
    <gokb-curatory-group-section
      v-model="allCuratoryGroups"
      :disabled="!isAdmin"
      :title="$tc('component.curatoryGroup.label', 2)"
    />
    <gokb-confirmation-popup
      v-model="confirmationPopUpVisible"
      :message="messageToConfirm"
      @confirmed="executeAction(actionToConfirm, parameterToConfirm)"
    />
    <template #buttons>
      <gokb-button
        :disabled="removeProfileAvailable"
        @click="confirmRemoveProfile"
      >
        {{ $t('profile.delete.label') }}
      </gokb-button>
      <v-spacer />
      <gokb-button
        :disabled="updateProfileAvailable || !valid"
        default
      >
        {{ $t('btn.update') }}
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
        valid: undefined,
        email: undefined,
        origpass: undefined,
        newpass: undefined,
        repeatpass: undefined,

        allCuratoryGroups: [],

        updateProfileUrl: undefined,
        deleteProfileUrl: undefined,

        confirmationPopUpVisible: false,
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        messageToConfirm: { text: undefined, vars: undefined },

        passwordWrongMessage: undefined,
      }
    },
    computed: {
      removeProfileAvailable () {
        return !this.deleteProfileUrl
      },
      updateProfileAvailable () {
        return !this.updateProfileUrl
      },
      isAdmin () {
        return account.hasRole('ROLE_ADMIN')
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
    methods: {
      isOldPasswordEmpty () {
        return (this.newpass || this.repeatpass) && !this.origpass ? this.$i18n.t('profile.currentPass.missing') : true
      },
      isPasswordEmpty () {
        return (this.newpass && !this.repeatpass) || (!this.newpass && this.repeatpass) ? this.$i18n.t('profile.newPass.missing') : true
      },
      isPasswordWrong () {
        return (this.origpass && this.passwordWrongMessage) || true
      },
      checkNewPassword () {
        return this.newpass && this.repeatpass && this.newpass !== this.repeatpass ? this.$i18n.t('profile.newPassConfirm.nomatch') : true
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
      async updateProfile (form) {
        this.successMsgShown = false

        const result = await this.catchError({
          promise: profileServices.updateProfile(this.updateProfileUrl, {
            email: this.email,
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

        if (result.status === 200) {
          this.successMsgShown = true
        }
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
