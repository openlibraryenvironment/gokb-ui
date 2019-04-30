<template>
  <v-dialog :value="value" width="400" persistent>
      <v-card class="elevation-12">
        <v-form ref="form" @submit.prevent="login">
          <v-toolbar color="info">
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-text-field label="Benutzername"
                          v-model="user"
                          :rules="rules"
                          type="text" prepend-icon="person" name="user" autocomplete="username" required/>
            <v-text-field label="Kennwort"
                          v-model="password"
                          :rules="rules"
                          type="password" prepend-icon="lock" name="password" autocomplete="current-password" required/>
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
      user: undefined,
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
    login () {
      const user = this.user
      const password = this.password
      // const save = this.save
      this.doLogin({ user, password })
        .then(() => {
          // this.save && storage.saveLoginData({ user, password, save })
          this.close()
          this.route && this.$router.push(this.route)
        })
        .catch(error => {
          this.error = error
        })
    },
    close () {
      this.$emit('input', false)
    }
  }
}
</script>
