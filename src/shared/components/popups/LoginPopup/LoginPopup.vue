<template>
  <v-dialog :value="value" width="400" persistent>
      <v-card class="elevation-12">
        <v-form ref="form" @submit.prevent="login">
          <v-toolbar color="info">
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <gokb-name-field v-model="username"/>
            <gokb-password-field v-model="password"/>
            <v-checkbox
              label="automatisch einloggen"
              v-model="save"
              prepend-icon="cached"
            ></v-checkbox>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <gokb-button @click="close" flat>Abbrechen</gokb-button>
            <gokb-button type="submit" color="info">Login</gokb-button>
          </v-card-actions>
        </v-form>
      </v-card>
  </v-dialog>
</template>

<script>
import account from '@/shared/models/account'
import GokbButton from '@/shared/components/base/ButtonComponent'
import GokbNameField from '@/shared/components/simple/NameFieldComponent'
import GokbPasswordField from '@/shared/components/simple/PasswordFieldComponent'

export default {
  name: 'LoginPopup',
  components: { GokbNameField, GokbPasswordField, GokbButton },
  props: {
    value: {
      type: Boolean,
      required: true,
      default: false
    },
    route: {
      type: String,
      required: false,
    }
  },
  data () {
    return {
      valid: true,
      username: undefined,
      password: undefined,
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

  watch: {
    error () {
      this.$refs.form.validate()
    }
  },
  methods: {
    async login () {
      const username = this.username
      const password = this.password
      await account.login({ username, password })
      if (account.loggedIn()) {
        this.close()
      }
    },
    close () {
      this.$emit('input', false)
    }
  }
}
</script>
