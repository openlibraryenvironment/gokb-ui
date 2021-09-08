<template>
  <gokb-dialog
    ref="dialog"
    v-model="localValue"
    title="Login"
    @submit="login"
  >
    <gokb-username-field
      v-model="username"
      :label="$t('component.user.username')"
      :rules="rules"
    />
    <gokb-password-field
      v-model="password"
      :label="$t('component.user.password')"
      :rules="rules"
    />
    <v-checkbox
      v-model="save"
      :label="$t('popups.login.automatic')"
      prepend-icon="cached"
    />
    <span
      v-if="error"
      class="error--text"
    >
      {{ $t('popups.login.error.' + error.toString()) }}
    </span>
    <template #buttons>
      <v-spacer />
      <gokb-button
        text
        @click="close"
      >
        {{ $t('btn.cancel') }}
      </gokb-button>
      <gokb-button default>
        {{ $t('btn.submit') }}
      </gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import loading from '@/shared/models/loading'
  import accountModel from '@/shared/models/account-model'

  export default {
    name: 'GokbLoginPopup',
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
          value => !!value || this.$i18n.t('validation.missingValue'),
          () => !this.error || this.$i18n.t('login.errors.401')
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
        this.$refs.dialog.$refs.form.resetValidation()
      },
    }
  }
</script>
