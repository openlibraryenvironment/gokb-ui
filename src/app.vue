<template>
  <v-app>
    <progress-overlay />
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.mdAndUp"
      app
      fixed
      overflow
    >
      <v-list
        dense
        expand
        nav
      >
        <template v-for="(item, index) in visibleItems">
          <v-list-item
            v-if="item.text"
            :key="item.text"
            :to="item.route"
          >
            <v-list-item-action>
              <v-icon color="#F2994A">
                {{ item.icon }}
              </v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider
            v-else
            :key="index"
          />
        </template>
      </v-list>
      <template v-slot:append>
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
        <v-row class="pl-6">
          <v-col class="text-caption">
            v{{ currentVersion }}
          </v-col>
        </v-row>
        <v-row
          class="text-caption pl-6"
          dense
        >
          <v-col>
            <a
              :href="$t('main.docs.target')"
              target="_blank"
              :style="{ textDecoration: 'none', color: ($vuetify.theme.dark ? 'white' : 'black') }"
            >
              {{ $t('main.docs.label') }}
            </a>
          </v-col>
        </v-row>
        <v-row
          v-if="imprintLink"
          class="text-caption pl-6"
          dense
        >
          <v-col>
            <a
              :href="imprintLink"
              target="_blank"
              :style="{ textDecoration: 'none', color: ($vuetify.theme.dark ? 'white' : 'black') }"
            >
              {{ $t('main.legal.label') }}
            </a>
          </v-col>
        </v-row>
        <v-row
          v-if="privacyLink"
          class="text-caption pl-6 pb-6"
          dense
        >
          <v-col>
            <a
              :href="privacyLink"
              target="_blank"
              :style="{ textDecoration: 'none', color: ($vuetify.theme.dark ? 'white' : 'black') }"
            >
              {{ $t('main.privacy.label') }}
            </a>
          </v-col>
        </v-row>
      </template>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="$vuetify.breakpoint.mdAndUp"
      app
      color="#4f4f4f"
      dark
    >
      <v-toolbar-title class="toolbar-title">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <v-btn
          text
          color="#4f4f4f"
          :to="{ name: HOME_ROUTE }"
        >
          <v-icon
            color="white"
            class="mr-5"
            style="vertical-align:text-top"
          >
            home
          </v-icon>
          <span
            class="application-title text-h6"
            :title="currentVersion"
          >
            GOKb Client
          </span>
        </v-btn>
      </v-toolbar-title>
      <v-autocomplete
        v-model="globalSearchSelected"
        :items="globalSearchItems"
        :loading="globalSearchIsLoading"
        :search-input.sync="globalSearchField"
        class="hidden-sm-and-down pt-7 ma-7"
        clearable
        hide-no-data
        hide-selected
        item-text="name"
        item-value="id"
        full-width
        no-filter
        :placeholder="globalSearchPlaceholder"
        prepend-inner-icon="search"
        return-object
        solo
      >
        <template v-slot:item="{ item }">
          <v-icon
            :title="item.iconTitle"
            class="mr-2"
          >
            {{ item.icon }}
          </v-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.name" />
          </v-list-item-content>
        </template>
      </v-autocomplete>
      <v-btn
        class="mr-2"
        icon
        small
        :title="$t('btn.darkMode')"
        @click="toggleDarkMode"
      >
        <v-icon small>
          {{ $vuetify.theme.dark ? 'invert_colors_off' : 'invert_colors' }}
        </v-icon>
      </v-btn>
      <a
        icon
        class="mb-1 mr-2"
        target="_blank"
        :href="$t('main.docs.target')"
        :title="$t('main.docs.label')"
      >
        <v-icon small>
          mdi-help-circle
        </v-icon>
      </a>
      <v-select
        v-model="currentLocale"
        offset-y
        :items="locales"
        :title="$t('component.general.language.label')"
        class="pt-2 ma-2"
        style="max-width:80px"
        dense
      />
      <!-- <v-menu
        ref="actions-menu"
        :disabled="canCreate"
        offset-y
        open-on-hover
      >
        <template #activator="{ on }">
          <v-btn
            text
            v-on="on"
          >
            <v-icon>add</v-icon>
            Paket anlegen
            <v-icon>keyboard_arrow_down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <template v-for="item in visibleItems">
            <v-list-item
              v-if="item.text && item.toolbar"
              :key="item.text"
              :to="item.route"
            >
              <v-list-item-avatar>
                <v-icon color="#F2994A">
                  {{ item.icon }}
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
      </v-menu> -->
      <user-menu />
    </v-app-bar>
    <v-main>
      <v-container>
        <keep-alive :exclude="/^Edit\w*$/">
          <router-view :key="$route.fullPath" />
        </keep-alive>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  import accountModel from '@/shared/models/account-model'
  import { ROLE_ADMIN, ROLE_EDITOR } from '@/shared/models/roles'
  import ProgressOverlay from '@/shared/components/base/gokb-progress-overlay'
  import UserMenu from '@/shared/user-menu'
  import update from './mixins/update'
  import { version } from '../package.json'
  import {
    HOME_ROUTE, CREATE_PACKAGE_ROUTE, CREATE_TITLE_ROUTE,
    SEARCH_PACKAGE_ROUTE, SEARCH_REVIEW_ROUTE, SEARCH_TITLE_ROUTE,
    SEARCH_PROVIDER_ROUTE, SEARCH_USER_ROUTE, ADD_USER_ROUTE, ADD_PROVIDER_ROUTE,
    // SEARCH_MAINTENANCE_ROUTE
  } from '@/router/route-paths'
  import { createCancelToken } from '@/shared/services/http'
  import searchServices from '@/shared/services/search-services'

  // const SEARCH_COMPONENTS = [COMPONENT_TYPE_PACKAGE, COMPONENT_TYPE_JOURNAL_INSTANCE, COMPONENT_TYPE_ORG, COMPONENT_TYPE_BOOK_INSTANCE]

  export default {
    name: 'App',
    components: { UserMenu, ProgressOverlay },
    mixins: [update],
    data: () => ({
      drawer: null,
      privacyLink: process.env.VUE_APP_DP_LINK,
      imprintLink: process.env.VUE_APP_IMP_LINK,
      globalSearchSelected: undefined,
      globalSearchField: undefined,
      globalSearchItems: undefined,
      globalSearchIsLoading: false,

      dialog: false,
      locales: ['de', 'en']
    }),
    computed: {
      visibleItems () {
        const menuItems = [
          { icon: 'create_new_folder', text: this.$i18n.t('header.create.label', [this.$i18n.tc('component.package.label')]), route: CREATE_PACKAGE_ROUTE, toolbar: true, needsLogin: true, needsRole: ROLE_EDITOR },
          { icon: 'library_add', text: this.$i18n.t('header.create.label', [this.$i18n.tc('component.title.label')]), route: CREATE_TITLE_ROUTE, toolbar: true, needsLogin: true, needsRole: ROLE_EDITOR },
          { icon: 'domain', text: this.$i18n.t('header.create.label', [this.$i18n.tc('component.provider.label')]), route: ADD_PROVIDER_ROUTE, toolbar: true, needsLogin: true, needsRole: ROLE_EDITOR },
          { icon: 'people', text: this.$i18n.t('header.create.label', [this.$i18n.tc('component.user.label')]), route: ADD_USER_ROUTE, needsLogin: true, needsRole: ROLE_ADMIN },
          {},
          { icon: 'folder', text: this.$i18n.tc('component.package.label', 2), route: SEARCH_PACKAGE_ROUTE },
          { icon: 'library_books', text: this.$i18n.tc('component.title.label', 2), route: SEARCH_TITLE_ROUTE },
          { icon: 'domain', text: this.$i18n.tc('component.provider.label', 2), route: SEARCH_PROVIDER_ROUTE },
          { icon: 'rate_review', text: this.$i18n.tc('component.review.label', 2), route: SEARCH_REVIEW_ROUTE, needsLogin: true, needsRole: ROLE_EDITOR },
          // { icon: 'keyboard', text: this.$i18n.tc('component.maintenance.label', 2), route: SEARCH_MAINTENANCE_ROUTE, needsLogin: true, needsRole: ROLE_EDITOR },
          { icon: 'people', text: this.$i18n.tc('component.user.label', 2), route: SEARCH_USER_ROUTE, needsLogin: true, needsRole: ROLE_ADMIN },
        ]

        return menuItems.filter(item => (!accountModel.loggedIn() && !item.needsLogin) || (accountModel.loggedIn() && (!item.needsRole || accountModel.hasRole(item.needsRole))))
      },
      currentLocale: {
        get () {
          return this.$i18n.locale
        },
        set (locale) {
          this.$i18n.locale = locale

          if (this.$i18n.t('direction') === 'rtl') {
            this.$vuetify.rtl = true
          } else {
            this.$vuetify.rtl = false
          }

          if (accountModel.loggedIn() && locale !== accountModel.userLocale()) {
            accountModel.setLocale(locale)
          }
        }
      },
      canCreate () {
        return accountModel.hasRole('ROLE_CONTRIBUTOR')
      },
      globalSearchPlaceholder () {
        return this.$i18n.t('search.global.placeholder')
      },
      currentVersion () {
        return version
      },
      typeRoutes () {
        return [
          { type: 'Organization', path: '/provider/', icon: 'domain', label: this.$i18n.tc('component.provider.label') },
          { type: 'Org', path: '/provider/', icon: 'domain', label: this.$i18n.tc('component.provider.label') },
          { type: 'Package', path: '/package/', icon: 'folder', label: this.$i18n.tc('component.package.label') },
          { type: 'Journal', path: '/title/', icon: 'library_books', label: this.$i18n.tc('component.title.type.Journal') },
          { type: 'JournalInstance', path: '/title/', icon: 'library_books', label: this.$i18n.tc('component.title.type.Journal') },
          { type: 'Book', path: '/title/', icon: 'library_books', label: this.$i18n.tc('component.title.type.Book') },
          { type: 'BookInstance', path: '/title/', icon: 'library_books', label: this.$i18n.tc('component.title.type.Book') },
          { type: 'Database', path: '/title/', icon: 'library_books', label: this.$i18n.tc('component.title.type.Database') },
          { type: 'DatabaseInstance', path: '/title/', icon: 'library_books', label: this.$i18n.tc('component.title.type.Database') },
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
        document.title = this.$i18n.t(to.meta.code)
      },
      '$i18n.locale' (l) {
        document.title = this.$i18n.t(this.$route.meta.code)
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
      }

      if (accountModel.loggedIn()) {
        this.$vuetify.theme.dark = accountModel.darkMode()
      }
    },
    created () {
      this.HOME_ROUTE = HOME_ROUTE
    },
    methods: {
      toggleDarkMode () {
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark
        accountModel.toggleDarkMode(this.$vuetify.theme.dark)
      }
    }
  }
</script>

<style scoped>
  .toolbar-title {
    width: 300px;
  }
  .application-title {
    color: white;
  }
</style>
