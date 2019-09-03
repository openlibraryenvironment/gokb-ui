<template>
  <span>
    <login-popup
      v-model="showLogin"
    />
    <register-popup v-model="showRegister" />
    <v-tooltip
      :disabled="!username"
      left
    >
      <template #activator="{ on }">
        <v-menu
          offset-y
          v-on="on"
        >
          <template #activator="{ on }">
            <v-btn
              icon
              v-on="on"
            >
              <v-icon color="info">mdi-account</v-icon>
            </v-btn>
          </template>
          <v-list>
            <span
              v-for="menu in userMenuItems"
              :key="menu.id"
            >
              <v-list-item
                v-for="item in menu.items"
                :key="item.title"
                @click.stop="execute(item)"
              >
                <v-list-item-avatar>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-avatar>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
              <v-divider v-if="!menu.last" />
            </span>
          </v-list>
        </v-menu>
      </template>
      <span>
        {{ username }}
      </span>
    </v-tooltip>
  </span>
</template>

<script>
  import account from '@/shared/models/account'
  import LoginPopup from '@/shared/components/popups/login-popup'
  import RegisterPopup from '@/shared/components/popups/register-popup'

  export default {
    components: { LoginPopup, RegisterPopup },
    props: {
      user: {
        type: String,
        required: false,
        default: undefined,
      },
    },
    data () {
      return {
        showLogin: false,
        showRegister: false,
      }
    },
    computed: {
      username () {
        return account.state().username
      },
      loggedIn () {
        return account.loggedIn()
      },
      userMenuItems () {
        if (this.loggedIn) {
          return [
            {
              id: 0,
              items: [
                {
                  title: 'Profil',
                  icon: 'mdi-face-profile',
                  path: '/profile'
                },
                {
                  title: 'Logout',
                  icon: 'mdi-logout-variant',
                  method: 'logout'
                },
              ],
              last: true
            },
          ]
        }

        return [
          {
            id: 0,
            items: [
              {
                title: 'Login',
                icon: 'mdi-login-variant',
                method: 'login'
              },
              {
                title: 'Registrieren',
                icon: 'mdi-account-plus',
                method: 'register'
              },
            ],
            last: true,
          },
        ]
      }
    },

    methods: {
      execute ({ method, path }) {
        if (method) {
          this[method]()
        }
        path && this.navigateTo(path)
      },
      login () {
        this.showLogin = true
      },
      register () {
        this.showRegister = true
      },
      logout () {
        account.logout()
      },
      navigateTo (path) {
        this.$router.push(path)
      },
    }
  }
</script>
