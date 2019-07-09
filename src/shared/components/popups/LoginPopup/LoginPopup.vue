<template>
  <gokb-dialog v-model="localValue" title="Login" @submit="login">
      <gokb-username-field v-model="username" :rules="rules"/>
      <gokb-password-field v-model="password"  :rules="rules"/>
      <v-checkbox
        label="automatisch einloggen"
        v-model="save"
        prepend-icon="cached"
      ></v-checkbox>
    <template #buttons>
      <v-spacer/>
      <gokb-button @click.native="close" flat>Abbrechen</gokb-button>
      <gokb-button default>Login</gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
import BaseComponent from '@/shared/components/BaseComponent'
import utils from '@/shared/utils/utils'
import loading from '@/shared/models/loading'
import account from '@/shared/models/account'
import GokbDialog from '@/shared/components/complex/DialogComponent'
import GokbButton from '@/shared/components/base/ButtonComponent'
import GokbUsernameField from '@/shared/components/simple/UsernameFieldComponent'
import GokbPasswordField from '@/shared/components/simple/PasswordFieldComponent'

export default {
  extends: BaseComponent,
  name: 'LoginPopup',
  components: { GokbDialog, GokbUsernameField, GokbPasswordField, GokbButton },
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
    async login (form) {
      const username = this.username
      const password = this.password
      const save = this.save
      loading.startLoading()
      const response = await account.login({ username, password, save }, this.cancelToken.token)
      this.error = utils.errorOccurred(response)
      this.error && form.validate()
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
