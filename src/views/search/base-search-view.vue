<template>
  <gokb-page
    :title="title"
    @submit="search"
  >
    <gokb-section sub-title="Suche">
      <template v-for="(row, rowIndex) of searchInputFields">
        <v-layout :key="`${title}_${rowIndex}`">
          <template v-for="(column, columnIndex) of row">
            <component
              :is="column.type"
              :key="`${title}_${rowIndex}_${columnIndex}`"
              v-model="column.model"
              clearable
              v-bind="column.properties"
            />
            <v-spacer
              v-if="columnIndex !== row.length - 1"
              :key="`${title}_${rowIndex}_${columnIndex}_spacer`"
            />
          </template>
        </v-layout>
      </template>
      <v-layout>
        <v-spacer />
        <v-btn @click.stop="resetSearch">
          Zurücksetzen
        </v-btn>
        <v-btn type="submit">
          Suchen
        </v-btn>
      </v-layout>
    </gokb-section>
    <gokb-section sub-title="Ergebnisse">
      <template #buttons>
        <gokb-button @click.native="showAddNewCuratoryGroup">
          Hinzufügen
        </gokb-button>
        <gokb-button @click.native="deleteSelectedCuratoryGroups">
          Deaktivieren
        </gokb-button>
      </template>
      <gokb-table
        :headers="resultHeaders"
        :items="resultItems"
      />
    </gokb-section>
  </gokb-page>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import { VSelect, VTextField } from 'vuetify/lib'
  import GokbPage from '@/shared/components/complex/page-component'
  import GokbTable from '@/shared/components/complex/table-component'
  import GokbSection from '@/shared/components/complex/section-component'
  import GokbButton from '@/shared/components/base/button-component'
  import GokbTextField from '@/shared/components/base/text-field-component'
  // import searchServices from '@/shared/services/search-services'

  const ROWS_PER_PAGE = 10

  export default {
    name: 'BaseSearch',
    components: {
      VSelect,
      VTextField,
      GokbTextField,
      GokbPage,
      GokbSection,
      GokbTable,
      GokbButton,
    },
    extends: BaseComponent,
    data () {
      return {
        title: undefined,
        component: undefined,
        searchInputFields: undefined,

        resultItems: undefined,
        resultPagination: {
          descending: false,
          page: undefined,
          rowsPerPage: ROWS_PER_PAGE,
          sortBy: undefined,
          totalItems: undefined,
        },
        resultHeaders: undefined,
      }
    },
    computed: {
      pages () {
        if (!this.resultPagination.totalItems) {
          return 0
        }
        return Math.ceil(this.resultPagination.totalItems / this.resultPagination.rowsPerPage)
      }
    },
    watch: {
      'resultPagination.page': function () {
        this.search({ page: this.resultPagination.page })
      }
    },
    methods: {
      resetSearch () {
        this.$refs.searchForm.reset()
      },
      async search ({ page = undefined }) {
        // const searchParameters = this.searchInputFields
        //   .flat()
        //   .map(field => ([field.name, field.model]))
        //   .filter(([name, value]) => name && value)
        //   .reduce((r, [name, value]) => {
        //     r[name] = value
        //     return r
        //   }, {})

        // const result = await searchServices.search({
        //   ...searchParameters,
        //   qbe: this.component,
        //   max: ROWS_PER_PAGE,
        //   offset: page ? (page - 1) * this.resultPagination.rowsPerPage : 0
        // }, this.cancelToken.token)
        // console.log(result)
        // if (!page) {
        //   this.resultPagination.totalItems = result.count
        //   this.resultPagination.page = 1
        // }
        // this.resultItems = result.records
      },
    }
  }
</script>
