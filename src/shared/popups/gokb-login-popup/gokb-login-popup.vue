<template>
  <gokb-dialog
    ref="dialog"
    v-model="localValue"
    :title="localTitle"
    @submit="login"
  >
    <div v-if="!showForgotPass">
      <gokb-username-field
        v-model="username"
        name="username"
        :label="$t('component.user.username')"
        :rules="rules"
      />
      <gokb-password-field
        v-model="password"
        name="password"
        :label="$t('component.user.password')"
        :rules="rules"
      />
      <v-checkbox
        v-model="save"
        :label="$t('popups.login.automatic')"
        prepend-icon="mdi-cached"
      />
      <div
        class="fp-toggle-link"
        @click="showForgotPass = !showForgotPass"
      >
        {{ $t('popups.login.forgotPassword') }}
      </div>
      <span
      v-if="error"
      class="error--text"
      >
        {{ $t('popups.login.error.' + error.toString()) }}
      </span>
    </div>

    <div v-else>
      <iframe
        id="fp-embed"
        frameborder="0"
        style="width:100%;min-height:350px;border:0px"
        :src="forgotPasswordlink"
      />
    </div>
    <template #buttons>
      <v-spacer />
      <gokb-button
        text
        @click="close"
      >
        {{ $t('btn.close') }}
      </gokb-button>
      <gokb-button v-if="!showForgotPass" default>
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
        showForgotPass: false
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
          this.showForgotPass = false
          this.$emit('input', localValue)
        }
      },
      rules () {
        return [
          value => !!value || this.$i18n.t('validation.missingValue')
        ]
      },
      forgotPasswordlink () {
        return `${process.env.VUE_APP_API_BASE_URL}/register/forgotPasswordExt?embed=true&lang=${this.$i18n.locale}`
      },
      localTitle () {
        return !this.showForgotPass ? this.$i18n.t('popups.login.label') : this.$i18n.t('popups.login.forgotPassword')
      }
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
        this.showForgotPass = false
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
<style scoped>
  .fp-toggle-link {
    cursor: pointer;
    text-decoration: underline;
  }
</style>
