<template>
  <span>
    <login-popup v-if="showLogin" v-model="showLogin"/>
    <register-popup v-model="showRegister"/>
    <v-tooltip :disabled="!username" left>
      <v-menu slot="activator" offset-y>
        <v-btn slot="activator" icon >
          <v-icon color="info">person</v-icon>
        </v-btn>
        <v-list>
          <span v-for="menu in userMenuItems" :key="menu.id">
            <v-list-tile v-for="item in menu.items" :key="item.title" @click.stop="execute(item)">
              <v-list-tile-avatar>
                <v-icon v-if="!isImageIcon(item.icon)">{{item.icon}}</v-icon>
                <img v-else :src="item.icon" contain class="image-icon"/>
              </v-list-tile-avatar>
              <v-list-tile-title>{{item.title}}</v-list-tile-title>
            </v-list-tile>
            <v-divider v-if="!menu.last"></v-divider>
          </span>
        </v-list>
      </v-menu>
    <span>{{username}}</span>
    </v-tooltip>
  </span>
</template>

<script>
import account from '@/shared/models/account'
import LoginPopup from '@/shared/components/popups/LoginPopup'
import RegisterPopup from '@/shared/components/popups/RegisterPopup'

export default {
  components: { LoginPopup, RegisterPopup },
  props: {
    user: {
      type: String,
      required: false,
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
                icon: 'face',
                path: '/profile'
              },
              {
                title: 'Logout',
                icon: './img/logout.svg',
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
              icon: './img/login.svg',
              method: 'login'
            },
            {
              title: 'Registrieren',
              icon: 'face',
              method: 'register'
            },
          ],
          last: true,
        },
      ]
    }
  },

  methods: {
    isImageIcon (name) {
      return name.includes('/')
    },
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

<style scoped>
  .image-icon {
    width: 24px;
    height: 24px;
  }
</style>
