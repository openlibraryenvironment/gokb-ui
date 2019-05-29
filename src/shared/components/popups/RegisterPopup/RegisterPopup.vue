<template>
  <gokb-dialog v-model="localValue" title="Registrierung" :submit="register">
    <gokb-username-field v-model="username"/>
    <gokb-email-field v-model="email"/>
    <gokb-password-field v-model="password"/>
    <gokb-password-field label="Kennwort (Wiederholung)" v-model="password2"/>
    <template #buttons>
      <v-spacer/>
      <gokb-button @click.native="close" flat>Abbrechen</gokb-button>
      <gokb-button type="submit" default>Registrieren</gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
import account from '@/shared/models/account'
import GokbDialog from '@/shared/components/complex/DialogComponent'
import GokbButton from '@/shared/components/base/ButtonComponent'
import GokbUsernameField from '@/shared/components/simple/UsernameFieldComponent'
import GokbEmailField from '@/shared/components/simple/EmailFieldComponent'
import GokbPasswordField from '@/shared/components/simple/PasswordFieldComponent'

export default {
  name: 'RegisterPopup',
  components: { GokbDialog, GokbUsernameField, GokbEmailField, GokbPasswordField, GokbButton },
  props: {
    value: {
      type: Boolean,
      required: true,
      default: false
    },
  },
  data () {
    return {
      valid: true,
      username: undefined,
      email: undefined,
      password: undefined,
      password2: undefined,
      save: undefined,
      rules: [
        () => {
          if (this.value && this.error) {
            const response = this.error.response
            // eslint-disable-next-line
            return response ? (response?.data?.error_description || response?.data?.ExceptionMessage) : true
          }
          return true
        }
      ]
    }
  },
  computed: {
    localValue: {
      get () {
        return this.value
      },
      set (localValue) {
        this.$emit('input', localValue)
      }
    },
  },
  watch: {
    error () {
      this.$refs.form.validate()
    }
  },
  methods: {
    async register () {
      const username = this.username
      const password = this.password
      const email = this.email
      const password2 = this.password2
      const registerResponse = await account.register({ username, email, password, password2 })
      console.log(registerResponse)
      this.close()
    },
    close () {
      this.localValue = false
    }
  }
}
</script>
