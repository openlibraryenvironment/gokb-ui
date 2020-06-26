<template>
  <gokb-page
    title="Profil"
    @valid="valid = $event"
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
        :rules="[isOldPasswordEmpty, isPasswordWrong]"
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
    <gokb-curatory-group-section
      v-model="allCuratoryGroups"
      title="Kuratorengruppen"
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
        Konto löschen
      </gokb-button>
      <v-spacer />
      <gokb-button
        :disabled="updateProfileAvailable || !valid"
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
        messageToConfirm: undefined,

        passwordWrongMessage: undefined,
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
    methods: {
      isOldPasswordEmpty () {
        return (this.newpass || this.repeatpass) && !this.origpass ? 'Bitte erfassen Sie das alte Passwort' : true
      },
      isPasswordEmpty () {
        return (this.newpass && !this.repeatpass) || (!this.newpass && this.repeatpass) ? 'Bitte erfassen Sie das neue Passwort zweimal.' : true
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
      confirmRemoveProfile () {
        this.actionToConfirm = '_removeProfile'
        this.messageToConfirm = 'Wollen Sie das Profil wirklich löschen?'
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      async updateProfile (form) {
        const result = await this.catchError({
          promise: profileServices.updateProfile(this.updateProfileUrl, {
            email: this.email,
            ...(this.origpass ? { password: this.origpass } : {}),
            ...(this.newpass ? { new_password: this.newpass } : {}),
            curatoryGroupIds: this.allCuratoryGroups.map(({ id }) => id)
          }, this.cancelToken.token),
          instance: this
        })
        // todo: sometimes error is an array and sometimes an object
        const message = result?.data?.errors ? Object.values(result.data.errors)
          ?.reduce((result, { message }) => `${result} ${message}`, '') : undefined
        this.passwordWrongMessage = message
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
