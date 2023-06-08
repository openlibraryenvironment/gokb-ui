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
                v-if="!loggedIn"
                v-on="tooltipOn"
              >
                mdi-account
              </v-icon>
              <v-avatar
                v-else
                color="rgba(0,0,0,.26)"
                :title="username"
              >
                <span class="text-h6">
                  {{ firstLetter }}
                </span>
              </v-avatar>
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
        {{ username || $tc('component.user.label') }}
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
        appColor: process.env.VUE_APP_COLOR || '#4f4f4f',
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
        return this.loggedIn ? 'success' : 'white'
      },
      username () {
        return accountModel.username()
      },
      loggedIn () {
        return accountModel.loggedIn()
      },
      firstLetter () {
        return (this.loggedIn && this.username?.substring(0, 1)?.toUpperCase())
      },
      userMenuItems () {
        if (this.loggedIn) {
          return [
            {
              id: 0,
              items: [
                {
                  title: this.$i18n.t('profile.label'),
                  icon: 'mdi-face-man-profile',
                  path: PROFILE_ROUTE,
                },
                {
                  title: this.$i18n.t('popups.logout.label'),
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
                title: this.$i18n.t('popups.login.label'),
                icon: 'mdi-login-variant',
                method: 'login'
              },
              {
                title: this.$i18n.t('register.register'),
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
