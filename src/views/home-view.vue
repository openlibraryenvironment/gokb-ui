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
        :selected-items="selectedReviews"
        :total-number-of-items="totalNumberOfReviews"
        :options.sync="reviewsOptions"
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
        :selected-items="selectedMaintenances"
        :total-number-of-items="totalNumberOfMaintenances"
        :options.sync="maintenancesOptions"
      />
    </gokb-section>
    <gokb-section sub-title="KBART Import">
      <gokb-table
        :items="kbartImports"
        :headers="kbartImportsHeader"
        :selected-items="selectedKbartImports"
        :total-number-of-items="totalNumberOfKbartImports"
        :options.sync="kbartImportsOptions"
      />
    </gokb-section>
  </gokb-page>
</template>

<script>
  import LoginPopup from '@/shared/popups/gokb-login-popup'

  const ROWS_PER_PAGE = 10

  const REVIEWS_HEADER = [
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
      text: 'Erstellt am',
      align: 'left',
      sortable: false,
      value: 'createdDate'
    },
    {
      text: 'Ersteller',
      align: 'left',
      sortable: false,
      value: 'creator'
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
    data () {
      return {
        showLogin: false,
        reviews: [],
        selectedReviews: [],
        totalNumberOfReviews: undefined,
        reviewsOptions: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
        },

        maintenances: [],
        selectedMaintenances: [],
        totalNumberOfMaintenances: undefined,
        maintenancesOptions: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
        },

        kbartImports: [],
        selectedKbartImports: [],
        totalNumberOfKbartImports: undefined,
        kbartImportsOptions: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
        },
      }
    },
    activated () {
      if (this.$route.query.login) {
        this.showLogin = true
      }
    },
    created () {
      this.reviewsHeader = REVIEWS_HEADER
      this.maintenancesHeader = MAINTENANCES_HEADER
      this.kbartImportsHeader = KBARTIMPORTS_HEADER

      // todo: replace dummy data with backend requests
      this.reviews = [
        { name: 'American Science Journal', type: 'Einzeltitel', createdDate: '22.01.2018 12:45', creator: 'Jochen Schweitzer' },
        { name: 'Springer Best Journals', type: 'Paket', createdDate: '11.04.2018 16:23', creator: 'Frank Thelen' },
      ]
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
