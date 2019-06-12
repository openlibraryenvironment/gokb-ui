<template>
  <v-app>
    <progress-overlay/>
    <v-navigation-drawer
      fixed
      :clipped="$vuetify.breakpoint.mdAndUp"
      app
      v-model="drawer"
    >
      <v-list dense>
        <template v-for="(item, index) in items">
          <v-list-tile v-if="item.text" :to="item.route" :key="item.text">
            <v-list-tile-action>
              <v-icon color="#F2994A">{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider v-else :key="index"></v-divider>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      color="#4f4f4f"
      dark
      app
      :clipped-left="$vuetify.breakpoint.mdAndUp"
      fixed
    >
      <v-toolbar-title style="width: 300px" class="">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">GOKb Client</span>
      </v-toolbar-title>
      <v-autocomplete
        v-model="globalSearchSelected"
        :items="globalSearchItems"
        :loading="globalSearchIsLoading"
        :search-input.sync="globalSearchField"
        hide-no-data
        hide-selected
        clearable
        no-filter
        item-text="name"
        item-value="API"
        placeholder="Titel, Pakete, Verlage"
        return-object
        flat
        solo-inverted
        prepend-inner-icon="search"
        class="hidden-sm-and-down"
      ></v-autocomplete>
      <v-spacer></v-spacer>

      <v-menu offset-y open-on-hover>
        <span slot="activator">
          <v-btn color="#F2994A">
            <v-icon>add</v-icon>
            Paket anlegen
            <v-icon>keyboard_arrow_down</v-icon>
          </v-btn>
        </span>
        <v-list>
          <template v-for="(item) in items">
            <v-list-tile v-if="item.text && item.toolbar" :to="item.route" :key="item.text">
              <v-list-tile-avatar>
                <v-icon color="#F2994A">{{ item.icon }}</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile>
          </template>
        </v-list>
      </v-menu>

      <user-menu></user-menu>
    </v-toolbar>
    <v-content>
      <router-view :key="$route.fullPath"/>
    </v-content>
  </v-app>
</template>

<script>
import account from '@/shared/models/account'
import ProgressOverlay from '@/shared/components/base/ProgressOverlayComponent'
import UserMenu from '@/shared/components/complex/UserMenu'
import { routeTo } from '@/router'
import { createCancelToken } from '@/shared/services/http'
import {
  COMPONENT_TYPE_PACKAGE,
  COMPONENT_TYPE_JOURNAL_INSTANCE,
  COMPONENT_TYPE_BOOK_INSTANCE,
  COMPONENT_TYPE_ORG
} from '@/shared/models/component-types'
import searchServices from '@/shared/services/search-services'

const SEARCH_COMPONENTS = [COMPONENT_TYPE_PACKAGE, COMPONENT_TYPE_JOURNAL_INSTANCE, COMPONENT_TYPE_ORG, COMPONENT_TYPE_BOOK_INSTANCE]

export default {
  name: 'App',
  components: { UserMenu, ProgressOverlay },
  data: () => ({
    drawer: null,
    globalSearchSelected: undefined,
    globalSearchField: undefined,
    globalSearchItems: undefined,
    globalSearchIsLoading: false,

    dialog: false,
    items: [
      { icon: 'create_new_folder', text: 'Paket anlegen', route: 'createPackage', toolbar: true },
      { icon: 'library_add', text: 'Einzeltitel anlegen', route: 'createTitle', toolbar: true },
      { icon: 'folder_special', text: 'KBART Import', route: 'KBARTImport', toolbar: true },
      {},
      { icon: 'folder', text: 'Pakete', route: 'searchPackage' },
      { icon: 'library_books', text: 'Einzeltitel', route: 'searchTitle' },
      { icon: 'rate_review', text: 'Reviews', route: 'searchReview' },
      { icon: 'keyboard', text: 'Pflege', route: 'searchMaintenance' },
      { icon: 'people', text: 'Benutzer', route: 'searchUser' },
    ]
  }),
  computed: {
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
      const result = await searchServices.globalSearch({ searchPattern: this.globalSearchField, max: 100 }, this.cancelToken.token)
      console.log(result.records)
      this.globalSearchItems = result.records
        .filter(e => SEARCH_COMPONENTS.includes(e.componentType))
      this.isLoading = false
    },
    globalSearchSelected () {
      routeTo(this.globalSearchSelected.componentType, this.globalSearchSelected.id)
    },
  },
  created () {
    account.initialize()
  }
}
</script>

<style>
  .v-toolbar__content {
    padding: 0 0 8px 0;
  }
</style>
