<template>
  <gokb-page
    v-if="!loggedIn"
    title=""
  >
    <v-alert type="info" v-if="!!systemInfo"> {{ systemInfo }}</v-alert>
    <v-card>
      <v-card-text>
        <div class="text-h4 primary--text text-center">
          {{ $i18n.t('welcome.title') }}
        </div>
        <v-img
          :src="logoPath"
          max-height="350"
          class="my-8"
          contain
        />
        <p class="primary--text">
          {{ $i18n.t('welcome.p1') }}
        </p>
        <p class="primary--text">
          {{ $i18n.t('welcome.p2') }}
        </p>
        <p class="primary--text">
          {{ $i18n.t('welcome.p3') }}
        </p>
      </v-card-text>
    </v-card>
  </gokb-page>
  <gokb-page
    v-else
    title="Dashboard"
  >
    <v-alert type="info" v-if="!!systemInfo"> {{ systemInfo }}</v-alert>
    <div v-if="isContrib && activeGroup">
      <gokb-reviews-section
        :group="activeGroup"
        :editable="true"
        :user="true"
      />
      <gokb-jobs-section
        ref="jobs"
        v-model="groupId"
        :group="activeGroup"
      />
    </div>
    <gokb-packages-section
      v-else
      default-sort-field="lastUpdated"
      default-sort-order="desc"
    />
  </gokb-page>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import account from '@/shared/models/account-model'
  import GokbReviewsSection from '@/shared/components/complex/gokb-reviews-section'

  export default {
    name: 'HomeView',
    components: {
      GokbReviewsSection
    },
    extends: BaseComponent,
    data () {
      return {
        groupId: -1,
        systemInfo: undefined,
        activeGroup: undefined,
        groups: []
      }
    },
    computed: {
      loggedIn () {
        return account.loggedIn()
      },
      isContrib () {
        return this.loggedIn && account.hasRole('ROLE_CONTRIBUTOR')
      },
      logoPath () {
        return this.$vuetify.theme.name === 'dark' ? './img/logo_dark.svg' : './img/logo_light.svg'
      }
    },
    watch: {
      loggedIn (value) {
         if (!value && !!this.$refs.jobs) {
          this.$refs.jobs.stopAutoUpdate()
        }
      },
      account: {
        handler (val) {
          if (!!val) {
            this.activeGroup = account.activeGroup()
          }
        },
        deep: true
      },
      '$i18n.locale' (l) {
        this.checkForSystemUpdate()
      }
    },
    created () {
      this.checkForSystemUpdate()

      this.activeGroup = account.activeGroup()
    },
    methods: {
      checkForSystemUpdate() {
        let local_var = 'VITE_SYSTEM_INFO_' + this.$i18n.locale.toUpperCase()

        this.systemInfo = import.meta.env[local_var]
      }
    }
  }
</script>
