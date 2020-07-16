<template>
  <gokb-page
    title="Dashboard"
  >
    <gokb-section sub-title="Reviews">
      <template #buttons>
        <gokb-select-field
          class="mr-4"
          label="Typ"
        />
        <gokb-search-user-field
          v-model="reviewsRaisedBy"
          label="Ersteller"
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
    <gokb-section sub-title="Pflege">
      <template #buttons>
        <gokb-select-field
          class="mr-4"
          label="Typ"
        />
        <gokb-select-field
          label="Ersteller"
        />
      </template>
      <gokb-table
        :items="maintenances"
        :headers="maintenancesHeader"
        :total-number-of-items="totalNumberOfMaintenances"
        :options.sync="maintenancesOptions"
        :show-select="false"
      />
    </gokb-section>
    <gokb-section sub-title="KBART Import">
      <gokb-table
        :items="kbartImports"
        :headers="kbartImportsHeader"
        :total-number-of-items="totalNumberOfKbartImports"
        :options.sync="kbartImportsOptions"
        :show-select="false"
      />
    </gokb-section>
  </gokb-page>
</template>

<script>
  import baseComponent from '@/shared/components/base-component'
  import reviewServices from '@/shared/services/review-services'
  import GokbSearchUserField from '@/shared/components/simple/gokb-search-user-field'
  import { EDIT_REVIEW_ROUTE } from '@/router/route-paths'

  const ROWS_PER_PAGE = 5

  const REVIEWS_HEADER = [
    {
      text: 'Name',
      align: 'left',
      sortable: false,
      value: 'link'
    },
    // {
    //   text: 'Typ',
    //   align: 'left',
    //   sortable: false,
    //   value: 'type'
    // },
    {
      text: 'Erstellt am',
      align: 'left',
      sortable: false,
      value: 'dateCreated'
    },
    {
      text: 'Ersteller',
      align: 'left',
      sortable: false,
      value: 'raisedBy'
    },
  ]
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
  const KBARTIMPORTS_HEADER = [
    {
      text: 'Dateiname',
      align: 'left',
      sortable: false,
      value: 'filename'
    },
    {
      text: 'Importiert am',
      align: 'left',
      sortable: false,
      value: 'importDate'
    },
  ]

  export default {
    name: 'HomeView',
    components: { GokbSearchUserField },
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

        kbartImports: [],
        totalNumberOfKbartImports: 0,
        kbartImportsOptions: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
        },
      }
    },
    computed: {
      reviews () {
        const reviews = this.rawReviews?.data?.data
        return reviews?.map(entry => {
          const id = entry?.id
          const name = entry?.componentToReview?.name
          const dateCreated = entry?.dateCreated
          const raisedBy = entry?.raisedBy?.name
          const link = { value: name, route: EDIT_REVIEW_ROUTE, id: 'id' }
          return { id, name, dateCreated, raisedBy, link }
        })
      },
      totalNumberOfReviews () {
        return this.rawReviews?.data?._pagination?.total || 0
      }
    },
    watch: {
      reviewsRaisedBy (value) {
        this.reviewsOptions.page = 1
        this.paginateReviews()
      }
    },
    activated () {
      this.paginateReviews()
    },
    created () {
      this.reviewsHeader = REVIEWS_HEADER
      this.maintenancesHeader = MAINTENANCES_HEADER
      this.kbartImportsHeader = KBARTIMPORTS_HEADER

      // todo: replace dummy data with backend requests
      this.maintenances = [
        { name: 'American Science Journal', type: 'Einzeltitel', dueDate: '01.12.2018' },
        { name: 'Springer Best Journals', type: 'Paket', dueDate: '06.01.2019' },
      ]
      this.kbartImports = [
        { filename: 'American Science Journal.tsv', importDate: '01.12.2018 12:43' },
      ]
      this.totalNumberOfMaintenances = 2
      this.totalNumberOfKbartImports = 2
    },
    methods: {
      async paginateReviews () {
        const parameters = {
          raisedBy: this.reviewsRaisedBy,
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
