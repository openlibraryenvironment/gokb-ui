<template>
  <v-dialog :value="value" width="400" persistent>
      <v-card class="elevation-12">
        <v-form ref="form" @submit.prevent="login">
          <v-toolbar color="#F2994A">
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <gokb-username-field v-model="username" :rules="rules"/>
            <gokb-password-field v-model="password"  :rules="rules"/>
            <v-checkbox
              label="automatisch einloggen"
              v-model="save"
              prepend-icon="cached"
            ></v-checkbox>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <gokb-button @click.native="close" flat>Abbrechen</gokb-button>
            <gokb-button type="submit" default>Login</gokb-button>
          </v-card-actions>
        </v-form>
      </v-card>
  </v-dialog>
</template>

<script>
import BaseComponent from '@/shared/components/BaseComponent'
import utils from '@/shared/utils/utils'
import loading from '@/shared/models/loading'
import account from '@/shared/models/account'
import GokbButton from '@/shared/components/base/ButtonComponent'
import GokbUsernameField from '@/shared/components/simple/UsernameFieldComponent'
import GokbPasswordField from '@/shared/components/simple/PasswordFieldComponent'

export default {
  extends: BaseComponent,
  name: 'AddCuratorGroupPopup',
  components: { GokbUsernameField, GokbPasswordField, GokbButton },
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
      error: undefined,
      username: undefined,
      password: undefined,
      save: undefined,
    }
  },
  computed: {
    loading () { return loading.isLoading() },
    localValue: {
      get () {
        return this.value
      },
      set (localValue) {
        this.$emit('input', localValue)
      }
    },
    rules () {
      return [
        value => !!value || 'Bitte erfassen.',
        value => !this.error || 'Falscher Benutzername oder Passwort.'
      ]
    },
  },
  methods: {
    async login () {
      const username = this.username
      const password = this.password
      const save = this.save
      loading.startLoading()
      const response = await account.login({ username, password, save }, this.cancelToken.token)
      this.error = utils.errorOccurred(response)
      this.error && this.$refs.form.validate()
      if (account.loggedIn()) {
        this.close()
      }
      loading.stopLoading()
    },
    close () {
      this.localValue = false
    }
  }
}
</script>
