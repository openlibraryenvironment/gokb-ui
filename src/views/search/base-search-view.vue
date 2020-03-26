<template>
  <gokb-page
    :title="title"
    @submit="search"
  >
    <template v-if="error">
      <error-component :value="error" />
    </template>
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
          v-for="button of resultActionButtons"
          :key="button.label"
          class="ml-4"
          :icon-id="button.icon"
          :to="button.route"
          :disabled="isButtonDisabled(button.disabled)"
          @click.native="executeAction(button.action)"
        >
          {{ button.label }}
        </gokb-button>
      </template>
      <gokb-table
        :headers="resultHeaders"
        :items="resultItems"
        :options.sync="resultOptions"
        :total-number-of-items="totalNumberOfItems"
        :selected-items.sync="selectedItems"
        @paginate="resultPaginate"
        @delete-item="deleteItem"
      />
    </gokb-section>
  </gokb-page>
</template>

<script>
  import BaseComponent from '@/shared/base-component'
  import ErrorComponent from '@/shared/components/complex/error-component'
  import searchServices from '@/shared/services/search-services'

  const ROWS_PER_PAGE = 10

  export default {
    name: 'BaseSearch',
    components: { ErrorComponent },
    extends: BaseComponent,
    data () {
      return {
        title: undefined,
        component: undefined,
        searchInputFields: undefined,
        resultActionButtons: undefined,

        resultHeaders: [],
        resultItems: [],
        selectedItems: [],
        resultOptions: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
        },
        totalNumberOfItems: -1,
      }
    },
    watch: {
      'resultOptions.page': function () {
        this.search({ page: this.resultOptions.page })
      }
    },
    mounted () {
      this.searchServices = searchServices(this.searchServicesResourceUrl)
    },
    methods: {
      resetSearch () {
        this.searchInputFields
          .flat()
          .forEach(field => { field.model = undefined })
      },
      resultPaginate (page) {
        this.search({ page })
      },
      async deleteItem ({ deleteUrl }) {
        await this._executeDeleteItemService()
        this.resultPaginate(this.resultOptions.page)
      },
      _executeDeleteItemService (deleteUrl) {
        return this.catchError({
          promise: this.searchServices.delete(deleteUrl, this.cancelToken.token),
          instance: this
        })
      },
      async search ({ page } = { page: undefined }) {
        const searchParameters = this.searchInputFields
          .flat()
          .map(field => ([field.name, field.model]))
          .filter(([name, value]) => name && value)
          .reduce((result, [name, value]) => {
            result[name] = value
            return result
          }, {})
        // console.log(searchParameters)
        const result = await this.catchError({
          promise: this.searchServices.search({
            ...searchParameters,
            offset: page ? (page - 1) * this.resultOptions.itemsPerPage : 0,
            limit: this.resultOptions.itemsPerPage
          }, this.cancelToken.token),
          instance: this
        })
        if (result) {
          const { data: { data, _pagination } } = result
          // console.log(data, _pagination, _links)
          if (!page) {
            this.resultOptions.page = 1
          }
          this.totalNumberOfItems = _pagination.total
          this.resultItems = this._transformForTable(data)
        }
      },
      executeAction (actionMethodName) {
        this[actionMethodName]()
      },
      isButtonDisabled (attributeName) {
        return this[attributeName]
      }
    }
  }
</script>
