<template>
  <span>
    <gokb-login-popup v-model="showLogin" />
    <gokb-register-popup v-model="showRegister" />

    <v-menu>
      <template #activator="{ props: menu }">
        <v-tooltip location='left'>
          <template #activator="{ props: tooltip }">
            <v-btn
              id="user-btn"
              icon
              v-bind="mergeProps(menu, tooltip)"
            >
              <v-icon
                v-if="!loggedIn"
                aria-label="Show Login"
                role="img"
              >
                mdi-account
              </v-icon>
              <v-avatar
                v-else
                color="rgba(0,0,0,.26)"
                :title="username"
                text="firstLetter"
              >
                <span class="text-h6 text-bg">
                  {{ firstLetter }}
                </span>
              </v-avatar>
            </v-btn>
          </template>
          <span>
            {{ username || $tc('component.user.label') }}
          </span>
        </v-tooltip>
      </template>
      <v-list>
        <span
          v-for="menu in userMenuItems"
          :key="menu.id"
        >
          <v-list-item
            v-for="item in menu.items"
            :key="item.title"
            :id="item.id"
            :prepend-icon="item.icon"
            @click="execute(item)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
          <v-divider v-if="!menu.last" />
        </span>
      </v-list>
    </v-menu>
  </span>
</template>

<script>
  import { HOME_ROUTE, PROFILE_ROUTE } from '@/router/route-paths'
  import accountModel from '@/shared/models/account-model'
  import showLoginModel from '@/shared/models/show-login-model'
  import GokbLoginPopup from '@/shared/popups/gokb-login-popup'
  import GokbRegisterPopup from '@/shared/popups/gokb-register-popup'
  import { mergeProps } from 'vue'

  export default {
    name: 'UserMenu',
    components: { GokbLoginPopup, GokbRegisterPopup },
    data () {
      return {
        showRegister: false,
        appColor: import.meta.env.VITE_COLOR || '#4f4f4f',
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
                  id: 'user-menu-profile'
                },
                {
                  title: this.$i18n.t('popups.logout.label'),
                  icon: 'mdi-logout-variant',
                  method: 'logout',
                  path: HOME_ROUTE,
                  id: 'user-menu-logout'
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
                method: 'login',
                id: 'user-menu-login'
              },
              {
                title: this.$i18n.t('register.register'),
                icon: 'mdi-account-plus',
                method: 'register',
                id: 'user-menu-register'
              },
            ],
            last: true,
          },
        ]
      }
    },
    methods: {
      mergeProps,
      execute ({ method, path }) {
        if (method) {
          this[method]()
        }

        if (!!path && path !== this.$route.name) {
          this.navigateTo(path)
        }
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
