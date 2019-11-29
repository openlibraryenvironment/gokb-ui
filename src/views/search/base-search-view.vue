<template>
  <gokb-page
    :title="title"
    @submit="search"
  >
    <gokb-section sub-title="Suche">
      <template v-for="(row, rowIndex) of searchInputFields">
        <v-row :key="`${title}_${rowIndex}`">
          <v-col
            v-for="(column, columnIndex) of row"
            :key="`${rowIndex}_${columnIndex}`"
            md="4"
          >
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
          </v-col>
        </v-row>
      </template>
      <v-row justify-md="end">
        <v-spacer />
        <v-col md="4">
          <gokb-button
            class="mr-4"
            @click.native.stop="resetSearch"
          >
            Zurücksetzen
          </gokb-button>
          <gokb-button
            default
          >
            Suchen
          </gokb-button>
        </v-col>
      </v-row>
    </gokb-section>
    <gokb-section sub-title="Ergebnisse">
      <template #buttons>
        <gokb-button
          v-for="actionButton of resultActionButtons"
          :key="actionButton.label"
          :icon-id="actionButton.icon"
          :to="actionButton.route"
          class="ml-4"
        >
          {{ actionButton.label }}
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
  import BaseComponent from '@/shared/base-component'
  // import searchServices from '@/shared/services/search-services'

  const ROWS_PER_PAGE = 10

  export default {
    name: 'BaseSearch',
    components: {
    },
    extends: BaseComponent,
    data () {
      return {
        title: undefined,
        component: undefined,
        searchInputFields: undefined,

        resultActionButtons: undefined,
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
        this.searchInputFields
          .flat()
          .forEach(field => { field.model = undefined })
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
