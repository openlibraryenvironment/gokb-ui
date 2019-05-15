<template>
  <v-dialog :value="value" width="400" persistent>
      <v-card class="elevation-12">
        <v-form ref="form" @submit.prevent="login">
          <v-toolbar color="info">
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-text-field label="Benutzername"
                          v-model="username"
                          :rules="rules"
                          type="text" prepend-icon="person" name="username" autocomplete="username" required/>
            <v-text-field label="Kennwort"
                          v-model="password"
                          :rules="rules"
                          type="password" prepend-icon="lock" name="password" autocomplete="password" required/>
            <v-checkbox
              label="automatisch einloggen"
              v-model="save"
              prepend-icon="cached"
            ></v-checkbox>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn @click="close" flat>Abbrechen</v-btn>
            <v-btn type="submit" color="info">Login</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
  </v-dialog>
</template>

<script>
import accountServices from '@/shared/services/account-services'

export default {
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

  computed: {
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
      const loginResult = await accountServices.login({ username, password })
      console.log('loginResult', loginResult)
    },
    close () {
      this.$emit('input', false)
    }
  }
}
</script>
