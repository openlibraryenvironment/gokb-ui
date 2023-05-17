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
          src="img/logo.png"
          max-height="150"
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
  import baseComponent from '@/shared/components/base-component'
  import account from '@/shared/models/account-model'
  import GokbReviewsSection from '@/shared/components/complex/gokb-reviews-section'
  import profileServices from '@/shared/services/profile-services'

  export default {
    name: 'HomeView',
    components: {
      GokbReviewsSection
    },
    extends: baseComponent,
    data () {
      return {
        groups: [],
        groupId: -1,
        systemInfo: undefined
      }
    },
    computed: {
      loggedIn () {
        return account.loggedIn()
      },
      isContrib () {
        return this.loggedIn && account.hasRole('ROLE_CONTRIBUTOR')
      },
      activeGroup () {
        return account.activeGroup()
      }
    },
    watch: {
      loggedIn (value) {
        if (value) {
          this.loadGroups()
        } else {
          this.groups = []
        }
      },
      '$i18n.locale' (l) {
        this.checkForSystemUpdate()
      }
    },
    async created () {
      this.checkForSystemUpdate()

      if (this.loggedIn) {
        this.loadGroups()
      }
    },
    methods: {
      async loadGroups () {
        const {
          data: {
            data: {
              curatoryGroups
            }
          }
        } = await this.catchError({
          promise: profileServices.get(this.cancelToken.token),
          instance: this
        })
        this.groups = curatoryGroups
      },
      checkForSystemUpdate() {
        let local_var = 'VUE_APP_SYSTEM_INFO_' + this.$i18n.locale.toUpperCase()

        this.systemInfo = process.env[local_var]
      }
    }
  }
</script>
