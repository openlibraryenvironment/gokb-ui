<template>
  <gokb-page
    v-if="accessible"
    :title="title"
    @submit="search"
  >
    <gokb-error-component :value="error" />
    <v-snackbars ref="snackbars" :objects.sync="eventMessages"></v-snackbars>
    <gokb-section :sub-title="searchHeader">
      <template v-for="(row, rowIndex) of searchInputFields">
        <v-row
          :key="`${title}_${rowIndex}`"
          dense
        >
          <v-col
            v-for="(column, columnIndex) of row"
            :key="`${rowIndex}_${columnIndex}`"
            :md="column.md || 4"
          >
            <component
              :is="column.type"
              :key="`${title}_${rowIndex}_${columnIndex}`"
              :ref="column.value"
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
      <v-row
        justify="end"
        dense
      >
        <v-spacer />
        <v-spacer />
        <v-col
          style="text-align:right;"
          md="4"
        >
          <gokb-button
            class="mr-4 mb-4"
            color="secondary"
            @click="resetSearch"
          >
            {{ $i18n.t('btn.reset') }}
          </gokb-button>
          <gokb-button
            default
            color="accent"
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
            :loading="button.loading"
            :to="button.route"
            color="primary"
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
        :show-loading="isLoading"
        :selected-items="selectedItems"
        @selected-items="selectedItems = $event"
        @paginate="resultPaginate"
        @delete-item="confirmDeleteItem"
        @retire-item="confirmRetireItem"
        @edit="editItem"
      />
    </gokb-section>
  </gokb-page>
  <gokb-no-access-field v-else />
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import GokbErrorComponent from '@/shared/components/complex/gokb-error-component'
  import searchServices from '@/shared/services/search-services'
  import exportServices from '@/shared/services/export-services'
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import selection from '@/shared/models/selection'
  import accountModel from '@/shared/models/account-model'
  import VSnackbars from 'v-snackbars'

  const ROWS_PER_PAGE = 10

  export default {
    name: 'BaseSearch',
    components: { GokbErrorComponent, GokbConfirmationPopup, VSnackbars },
    extends: BaseComponent,
    data () {
      return {
        resultItems: [],
        selectedItems: [],
        staticParams: {},
        resultOptions: {
          page: 1,
          sortBy: [],
          desc: false,
          itemsPerPage: ROWS_PER_PAGE
        },
        requestOptions: {
          page: 1,
          sortBy: [],
          desc: false,
          itemsPerPage: ROWS_PER_PAGE
        },
        totalNumberOfItems: -1,
        confirmationPopUpVisible: false,
        initVals: {},
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        messageToConfirm: undefined,
        accessible: true,
        loading: false,
        exportLoading: false,
        eventMessages: []
      }
    },
    computed: {
      isNothingSelected () {
        return this.selectedItems.length === 0
      },
      isSearchExportDisabled () {
        return this.totalNumberOfItems < 1 || this.totalNumberOfItems > 10000
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
      },
      isLoading () {
        return this.loading
      },
      exportHeaders () {
        return [
          {
            text: 'ID',
            value: 'id'
          },
          {
            text: this.$i18n.t('component.general.name'),
            value: 'name'
          },
          {
            text: this.$i18n.t('component.general.status.label'),
            value: 'status'
          },
          {
            text: this.$i18n.t('component.general.lastUpdated'),
            value: 'lastUpdated'
          }
        ]
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
            if (this.initVals[filter]) {
              this.searchFilters[filter] = this.initVals[filter]
            } else {
              this.searchFilters[filter] = []
            }
          } else {
            if (this.initVals[filter] === 'setInit') {
              this.$refs[filter][0].setInit()
            } else if (this.initVals[filter]) {
              this.searchFilters[filter] = this.initVals[filter]
            } else {
              if (this.$refs[filter] && this.$refs[filter].length > 0 && typeof this.$refs[filter][0].clear !== 'undefined' && typeof this.$refs[filter][0].clear === 'function') {
                this.$refs[filter][0].clear()
              } else {
                this.searchFilters[filter] = undefined
              }
            }
          }
        })
        this.resultItems = []
        this.totalNumberOfItems = 0
      },
      resultPaginate (options) {
        const page = options.page

        if (typeof options.sortBy === 'Array' && options.sortBy.length > 0 && options.sortBy !== this.requestOptions.sortBy) {
          this.requestOptions.sortBy = options.sortBy
          this.resultOptions.sortBy = options.sortBy
        } else if (typeof options.sortBy === 'string') {
          this.requestOptions.sortBy = [options.sortBy]
          this.resultOptions.sortBy = [options.sortBy]
        }

        if (options.sortBy && this.sortMappings?.link && this.requestOptions.sortBy.includes('link')) {
          this.requestOptions.sortBy = [this.sortMappings.link]
        } else if (options.sortBy && this.sortMappings?.linkTwo && this.requestOptions.sortBy.includes('linkTwo')) {
          this.requestOptions.sortBy = [this.sortMappings.linkTwo]
        }

        this.requestOptions.page = page

        if (typeof options.desc === 'boolean' && options.desc != this.requestOptions.desc) {
          this.requestOptions.desc = options.desc
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
      async _deleteSelectedItems () {
        await Promise.all(this.selectedItems.map(({ deleteUrl }) =>
          this._executeDeleteItemService(deleteUrl)
        ))
        this.resultPaginate(this.resultOptions.page)
      },
      confirmRetireItem ({ updateUrl }) {
        this.actionToConfirm = 'retireItem'
        this.messageToConfirm = { text: 'popups.confirm.retire.list', vars: [this.selectedItems.length, this.$i18n.tc('component.label', this.selectedItems.length)] }
        this.parameterToConfirm = updateUrl
        this.confirmationPopUpVisible = true
      },
      async retireItem (updateUrl) {
        await this._executeRetireItemService(updateUrl)
        this.resultPaginate(this.resultOptions.page)
      },
      async _retireSelectedItems () {
        await Promise.all(this.selectedItems.map(({ updateUrl }) =>
          this._executeRetireItemService(updateUrl)
        ))
        this.resultPaginate(this.resultOptions.page)
      },
      _executeDeleteItemService (deleteUrl) {
        return this.catchError({
          promise: this.searchServices.delete(deleteUrl, this.cancelToken.token),
          instance: this
        })
      },
      _executeRetireItemService (updateUrl) {
        return this.catchError({
          promise: this.searchServices.retire(updateUrl, this.cancelToken.token),
          instance: this
        })
      },
      _searchParameters (searchInputFields) {
        return searchInputFields
          .flat()
          .map(field => ([field.name, field.value]))
          .filter(([name, value]) => name && this.searchFilters[value] !== undefined && this.searchFilters[value] !== null)
          .reduce((result, [name, value]) => {
            result[name] = ((typeof this.searchFilters[value] === 'string' || typeof this.searchFilters[value] === 'number' || Array.isArray(this.searchFilters[value])) ? this.searchFilters[value] : this.searchFilters[value].id)
            return result
          }, {})
      },
      _transformForExport (data) {
        return data.map(({
          id,
          name,
          lastUpdatedDisplay,
          uuid,
          status
        }) => ({
          id: uuid,
          name,
          lastUpdated: lastUpdatedDisplay ? new Date(lastUpdatedDisplay).toLocaleString('sv').substr(0, 10) : undefined,
          status
        }))
      },
      async search ({ page } = { page: undefined }) {
        const searchParameters = this._searchParameters(this.searchInputFields)
        const sort = this.requestOptions.sortBy?.length > 0 ? (this.linkSearchParameterValues[this.requestOptions.sortBy[0]] || this.requestOptions.sortBy[0]) : undefined
        const desc = typeof this.requestOptions.desc === 'Array' ? this.requestOptions.desc[0] : this.requestOptions.desc

        const componentOptions = this.staticParams

        const esTypedParams = {
          es: true,
          ...((sort && { sort: sort }) || {}),
          ...((sort && { order: (desc ? 'desc' : 'asc') }) || {}),
          max: this.resultOptions.itemsPerPage
        }

        const dbTypedParams = {
          ...((sort && { _sort: sort }) || {}),
          ...((sort && { _order: (desc ? 'desc' : 'asc') }) || {}),
          limit: this.resultOptions.itemsPerPage
        }

        this.loading = true

        const result = await this.catchError({
          promise: this.searchServices.search({
            ...searchParameters,
            ...componentOptions,
            ...(this.searchByEs ? esTypedParams : dbTypedParams),
            ...((this.searchServiceIncludes && { _include: this.searchServiceIncludes }) || {}),
            ...((this.searchServiceEmbeds && { _embed: this.searchServiceEmbeds }) || {}),
            offset: page ? (page - 1) * this.requestOptions.itemsPerPage : 0,
          }, this.cancelToken.token),
          instance: this
        })

        if (result?.status === 200) {
          const { data: { data, _pagination } } = result
          if (!page) {
            this.resultOptions.page = 1
            this.requestOptions.page = 1
          }

          this.selectedItems = []
          this.totalNumberOfItems = _pagination.total
          this.resultItems = this._transformForTable(data)
        }
        else {
          this.selectedItems = []
          this.totalNumberOfItems = 0
          this.eventMessages.push({ message: this.$i18n.t(result?.data?.messageCode || 'error.search.unknown'), color: 'error' })
        }

        this.loading = false
      },
      async exportSearchResults () {
        this.exportLoading = true
        const searchParameters = this._searchParameters(this.searchInputFields)
        searchParameters.skipDomainMapping = 'true'
        const sort = this.requestOptions.sortBy?.length > 0 ? (this.linkSearchParameterValues[this.requestOptions.sortBy[0]] || this.requestOptions.sortBy[0]) : undefined
        const desc = typeof this.requestOptions.desc === 'Array' ? this.requestOptions.desc[0] : this.requestOptions.desc
        const esTypedParams = {
          es: true,
          max: 10000,
          ...((sort && { sort: sort }) || {}),
          ...((sort && { order: (desc ? 'desc' : 'asc') }) || {})
        }
        const dbTypedParams = {
          ...((sort && { _sort: sort }) || {}),
          ...((sort && { _order: (desc ? 'desc' : 'asc') }) || {})
        }
        const result = await this.catchError({
          promise: this.searchServices.search({
            ...searchParameters,
            ...(this.searchByEs ? esTypedParams : dbTypedParams),
            ...((this.searchServiceIncludes && { _include: this.searchServiceIncludes }) || {}),
            ...((this.searchServiceEmbeds && { _embed: this.searchServiceEmbeds }) || {})
          }, this.cancelToken.token),
          instance: this
        })

        if (result?.status === 200) {
          const records = result.data.records
          exportServices.toTsv(this.exportHeaders, this._transformForExport(records))
        }
        else {
          return undefined
        }
        this.exportLoading = false
      },
      executeAction (actionMethodName, actionMethodParameter) {
        actionMethodName && this[actionMethodName](actionMethodParameter)
      },
      isButtonDisabled (attributeName) {
        return this[attributeName]
      },
      editItem (value) {
        this.search()
      }
    }
  }
</script>
