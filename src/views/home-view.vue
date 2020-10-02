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
    <gokb-reviews-section
      v-if="isContrib"
      :user="true"
    />
    <!-- <gokb-section
      sub-title="Pflege"
    >
      <template #buttons>
        <gokb-select-field
          class="mr-4"
          label="Typ"
        />
        <gokb-date-field
          label="Fällig am"
        />
      </template>
      <gokb-table
        :items="maintenances"
        :headers="maintenancesHeader"
        :total-number-of-items="totalNumberOfMaintenances"
        :options.sync="maintenancesOptions"
        :show-select="false"
      />
    </gokb-section> -->
    <gokb-jobs-section
      v-model="groupId"
    />
  </gokb-page>
</template>

<script>
  import baseComponent from '@/shared/components/base-component'
  import account from '@/shared/models/account-model'
  import GokbReviewsSection from '@/shared/components/complex/gokb-reviews-section'

  const ROWS_PER_PAGE = 5

  const MAINTENANCES_HEADER = [
    {
      text: 'Name',
      align: 'left',
      sortable: false,
      value: 'name'
    },
    {
      text: 'Typ',
      align: 'left',
      sortable: false,
      value: 'type'
    },
    {
      text: 'Fällig am',
      align: 'left',
      sortable: false,
      value: 'dueDate'
    },
  ]

  export default {
    name: 'HomeView',
    components: {
      GokbReviewsSection
    },
    extends: baseComponent,
    data () {
      return {
        maintenances: [],
        totalNumberOfMaintenances: 0,
        maintenancesOptions: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
        },
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
    created () {
      this.reviewsHeader = this.localizedReviewHeaders
      this.maintenancesHeader = MAINTENANCES_HEADER

      // todo: replace dummy data with backend requests
      this.maintenances = [
        { name: 'American Science Journal', type: 'Einzeltitel', dueDate: '01.12.2018' },
        { name: 'Springer Best Journals', type: 'Paket', dueDate: '06.01.2019' },
      ]
      this.totalNumberOfMaintenances = 2
    }
  }
</script>
