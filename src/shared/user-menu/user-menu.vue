<template>
  <span>
    <login-popup v-model="showLogin" />
    <register-popup v-model="showRegister" />
    <v-tooltip
      bottom
    >
      <template #activator="{ on: tooltipOn }">
        <v-menu
          offset-y
        >
          <template #activator="{ on: menuOn }">
            <v-btn
              icon
              v-on="menuOn"
            >
              <v-icon
                :color="colorAccountIcon"
                v-on="tooltipOn"
              >
                mdi-account
              </v-icon>
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
                @click="execute(item)"
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
  import { HOME_ROUTE, PROFILE_ROUTE } from '@/router/route-paths'
  import accountModel from '@/shared/models/account-model'
  import showLoginModel from '@/shared/models/show-login-model'
  import LoginPopup from '@/shared/popups/gokb-login-popup'
  import RegisterPopup from '@/shared/popups/gokb-register-popup'

  export default {
    name: 'UserMenu',
    components: { LoginPopup, RegisterPopup },
    data () {
      return {
        showRegister: false,
      }
    },
    computed: {
      showLogin: {
        get () {
          return showLoginModel.get()
        },
        set (show) {
          showLoginModel.set(show)
        }
      },
      colorAccountIcon () {
        return this.loggedIn ? 'success' : 'info'
      },
      username () {
        return accountModel.username()
      },
      loggedIn () {
        return accountModel.loggedIn()
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
                  path: PROFILE_ROUTE,
                },
                {
                  title: 'Logout',
                  icon: 'mdi-logout-variant',
                  method: 'logout',
                  path: HOME_ROUTE,
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
        showLoginModel.set(true)
      },
      register () {
        this.showRegister = true
      },
      logout () {
        accountModel.logout()
      },
      async navigateTo (path) {
        await this.$router.push(path)
      },
    }
  }
</script>
