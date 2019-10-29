<template>
  <gokb-page
    title="Dashboard"
  >
    <gokb-section sub-title="Reviews">
      <template #buttons>
        <gokb-select-field
          class="mr-4"
          placeholder="Typ"
        />
        <gokb-select-field
          placeholder="Ersteller"
        />
      </template>
      <gokb-table
        :show-select="false"
        :headers="reviewsHeader"
        :items="reviews"
      />
    </gokb-section>
    <gokb-section sub-title="Pflege">
      <template #buttons>
        <gokb-select-field
          class="mr-4"
          placeholder="Typ"
        />
        <gokb-select-field
          placeholder="Ersteller"
        />
      </template>
      <gokb-table
        :show-select="false"
        :headers="maintenancesHeader"
        :items="maintenances"
      />
    </gokb-section>
    <gokb-section sub-title="KBART Import">
      <gokb-table
        :show-select="false"
        :headers="kbartImportsHeader"
        :items="kbartImports"
      />
    </gokb-section>
  </gokb-page>
</template>

<script>
  import GokbPage from '@/shared/components/complex/page-component'
  import GokbTable from '@/shared/components/complex/table-component'
  import GokbSection from '@/shared/components/complex/section-component'
  import GokbSelectField from '@/shared/components/base/select-field-component'

  export default {
    name: 'ProfileView',
    components: {
      GokbPage,
      GokbSection,
      GokbTable,
      GokbSelectField,
    },
    data () {
      return {
        reviewsHeader: [
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
        ],
        maintenancesHeader: [
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
        ],
        kbartImportsHeader: [
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
        ],
        reviews: [
          { name: 'American Science Journal', type: 'Einzeltitel', createdDate: '22.01.2018 12:45', creator: 'Jochen Schweitzer' },
          { name: 'Springer Best Journals', type: 'Paket', createdDate: '11.04.2018 16:23', creator: 'Frank Thelen' },
        ],
        maintenances: [
          { name: 'American Science Journal', type: 'Einzeltitel', dueDate: '01.12.2018' },
          { name: 'Springer Best Journals', type: 'Paket', dueDate: '06.01.2019' },
        ],
        kbartImports: [
          { filename: 'American Science Journal.tsv', importDate: '01.12.2018 12:43' },
        ],
      }
    }
  }
</script>
