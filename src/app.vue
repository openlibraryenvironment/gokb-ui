<template>
  <v-app>
    <progress-overlay />
    <v-app-bar
      :color="appColor"
      class="pr-3"
      dark
    >
      <v-toolbar-title class="toolbar-title">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <v-btn
          text
          :color="appColor"
          :to="{ name: homeRoute }"
        >
          <v-icon
            color="white"
            class="mr-5"
            style="vertical-align:text-top"
          >
            mdi-home
          </v-icon>
          <span
            class="application-title text-h6"
          >
            {{ appName }}
          </span>
        </v-btn>
      </v-toolbar-title>
      <v-spacer/>
      <v-btn
        class="mr-2"
        icon
        small
        :title="$t('btn.darkMode')"
        @click="toggleDarkMode"
      >
        <v-icon small>
          {{ $vuetify.theme.dark ? 'mdi-invert-colors-off' : 'mdi-invert-colors' }}
        </v-icon>
      </v-btn>
      <a
        icon
        :class="['mr-2', ($vuetify.theme.dark ? 'text-primary' : 'text-invert')]"
        target="_blank"
        :href="docsLink || $t('main.docs.target')"
        :title="$t('main.docs.label')"
      >
        <v-icon small>
          mdi-help-circle
        </v-icon>
      </a>
      <v-select
        v-model="currentLocale"
        :items="locales"
        :title="$t('component.general.language.label')"
        class="pt-2 ma-2"
        style="max-width:80px"
        variant="underlined"
        dense
      />
      <v-select
        v-if="loggedIn"
        v-model="activeGroup"
        :items="groups"
        item-title="name"
        item-value="id"
        :title="$tc('component.curatoryGroup.label')"
        class="pt-2 ma-2"
        style="max-width:150px"
        variant="underlined"
        return-object
        dense
      />
      <user-menu />
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      overflow
    >
      <v-list
        dense
        expand
        nav
      >
        <div v-if="canCreate">
          <v-list-item
            v-for="item in createMenuItems"
            :key="item.text"
            :to="item.route"
          >
            <template #prepend>
              <v-icon>
                {{ item.icon }}
              </v-icon>
            </template>
            <v-list-item-title class="font-weight-bold" v-text="item.text" />
          </v-list-item>

          <v-divider />
        </div>

        <v-list-item
          v-for="item in searchMenuItems"
          :key="item.text"
          :to="item.route"
        >
          <template #prepend>
            <v-icon>
              {{ item.icon }}
            </v-icon>
          </template>
          <v-list-item-title class="font-weight-bold" v-text="item.text" />
        </v-list-item>

        <v-divider />

        <v-list-item
          key="validator"
          :to="validatorRoute"
        >
          <template #prepend>
            <v-icon>
              mdi-file-table
            </v-icon>
          </template>

          <v-list-item-title class="font-weight-bold" v-text="$t('route.kbartValidator')" />
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <v-row v-if="loginExpiredMsg">
          <v-col>
            <v-alert
              type="warn"
              dismissible
            >
              {{ $t('popup.login.expired') }}
            </v-alert>
          </v-col>
        </v-row>
        <v-row v-if="updateExists">
          <v-col>
            <v-btn
              text
              @click="refreshApp"
            >
              - Update -
            </v-btn>
          </v-col>
        </v-row>
        <v-row class="pl-6 mb-1">
          <v-col
            class="text-caption"
          >
            <span
              class="text-primary"
              :style="{ cursor: 'pointer', padding: '3px', borderRadius: '3px', backgroundColor: (showCommit ? 'bg' : 'card') }"
              @click="showCommit = !showCommit"
            >
              {{ appVersion }}
            </span>
            <span
              v-if="showCommit"
              class="ml-4 text-primary"
            >
              UI Commit #{{ gitCommit }}
            </span>
          </v-col>
        </v-row>
        <v-row
          class="text-caption pl-6"
          dense
        >
          <v-col>
            <a
              :href="docsLink || $t('main.docs.target')"
              target="_blank"
              class="text-primary"
              :style="{ textDecoration: 'none'}"
            >
              {{ $t('main.docs.label') }}
            </a>
          </v-col>
        </v-row>
        <v-row
          class="text-caption pl-6"
          dense
        >
          <v-col>
            <a
              href="https://github.com/openlibraryenvironment/gokb/wiki/API"
              target="_blank"
              class="text-primary"
              :style="{ textDecoration: 'none' }"
            >
              API
            </a>
          </v-col>
        </v-row>
        <v-row
          v-if="!!imprintLink"
          class="text-caption pl-6"
          dense
        >
          <v-col>
            <a
              :href="imprintLink"
              target="_blank"
              class="text-primary"
              :style="{ textDecoration: 'none' }"
            >
              {{ $t('main.legal.label') }}
            </a>
          </v-col>
        </v-row>
        <v-row
          v-if="!!privacyLink"
          class="text-caption pl-6"
          dense
        >
          <v-col>
            <a
              :href="privacyLink"
              target="_blank"
              class="text-primary"
              :style="{ textDecoration: 'none' }"
            >
              {{ $t('main.privacy.label') }}
            </a>
          </v-col>
        </v-row>
        <v-row
          v-if="!!accessibilityLink"
          class="text-caption pl-6"
          dense
        >
          <v-col>
            <a
              :href="accessibilityLink"
              target="_blank"
              :style="{ textDecoration: 'none', color: ($vuetify.theme.dark ? 'white' : 'black') }"
            >
              {{ $t('main.accessibility.label') }}
            </a>
          </v-col>
        </v-row>
        <v-row style="height:20px"></v-row>
      </template>
    </v-navigation-drawer>
    <v-main>
      <v-container fluid>
          <router-view v-slot="{Component}" :key="$route.fullPath">
            <keep-alive :exclude="/^Edit\w*$/">
              <component :is="Component" />
            </keep-alive>
          </router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  import accountModel from '@/shared/models/account-model'
  import { ROLE_ADMIN, ROLE_EDITOR } from '@/shared/models/roles'
  import ProgressOverlay from '@/shared/components/base/gokb-progress-overlay'
  import UserMenu from '@/shared/user-menu'
  import baseServices from '@/shared/services/base-services'
  import "@fontsource/roboto"
  import "@fontsource/roboto/500.css"
  import "@fontsource/roboto/700.css"
  import "@fontsource/roboto/900.css"
  import update from './mixins/update'
  import pkg from '../package.json'
  import {
    HOME_ROUTE, CREATE_PACKAGE_ROUTE, CREATE_TITLE_ROUTE, CREATE_USER_ROUTE,
    SEARCH_PACKAGE_ROUTE, SEARCH_REVIEW_ROUTE, SEARCH_TITLE_ROUTE,
    SEARCH_PROVIDER_ROUTE, SEARCH_USER_ROUTE, CREATE_PROVIDER_ROUTE,
    VALIDATOR_ROUTE
  } from '@/router/route-paths'
  import { createCancelToken } from '@/shared/services/http'
  import profileServices from '@/shared/services/profile-services'
  import searchServices from '@/shared/services/search-services'
  import languageServices from '@/shared/services/language-services'
  import namespaceServices from '@/shared/services/namespace-services'

  // const SEARCH_COMPONENTS = [COMPONENT_TYPE_PACKAGE, COMPONENT_TYPE_JOURNAL_INSTANCE, COMPONENT_TYPE_ORG, COMPONENT_TYPE_BOOK_INSTANCE]

  export default {
    name: 'App',
    components: { UserMenu, ProgressOverlay },
    mixins: [update],
    data: () => ({
      drawer: null,
      privacyLink: import.meta.env.VITE_DP_LINK,
      imprintLink: import.meta.env.VITE_IMP_LINK,
      docsLink: import.meta.env.VITE_DOCS_LINK,
      accessibilityLink: import.meta.VITE_APP_ACC_LINK,
      appName: import.meta.env.VITE_TITLE || 'GOKb Client',
      appColor: import.meta.env.VITE_COLOR || '#4f4f4f',
      appVersion: pkg.version || import.meta.env.VITE_VERSION,
      gitCommit: import.meta.env.VITE_GIT_HASH,
      loginExpiredMsg: false,
      globalSearchSelected: undefined,
      globalSearchField: undefined,
      globalSearchItems: undefined,
      globalSearchIsLoading: false,
      showCommit: false,
      dialog: false,
      locales: ['de', 'en'],
      groups: []
    }),
    computed: {
      searchMenuItems () {
        const menuItems = [
          { icon: 'mdi-folder', text: this.$i18n.tc('component.package.label', 2), route: SEARCH_PACKAGE_ROUTE },
          { icon: 'mdi-text-box-multiple', text: this.$i18n.tc('component.title.label', 2), route: SEARCH_TITLE_ROUTE },
          { icon: 'mdi-domain', text: this.$i18n.tc('component.provider.label', 2), route: SEARCH_PROVIDER_ROUTE },
          { icon: 'mdi-message-draw', text: this.$i18n.tc('component.review.label', 2), route: SEARCH_REVIEW_ROUTE, needsLogin: true, needsRole: ROLE_EDITOR },
          // { icon: 'keyboard', text: this.$i18n.tc('component.maintenance.label', 2), route: SEARCH_MAINTENANCE_ROUTE, needsLogin: true, needsRole: ROLE_EDITOR },
          { icon: 'mdi-account-multiple', text: this.$i18n.tc('component.user.label', 2), route: SEARCH_USER_ROUTE, needsLogin: true, needsRole: ROLE_ADMIN }
        ]

        return menuItems.filter(item => (!accountModel.loggedIn() && !item.needsLogin) || (accountModel.loggedIn() && (!item.needsRole || accountModel.hasRole(item.needsRole))))
      },
      createMenuItems() {
        const menuItems = [
          { icon: 'mdi-folder-plus', text: this.$i18n.t('header.create.label', [this.$i18n.tc('component.package.label')]), route: CREATE_PACKAGE_ROUTE, toolbar: true, needsLogin: true, needsRole: ROLE_EDITOR },
          { icon: 'mdi-text-box-plus', text: this.$i18n.t('header.create.label', [this.$i18n.tc('component.title.label')]), route: CREATE_TITLE_ROUTE, toolbar: true, needsLogin: true, needsRole: ROLE_EDITOR },
          { icon: 'mdi-domain-plus', text: this.$i18n.t('header.create.label', [this.$i18n.tc('component.provider.label')]), route: CREATE_PROVIDER_ROUTE, toolbar: true, needsLogin: true, needsRole: ROLE_EDITOR },
          { icon: 'mdi-account-plus', text: this.$i18n.t('header.create.label', [this.$i18n.tc('component.user.label')]), route: CREATE_USER_ROUTE, needsLogin: true, needsRole: ROLE_ADMIN },
        ]

        return menuItems.filter(item => accountModel.hasRole(item.needsRole))
      },
      validatorRoute () {
        return VALIDATOR_ROUTE
      },
      homeRoute () {
        return HOME_ROUTE
      },
      currentLocale: {
        get () {
          return this.$i18n?.locale || undefined
        },
        set (locale) {
          this.$i18n.locale = locale
          this.$vuetify.locale.current = locale

          if (this.$i18n.t('direction') === 'rtl') {
            this.$vuetify.rtl = true
          } else {
            this.$vuetify.rtl = false
          }

          if (accountModel.loggedIn() && locale !== accountModel.userLocale()) {
            accountModel.setLocale(locale)
          }

          baseServices.setLanguage(locale)
        }
      },
      activeGroup: {
        get () {
          return accountModel.activeGroup()
        },
        set (group) {
          accountModel.setActiveGroup(group)
        }
      },
      canCreate () {
        return this.loggedIn && accountModel.hasRole('ROLE_CONTRIBUTOR')
      },
      globalSearchPlaceholder () {
        return this.$i18n.t('search.global.placeholder')
      },
      loggedIn () {
        return accountModel.loggedIn()
      },
      typeRoutes () {
        return [
          { type: 'Organization', path: '/provider/', icon: 'mdi-domain', label: this.$i18n.tc('component.provider.label') },
          { type: 'Org', path: '/provider/', icon: 'mdi-domain', label: this.$i18n.tc('component.provider.label') },
          { type: 'Package', path: '/package/', icon: 'mdi-folder', label: this.$i18n.tc('component.package.label') },
          { type: 'Journal', path: '/title/', icon: 'mdi-text-box', label: this.$i18n.tc('component.title.type.Journal') },
          { type: 'JournalInstance', path: '/title/', icon: 'mdi-text-box', label: this.$i18n.tc('component.title.type.Journal') },
          { type: 'Book', path: '/title/', icon: 'mdi-book', label: this.$i18n.tc('component.title.type.Book') },
          { type: 'BookInstance', path: '/title/', icon: 'mdi-text-box', label: this.$i18n.tc('component.title.type.Book') },
          { type: 'Database', path: '/title/', icon: 'mdi-text-box', label: this.$i18n.tc('component.title.type.Database') },
          { type: 'DatabaseInstance', path: '/title/', icon: 'mdi-text-box', label: this.$i18n.tc('component.title.type.Database') },
        ]
      }
    },
    watch: {
      async globalSearchField () {
        if (!this.globalSearchField || this.globalSearchField.length < 3) {
          this.globalSearchItems = []
          return
        }
        this.isLoading && this.cancelToken.cancel('Operation canceled by the user.')
        this.cancelToken = createCancelToken()
        this.isLoading = true

        try {
          const result = await this.searchServices.search({
            q: this.globalSearchField.trim(),
            status: 'Current',
            es: 'true',
            max: 20
          }, this.cancelToken.token)

          if (result?.data?.data) {
            this.globalSearchItems = []

            result.data.data.forEach((item, idx) => {
              if (this.typeRoutes.find(({ type: atype }) => atype === item.type || atype === item.componentType)) {
                var res = item
                res.icon = this.typeRoutes.find(({ type: atype }) => atype === res.type || atype === res.componentType)?.icon
                res.iconTitle = this.typeRoutes.find(({ type: atype }) => atype === res.type || atype === res.componentType)?.label
                res.path = this.typeRoutes.find(({ type: atype }) => atype === res.type || atype === res.componentType)?.path

                this.globalSearchItems.push(res)
              } else {
                console.log('Not Adding item..')
              }
            })
          }
        } catch (exception) {

        } finally {
          this.isLoading = false
        }
      },
      globalSearchSelected () {
        if (this.globalSearchSelected.path) {
          this.globalSearchSelected && this.$router.push({ path: this.globalSearchSelected.path + this.globalSearchSelected.id }).catch(() => {})
          this.globalSearchItems = []
          this.globalSearchField = undefined
        }
      },
      $route (to, from) {
        document.title = to?.meta?.code ? this.$i18n.t(to.meta.code) : this.$i18n.t('route.home')
      },
      '$i18n.locale' (l) {
        document.title = this.$i18n.t(this.$route?.meta?.code || 'route.home')
      },
      loggedIn (val) {
        if (val) {
          this.loadGroups()
        } else {
          this.groups = []
        }
      }
    },
    mounted () {
      this.searchServices = searchServices('rest/entities')

      if (this.$i18n.t('direction') === 'rtl') {
        this.$vuetify.rtl = true
      } else {
        this.$vuetify.rtl = false
      }

      if (accountModel.loggedIn() && accountModel.userLocale()) {
        this.currentLocale = accountModel.userLocale()
      } else if (window.localStorage.getItem('locale') != undefined) {
        this.currentLocale = window.localStorage.getItem('locale')
      } else {
        baseServices.setLanguage(this.$i18n.locale)
      }

      if (window.localStorage.getItem('darkMode') != undefined) {
        this.$vuetify.theme.dark = window.localStorage.getItem('darkMode') === 'true'
      }

      this.cancelToken = createCancelToken()

      namespaceServices.fetchNamespacesList(this.cancelToken.token)
      languageServices.fetchLanguagesList(this.cancelToken.token)
    },
    methods: {
      toggleDarkMode () {
        this.$vuetify.theme.name = (this.$vuetify.theme.name === 'light' ? 'dark' : 'light')
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark
        accountModel.toggleDarkMode(this.$vuetify.theme.current)
        window.localStorage.setItem('darkMode', this.$vuetify.theme.dark)
      },
      async loadGroups () {
        this.cancelToken = createCancelToken()

        const result = await profileServices.get(this.cancelToken.token)

        if (result.status == 401) {
          this.loginExpiredMsg = true
        } else {

          this.groups = result.data.data.curatoryGroups

          if (!this.activeGroup && this.groups.length > 0) {
            this.activeGroup = this.groups[0]
          }
        }
      }
    },
  }
</script>

<style scoped>
  .toolbar-title {
    width: 300px;
  }
  .application-title {
    color: white;
  }
  .v-data-table__td > a {
    color: rgb(var(--v-theme-primary));
  }
</style>

<style lang="scss">
  @use '@/styles/settings';

  .v-field--disabled {
    pointer-events: auto !important;
    opacity: var(--v-high-emphasis-opacity);
    border-bottom: none !important;
  }

  .v-field-label {
    opacity: var(--v-high-emphasis-opacity);
    color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity)) !important;
  }

  .v-field__overlay {
    opacity: var(--v-high-emphasis-opacity);
    border-bottom: none !important;
  }

  .v-progress-linear {
    opacity: var(--v-high-emphasis-opacity);
    border-bottom: none !important;
  }

  .v-text-field .v-field--active.v-field--dirty {
    opacity: var(--v-high-emphasis-opacity);
  }

  .v-text-field .v-field--active {
    opacity: var(--v-medium-emphasis-opacity);
  }

</style>
