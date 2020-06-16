<template>
  <gokb-page
    title="Dashboard"
  >
    <login-popup v-model="showLogin" />
    <gokb-section sub-title="Reviews">
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
        :items="reviews"
        :headers="reviewsHeader"
        :total-number-of-items="totalNumberOfReviews"
        :options.sync="reviewsOptions"
        :show-select="false"
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
  import genericEntityServices from '@/shared/services/generic-entity-services'
  import LoginPopup from '@/shared/popups/gokb-login-popup'

  const reviewServices = genericEntityServices('reviews')

  const ROWS_PER_PAGE = 10

  const REVIEWS_HEADER = [
    {
      text: 'Name',
      align: 'left',
      sortable: false,
      value: 'name'
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
    name: 'ProfileView',
    components: { LoginPopup },
    extends: baseComponent,
    data () {
      return {
        showLogin: false,
        reviews: [],
        totalNumberOfReviews: undefined,
        reviewsOptions: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
        },

        maintenances: [],
        totalNumberOfMaintenances: undefined,
        maintenancesOptions: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
        },

        kbartImports: [],
        totalNumberOfKbartImports: undefined,
        kbartImportsOptions: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
        },
      }
    },
    async activated () {
      if (this.$route.query.login) {
        this.showLogin = true
      }
      const parameters = {} // { 'status.name': 'Open', _sort: 'dateCreated', _order: 'desc' }
      const { data: { data: reviews } } = await this.catchError({
        promise: reviewServices.get({ parameters }, this.cancelToken.token),
        instance: this
      })
      // name type createdDate creator
      this.reviews = reviews.map(entry => {
        const name = entry?.componentToReview?.name
        const dateCreated = entry?.dateCreated
        const raisedBy = entry?.raisedBy?.name
        return { name, dateCreated, raisedBy }
      })
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
      this.totalNumberOfReviews = 2
      this.totalNumberOfMaintenances = 2
      this.totalNumberOfKbartImports = 2
    }
  }
</script>
