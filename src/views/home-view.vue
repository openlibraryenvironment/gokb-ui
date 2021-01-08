<template>
  <gokb-page
    v-if="!loggedIn"
    title=""
  >
    <v-card>
      <v-card-text>
        <div class="display-1 primary--text">
          {{ $i18n.t('welcome.title') }}
        </div>
        <p class="primary--text">
          {{ $i18n.t('welcome.p1') }}
        </p>
      </v-card-text>
    </v-card>
  </gokb-page>
  <gokb-page
    v-else
    title="Dashboard"
  >
    <div v-if="isContrib">
      <template v-for="group in groups">
        <v-row :key="group.id">
          <v-col>
            <div class="text-h4 ml-3  ">
              {{ group.name }}
            </div>
            <gokb-reviews-section
              :key="group.id"
              :group="group.id"
              :user="true"
            />
          </v-col>
        </v-row>
      </template>
    </div>
    <gokb-jobs-section
      v-model="groupId"
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
        groupId: -1
      }
    },
    computed: {
      loggedIn () {
        return account.loggedIn()
      },
      isContrib () {
        return this.loggedIn && account.hasRole('ROLE_CONTRIBUTOR')
      }
    },
    watch: {
      loggedIn (value) {
        if (value) {
          this.loadGroups()
        } else {
          this.groups = []
        }
      }
    },
    async created () {
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
          promise: profileServices.getProfile(this.cancelToken.token),
          instance: this
        })
        this.groups = curatoryGroups
      }
    }
  }
</script>
