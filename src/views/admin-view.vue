<template>
  <gokb-page
    v-if="isAdmin"
    :title="$t('route.admin.label')"
  >
    <v-tabs
      v-model="tab"
      class="mx-4"
    >
      <v-tab
        value="jobs"
        :active-class="tabClass"
      >
        Jobs
      </v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item
        value="jobs"
        class="mt-4"
      >
        <gokb-jobs-section
          ref="jobs"
          :auto-refresh="false"
          show-admin-jobs
          default-expand
        />
      </v-window-item>
    </v-window>
  </gokb-page>
  <gokb-no-access-field v-else />
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import account from '@/shared/models/account-model'
  import GokbJobsSection from '@/shared/components/complex/gokb-jobs-section'

  export default {
    name: 'AdminView',
    components: {
      GokbJobsSection
    },
    extends: BaseComponent,
    data () {
      return {
        tab: null
      }
    },
    computed: {
      loggedIn () {
        return account.loggedIn()
      },
      isAdmin () {
        return this.loggedIn && account.hasRole('ROLE_ADMIN')
      },
      isSuperUser () {
        return this.loggedIn && account.hasRole('ROLE_SUPERUSER')
      },
      activeGroup () {
        return account.activeGroup()
      },
      tabClass () {
        return this.$vuetify.theme.dark ? 'tab-dark' : ''
      },
    }
  }
</script>
