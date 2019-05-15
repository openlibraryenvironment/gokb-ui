<template>
  <v-dialog :value="value" width="400" persistent>
      <v-card class="elevation-12">
        <v-form ref="form" @submit.prevent="register">
          <v-toolbar>
            <v-toolbar-title>Registrierung</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-text-field label="Benutzername"
                          v-model="username"
                          :rules="rules"
                          type="text" prepend-icon="person" name="username" autocomplete="username" required/>
            <v-text-field label="Email"
                          v-model="email"
                          :rules="rules"
                          type="text" prepend-icon="email" name="email" autocomplete="email" required/>
            <v-text-field label="Kennwort"
                          v-model="password"
                          :rules="rules"
                          type="password" prepend-icon="lock" name="password" autocomplete="password" required/>
            <v-text-field label="Kennwort (Wiederholung)"
                          v-model="password2"
                          :rules="rules"
                          type="password" prepend-icon="lock" name="password2" autocomplete="password2" required/>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn @click="close" flat>Abbrechen</v-btn>
            <v-btn type="submit" color="info">Registrieren</v-btn>
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
  },
  watch: {
    error () {
      this.$refs.form.validate()
    }
  },
  methods: {
    async register () {
      const username = this.user
      const password = this.password
      const email = this.email
      const password2 = this.password2
      const registerResponse = await accountServices.register({ username, email, password, password2 })
      console.log(registerResponse)
    },
    close () {
      this.$emit('input', false)
    }
  }
}
</script>
