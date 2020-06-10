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
  import BaseComponent from '@/shared/components/base-component'
  import loading from '@/shared/models/loading'
  import accountModel from '@/shared/models/account-model'

  export default {
    name: 'LoginPopup',
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
        const response = await this.catchError({
          promise: accountModel.login({ username, password, save }, this.cancelToken.token),
          instance: this
        })
        this.error = response?.status
        form.validate()
        if (accountModel.loggedIn()) {
          this.close()
        }
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
