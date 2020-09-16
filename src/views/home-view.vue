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
    <gokb-section
      v-if="isContrib"
      :sub-title="$tc('component.review.label', 2)"
    >
      <template #buttons>
        <gokb-state-field
          class="mr-4"
          url="refdata/categories/ReviewRequest.StdDesc"
          :label="$t('component.review.type')"
        />
      </template>
      <gokb-table
        :items="reviews"
        :headers="reviewsHeader"
        :total-number-of-items="totalNumberOfReviews"
        :options.sync="reviewsOptions"
        :show-select="false"
        @paginate="paginateReviews"
      />
    </gokb-section>
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
  import reviewServices from '@/shared/services/review-services'
  import account from '@/shared/models/account-model'

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
    extends: baseComponent,
    data () {
      return {
        rawReviews: undefined,
        reviewsOptions: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
        },
        reviewsRaisedBy: undefined,

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
      reviews () {
        const reviews = this.rawReviews?.data?.data
        return reviews?.map(entry => {
          const id = entry?.id
          const name = entry?.componentToReview?.name
          const type = entry?.componentToReview?.type ? this.$i18n.tc('component.' + entry?.componentToReview?.type.toLowerCase() + '.label') : undefined
          const dateCreated = new Date(entry?.dateCreated).toLocaleString(this.$i18n.locale)
          const stdDesc = entry?.stdDesc?.name
          // todo: the type of the review specifies the dialog to open on click
          const link = { value: name, route: 'EDIT_TYPE_ROUTE', id: 'id' }
          return { id, name, dateCreated, type, stdDesc, link }
        })
      },
      totalNumberOfReviews () {
        return this.rawReviews?.data?._pagination?.total || 0
      },
      isContrib () {
        return this.loggedIn && account.hasRole('ROLE_CONTRIBUTOR')
      },
      localizedReviewHeaders () {
        return [
          {
            text: this.$i18n.t('component.general.name'),
            align: 'left',
            sortable: false,
            value: 'link'
          },
          {
            text: this.$i18n.t('component.title.type.label'),
            align: 'left',
            sortable: false,
            value: 'type'
          },
          {
            text: this.$i18n.t('component.general.dateCreated'),
            align: 'left',
            sortable: false,
            value: 'dateCreated'
          },
        ]
      }
    },
    watch: {
      loggedIn () {
        this.loggedIn && this.paginateReviews()
      },
      reviewsRaisedBy (value) {
        this.reviewsOptions.page = 1
        this.paginateReviews()
      }
    },
    activated () {
      this.paginateReviews()
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
    },
    methods: {
      async paginateReviews () {
        const parameters = {
          raisedBy: account.id(),
          offset: this.reviewsOptions.page ? (this.reviewsOptions.page - 1) * this.reviewsOptions.itemsPerPage : 0,
          limit: this.reviewsOptions.itemsPerPage
        }
        this.rawReviews = await this.catchError({
          promise: reviewServices.get({ parameters }, this.cancelToken.token),
          instance: this
        })
      },
    }
  }
</script>
