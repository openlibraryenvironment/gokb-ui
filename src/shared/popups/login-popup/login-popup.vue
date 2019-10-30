<template>
  <gokb-dialog
    v-model="localValue"
    title="Login"
    @submit="login"
  >
    <gokb-username-field
      v-model="username"
      :rules="rules"
    />
    <gokb-password-field
      v-model="password"
      :rules="rules"
    />
    <v-checkbox
      v-model="save"
      label="automatisch einloggen"
      prepend-icon="cached"
    />
    <template #buttons>
      <v-spacer />
      <gokb-button
        text
        @click.native="close"
      >
        Abbrechen
      </gokb-button>
      <gokb-button default>
        Login
      </gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from '@/shared/base-component'
  import utils from '@/shared/utils/utils'
  import loading from '@/shared/models/loading'
  import account from '@/shared/models/account'
  import GokbDialog from '@/shared/components/complex/gokb-dialog'
  import GokbButton from '@/shared/components/base/gokb-button'
  import GokbUsernameField from '@/shared/components/simple/gokb-username-field'
  import GokbPasswordField from '@/shared/components/simple/gokb-password-field'

  export default {
    name: 'LoginPopup',
    components: { GokbDialog, GokbUsernameField, GokbPasswordField, GokbButton },
    extends: BaseComponent,
    props: {
      value: {
        type: Boolean,
        required: true,
        default: false
      },
      route: {
        type: String,
        required: false,
        default: undefined,
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
      loading () {
        return loading.isLoading()
      },
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
          () => !this.error || 'Falscher Benutzername oder Passwort.'
        ]
      },
    },
    methods: {
      async login (form) {
        const username = this.username
        const password = this.password
        const save = this.save
        loading.startLoading()
        const response = await account.login({ username, password, save })
        this.error = utils.errorOccurred(response)
        this.error && form.validate()
        if (account.loggedIn()) {
          this.close()
        }
        loading.stopLoading()
      },
      close () {
        this.error = undefined
        this.username = undefined
        this.password = undefined
        this.save = undefined

        this.localValue = false
      },
    }
  }
</script>
