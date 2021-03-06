<template>
  <gokb-page
    :title="title"
    @submit="search"
  >
    <gokb-error-component :value="error" />
    <gokb-section :sub-title="searchHeader">
      <template v-for="(row, rowIndex) of searchInputFields">
        <v-row :key="`${title}_${rowIndex}`">
          <v-col
            v-for="(column, columnIndex) of row"
            :key="`${rowIndex}_${columnIndex}`"
            :md="column.md || 4"
          >
            <component
              :is="column.type"
              :key="`${title}_${rowIndex}_${columnIndex}`"
              v-model="searchFilters[column.value]"
              :items="column.items"
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
      <v-row justify="end">
        <v-spacer />
        <v-spacer />
        <v-col
          style="text-align:right;"
          md="4"
        >
          <gokb-button
            class="mr-4 mb-4"
            @click="resetSearch"
          >
            {{ $i18n.t('btn.reset') }}
          </gokb-button>
          <gokb-button
            default
            class="mr-4 mb-4"
          >
            {{ $i18n.t('btn.search') }}
          </gokb-button>
        </v-col>
      </v-row>
    </gokb-section>
    <gokb-section
      :sub-title="resultHeader"
      :items-total="totalNumberOfItems"
    >
      <template #buttons>
        <template v-for="button of resultActionButtons">
          <component
            :is="button.component"
            v-if="button.component"
            :key="button.component.name"
            v-bind="button.properties"
          />
          <gokb-button
            v-else-if="!isReadonly"
            :key="button.label"
            class="ms-4"
            :icon-id="button.icon"
            :to="button.route"
            :disabled="isButtonDisabled(button.disabled)"
            @click="executeAction(button.action)"
          >
            {{ button.label }}
          </gokb-button>
        </template>
      </template>
      <gokb-confirmation-popup
        v-model="confirmationPopUpVisible"
        :message="messageToConfirm"
        @confirmed="executeAction(actionToConfirm, parameterToConfirm)"
      />
      <gokb-table
        :headers="resultHeaders"
        :items="resultItems"
        :editable="!isReadonly"
        :hide-select="!showSelect"
        :options.sync="resultOptions"
        :total-number-of-items="totalNumberOfItems"
        :selected-items="selectedItems"
        @selected-items="selectedItems = $event"
        @paginate="resultPaginate"
        @delete-item="confirmDeleteItem"
        @retire-item="confirmRetireItem"
      />
    </gokb-section>
  </gokb-page>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import GokbErrorComponent from '@/shared/components/complex/gokb-error-component'
  import searchServices from '@/shared/services/search-services'
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import selection from '@/shared/models/selection'
  import accountModel from '@/shared/models/account-model'

  const ROWS_PER_PAGE = 10

  export default {
    name: 'BaseSearch',
    components: { GokbErrorComponent, GokbConfirmationPopup },
    extends: BaseComponent,
    data () {
      return {
        resultItems: [],
        selectedItems: [],
        resultOptions: {
          page: 1,
          sortBy: ['link'],
          desc: [false],
          itemsPerPage: ROWS_PER_PAGE
        },
        totalNumberOfItems: -1,
        confirmationPopUpVisible: false,
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        messageToConfirm: undefined
      }
    },
    computed: {
      isNothingSelected () {
        return this.selectedItems.length === 0
      },
      searchHeader () {
        return this.$i18n.t('header.search')
      },
      resultHeader () {
        return this.$i18n.t('header.results')
      },
      isReadonly () {
        return !accountModel.loggedIn() || !accountModel.hasRole('ROLE_CONTRIBUTOR')
      },
      showSelect () {
        return false
      }
    },
    watch: {
      selectedItems (value) {
        selection.set(value)
      },
      '$i18n.locale' (loc) {
        this.search()
      }
    },
    mounted () {
      this.searchServices = searchServices(this.searchServicesUrl)
    },
    methods: {
      resetSearch () {
        Object.keys(this.searchFilters).forEach(filter => {
          if (Array.isArray(this.searchFilters[filter])) {
            this.searchFilters[filter] = []
          } else {
            this.searchFilters[filter] = undefined
          }
        })
        this.resultItems = []
        this.totalNumberOfItems = 0
      },
      resultPaginate (options) {
        const page = options.page
        if (options.sortBy) {
          this.resultOptions.sortBy = options.sortBy
        }

        if (this.sortMappings?.link && this.resultOptions.sortBy.includes('link')) {
          this.resultOptions.sortBy = [this.sortMappings.link]
        } else if (this.sortMappings?.linkTwo && this.resultOptions.sortBy.includes('linkTwo')) {
          this.resultOptions.sortBy = [this.sortMappings.linkTwo]
        }

        if (options.desc) {
          this.resultOptions.desc = options.desc
        }
        this.search({ page })
      },
      confirmDeleteItem ({ deleteUrl }) {
        this.actionToConfirm = 'deleteItem'
        this.messageToConfirm = { text: 'popups.confirm.delete.list', vars: [this.selectedItems.length, this.$i18n.tc('component.label', this.selectedItems.length)] }
        this.parameterToConfirm = deleteUrl
        this.confirmationPopUpVisible = true
      },
      async deleteItem (deleteUrl) {
        await this._executeDeleteItemService(deleteUrl)
        this.resultPaginate(this.resultOptions.page)
      },
      confirmRetireItem ({ retireUrl }) {
        this.actionToConfirm = 'retireItem'
        this.messageToConfirm = { text: 'popups.confirm.retire.list', vars: [this.selectedItems.length, this.$i18n.tc('component.label', this.selectedItems.length)] }
        this.parameterToConfirm = retireUrl
        this.confirmationPopUpVisible = true
      },
      async retireItem (retireUrl) {
        await this._executeRetireItemService(retireUrl)
        this.resultPaginate(this.resultOptions.page)
      },
      _executeDeleteItemService (deleteUrl) {
        return this.catchError({
          promise: this.searchServices.delete(deleteUrl, this.cancelToken.token),
          instance: this
        })
      },
      _executeRetireItemService (retireUrl) {
        return this.catchError({
          promise: this.searchServices.retire(retireUrl, this.cancelToken.token),
          instance: this
        })
      },
      async search ({ page } = { page: undefined }) {
        // console.log(this.searchInputFields)
        const searchParameters = this.searchInputFields
          .flat()
          .map(field => ([field.name, field.value]))
          .filter(([name, value]) => name && this.searchFilters[value] !== undefined && this.searchFilters[value] !== null)
          .reduce((result, [name, value]) => {
            result[name] = ((typeof this.searchFilters[value] === 'string' || typeof this.searchFilters[value] === 'number' || Array.isArray(this.searchFilters[value])) ? this.searchFilters[value] : this.searchFilters[value].id)
            return result
          }, {})
        // console.log(this.searchInputFields, this.searchParameters)
        const sort = this.resultOptions.sortBy?.length > 0 ? (this.linkSearchParameterValues[this.resultOptions.sortBy[0]] || this.resultOptions.sortBy[0]) : undefined
        const desc = this.resultOptions.desc[0] ? 'desc' : 'asc'
        const result = await this.catchError({
          promise: this.searchServices.search({
            ...searchParameters,
            ...((sort && { _sort: sort }) || {}),
            ...({ _order: desc }),
            ...((this.searchServiceIncludes && { _include: this.searchServiceIncludes }) || {}),
            ...((this.searchServiceEmbeds && { _embed: this.searchServiceEmbeds }) || {}),
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
          this.selectedItems = []
          this.totalNumberOfItems = _pagination.total
          this.resultItems = this._transformForTable(data)
        }
      },
      executeAction (actionMethodName, actionMethodParameter) {
        actionMethodName && this[actionMethodName](actionMethodParameter)
      },
      isButtonDisabled (attributeName) {
        return this[attributeName]
      }
    }
  }
</script>
