<template>
  <div>
    <gokb-confirmation-popup
      v-model="confirmationPopUpVisible"
      :message="messageToConfirm"
      @confirmed="executeAction(actionToConfirm, parameterToConfirm)"
    />
    <gokb-section
      v-model="isExpanded"
      expandable
      :hide-default="!expanded"
      :filters="filterAlign"
      :expand-filters="expandFilters"
      show-actions
      :sub-title="sectionTitle"
      :items-total="totalNumberOfItems"
      :errors="!!apiErrors"
      :mark-required="required"
      :clear-background="!ttl && !pkg"
    >
      <span v-if="successMessage">
        <v-alert type="success">
          {{ successMessage }}
        </v-alert>
      </span>
      <gokb-kbart-import-popup
        v-if="kbartImportPopupVisible"
        v-model="kbartImportPopupVisible"
        :content-type="contentType"
        :provider="provider"
        @kbart="addKbartFile"
      />
      <gokb-add-title-popup
        v-if="!!addTitlePopupVisible"
        v-model="addTitlePopupVisible"
        :title-type="addTitleType"
        :pkg="pkg"
        :parent-platform="platform"
        @add="addNewTitle"
        @edit="addTippChangeEvent"
      />
      <template #buttons>
        <gokb-package-export-menu
          v-if="pkg"
          :pkg-id="pkg"
        />
        <gokb-button
          v-if="isEditable"
          class="mx-4"
          color="primary"
          @click.prevent="showKbartImportPopup"
        >
          KBART Import
        </gokb-button>
        <v-menu
          v-if="isEditable"
          v-model="addTippMenuOpen"
          offset-y
          open-on-hover
        >
          <template #activator="{ props }">
            <v-btn
              class="mr-4"
              variant="elevated"
              color="primary"
              v-bind="props"
            >
              <v-icon>mdi-plus</v-icon>
              {{ $t('btn.add') }}
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(type, i) in packageTypes"
              :key="i"
              @click="showAddNewTitlePopup(type)"
            >
              <v-list-item-title>
                {{ type.text }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn
          icon
          :title="$t('btn.refresh')"
          :class="[ttl ? 'mt-4' : '']"
          @click="fetchTipps"
        >
          <v-icon color="primary">
            mdi-refresh
          </v-icon>
        </v-btn>
      </template>
      <template #actions>
        <span
          style="min-width:82px"
          class="ml-2"
        >
          <div
            v-if="selectedItems.length >= 10"
            style="text-align:center"
          >
            <div class="mr-6">{{ $t('default.all') }}</div>
            <v-checkbox
              id="bulkCheck"
              v-model="bulkSelect"
              class="mx-2 mt-4"
            />
          </div>
        </span>

        <v-menu
          v-if="isEditable && selectedItems.length > 0"
          v-model="bulkselectMenuOpen"
          offset-y
          open-on-hover
        >
          <template #activator="{ props }">
            <v-btn
              :disabled="selectedItems.length == 0"
              class="mr-4 mt-4"
              variant="elevated"
              color="primary"
              v-bind="props"
            >
              {{ $t('btn.bulkSelect', [bulkSelect ? totalNumberOfItems : selectedItems.length]) }}
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <template v-for="status in statusTypes">
              <v-list-item
                v-if="!searchFilters.status || status.id != searchFilters.status.value"
                :key="status.text"
                @click="confirmBulkStatusChange(status.id)"
              >
                <template v-slot:prepend>
                  <v-icon
                    :color="status.id === 'Deleted' ? 'red' : ''"
                    :icon="status.icon"
                  />
                </template>

                <v-list-item-title>
                  <span :style="{ color: status.id === 'Deleted' ? 'red' : '' }">{{ status.text }}</span>
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-menu>
      </template>
      <template #search>
        <gokb-state-field
          v-model="searchFilters.status"
          width="150px"
          class="ms-4"
          init-item="Current"
          message-path="component.general.status"
          :label="$t('component.general.status.label')"
          return-object
        />
        <v-btn
          text
          class="ml-3"
          @click="toggleFilters"
        >
          {{ $t('btn.moreFilters') }}
          <v-icon>
            {{ expandFilters ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
          </v-icon>
        </v-btn>
      </template>
      <template #filters>
        <v-row>
          <v-col>
            <gokb-text-field
              v-model="searchFilters.q"
              class="pt-3"
              :label="$tc('search.generic.label')"
            />
          </v-col>
          <v-col>
            <gokb-subject-filter-field
              v-model="searchFilters.subjects"
              class="mt-2"
              :label="$tc('component.subject.label')"
            />
          </v-col>
          <v-col v-if="!pkg">
            <gokb-search-package-field
              v-model="searchFilters.pkg"
              class="pt-3"
              :label="$tc('component.package.label')"
            />
          </v-col>
        </v-row>
      </template>
      <gokb-table
        v-if="ttl || pkg"
        :headers="tableHeaders"
        :items="items"
        :label="(newTipps.length ? $t('component.package.navigation.currentTitles') : undefined)"
        :editable="isEditable"
        :selected-items="selectedItems"
        :total-number-of-items="totalNumberOfItems"
        :show-loading="isLoading"
        :options.sync="searchOptions"
        @selected-items="selectedItems = $event"
        @paginate="resultPaginate"
        @edit="editTitle"
      />
    </gokb-section>
    <gokb-section
      v-if="(!pkg && !ttl) || newTipps.length > 0"
      no-tool-bar
    >
      <gokb-table
        :headers="newTableHeaders"
        :items="newTipps"
        :label="$t('component.package.navigation.newTitles')"
        :editable="isEditable"
        :total-number-of-items="totalNumberOfNewItems"
        :options.sync="newOptions"
        @paginate="resultNewPaginate"
        @edit="editTitle"
      />
    </gokb-section>
  </div>
</template>

<script>
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import GokbAddTitlePopup from '@/shared/popups/gokb-add-title-popup'
  import GokbKbartImportPopup from '@/shared/popups/gokb-kbart-import-popup'
  import packageServices from '@/shared/services/package-services'
  import tippServices from '@/shared/services/tipp-services'
  import titleServices from '@/shared/services/title-services'
  import BaseComponent from '@/shared/components/base-component'
  import accountModel from '@/shared/models/account-model'

  const ROWS_PER_PAGE = 10

  export default {
    name: 'GokbTippsSection',
    components: {
      GokbConfirmationPopup,
      GokbAddTitlePopup,
      GokbKbartImportPopup
    },
    extends: BaseComponent,
    emits: ['update', 'kbart'],
    props: {
      disabled: {
        type: Boolean,
        required: false,
        default: false
      },
      pkg: {
        type: [Number, String],
        required: false,
        default: undefined
      },
      ttl: {
        type: [Number, String],
        required: false,
        default: undefined
      },
      expanded: {
        type: Boolean,
        required: false,
        default: true
      },
      platform: {
        type: Object,
        required: false,
        default: undefined
      },
      showTitle: {
        type: Boolean,
        required: false,
        default: true
      },
      apiErrors: {
        type: Array,
        required: false,
        default: undefined
      },
      provider: {
        type: Object,
        required: false,
        default: undefined
      },
      required: {
        type: Boolean,
        required: false,
        default: false
      },
      filterAlign: {
        type: Boolean,
        required: false,
        default: true
      },
      contentType: {
        type: Object,
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        searchOptions: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE,
          mustSort: true,
          sortBy: [{ key: 'lastUpdated', order: 'desc' }],
        },
        newOptions: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
        },
        selectedItems: [],
        selectedNewItems: [],
        isExpanded: true,
        bulkSelect: false,
        linkSearchParameterValues: {
          popup: 'name'
        },
        searchFilters: {
          status: undefined,
          q: undefined,
          ids: undefined,
          pkg: undefined,
          subjects: undefined
        },
        expandFilters: false,
        newTipps: [],
        successMessage: undefined,
        items: [],
        addTitleType: undefined,
        kbartImportPopupVisible: false,
        confirmationPopUpVisible: false,
        addTitlePopupVisible: undefined,
        addTippMenuOpen: false,
        bulkselectMenuOpen: false,
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        messageToConfirm: undefined,
        itemCount: 0,
        newItemCount: 0,
        interval: null,
        linkValue: 'title',
        loading: false
      }
    },
    computed: {
      isDeleteSelectedDisabled () {
        return !this.selectedItems.length
      },
      totalNumberOfItems () {
        return this.itemCount
      },
      totalNumberOfNewItems () {
        return this.newTipps.length
      },
      isEditable () {
        return !this.disabled && !this.ttl
      },
      tableHeaders () {
        return [
          { title: (!!this.ttl ? this.$i18n.tc('component.package.label') : this.$i18n.tc('component.tipp.label')), align: 'start', value: 'popup', width: '50%', sortable: true },
          { title: this.$i18n.tc('component.general.status.label'), align: 'start', value: 'statusLocal', sortable: false, width: '10%' },
          { title: this.$i18n.tc('component.title.type.label'), align: 'start', value: 'titleType', sortable: false, width: '10%' },
          { title: this.$i18n.tc('component.platform.label'), align: 'start', value: 'hostPlatformName', sortable: false, width: '20%' },
          { title: this.$i18n.tc('component.general.lastUpdated'), align: 'end', value: 'lastUpdated', sortable: true }
        ]
      },
      newTableHeaders () {
        return [
          { title: this.$i18n.tc('component.tipp.label'), align: 'start', value: 'popup', sortable: false },
          { title: this.$i18n.tc('component.general.status.label'), align: 'start', value: 'statusLocal', sortable: false, width: '10%' },
          { title: this.$i18n.tc('component.title.type.label'), align: 'start', value: 'titleType', sortable: false, width: '10%' },
          { title: this.$i18n.tc('component.platform.label'), align: 'start', value: 'hostPlatformName', sortable: false, width: '20%' }
        ]
      },
      packageTypes () {
        return [
          { id: 'Monograph', text: this.$i18n.tc('component.title.type.Book') },
          { id: 'Database', text: this.$i18n.tc('component.title.type.Database') },
          { id: 'Serial', text: this.$i18n.tc('component.title.type.Journal') },
          { id: 'Other', text: this.$i18n.tc('component.title.type.Other') },
        ]
      },
      statusTypes () {
        return [
          { id: 'Current', text: this.$i18n.tc('component.general.status.Current.label'), icon: 'mdi-check-circle-outline' },
          { id: 'Retired', text: this.$i18n.tc('component.general.status.Retired.label'), icon: 'mdi-close' },
          { id: 'Expected', text: this.$i18n.tc('component.general.status.Expected.label'), icon: 'mdi-clock-outline' },
          { id: 'Deleted', text: this.$i18n.tc('component.general.status.Deleted.label'), icon: 'mdi-delete-outline' },
        ]
      },
      loggedIn () {
        return accountModel.loggedIn()
      },
      sectionTitle () {
        return this.showTitle ? this.$i18n.tc('component.tipp.label', 2) : undefined
      },
      isLoading () {
        return this.loading
      },
      bulkSelectLabel () {
        return this.$i18n.t('btn.bulkSelect', [Math.ceil(this.totalNumberOfItems / ROWS_PER_PAGE)])
      }
    },
    watch: {
      loggedIn (value) {
        if (value) {
          this.fetchTipps(this.searchOptions)
        }
      },
      searchFilters: {
        handler (val) {
          this.searchOptions.page = 1
          this.fetchTipps(this.searchOptions)
        },
        deep: true
      },
      'selectedItems.length' (length) {
        if (length >= 10) {
          this.enableBulkCheck = true
        } else {
          this.bulkSelect = false
        }
      }
    },
    async mounted () {
      this.isExpanded = !this.expandable || this.expanded

      if (this.ttl) {
        this.fetchTipps(this.searchOptions)
      }
    },
    methods: {
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      confirmBulkStatusChange (status) {
        if (this.bulkSelect) {
          this.actionToConfirm = '_executeBulkAction'
          this.messageToConfirm = { text: 'popups.confirm.status.list', vars: [this.totalNumberOfItems, this.$i18n.t('component.general.status.' + status + '.label')] }
          this.parameterToConfirm = status
          this.confirmationPopUpVisible = true
        } else {
          this.actionToConfirm = '_updateSelectedItems'
          this.messageToConfirm = { text: 'popups.confirm.status.list', vars: [this.selectedItems.length, this.$i18n.t('component.general.status.' + status + '.label')] }
          this.parameterToConfirm = status
          this.confirmationPopUpVisible = true
        }
      },
      confirmDeleteNew ({ id }) {
        this.actionToConfirm = '_deleteNewItem'
        this.messageToConfirm = { text: 'popups.confirm.delete.list', vars: [this.$i18n.tc('component.tipp.label'), ''] }
        this.parameterToConfirm = id
        this.confirmationPopUpVisible = true
      },
      _deleteNewItem (idToDelete) {
        this.newTipps = this.newTipps.filter(({ id }) => id !== idToDelete)
      },
      async _executeBulkAction (status) {
        const searchParams = { pkg: this.pkg }
        this.loading = true

        Object.keys(this.searchFilters).forEach(key => {
          if (this.searchFilters[key] instanceof String || typeof this.searchFilters[key] === 'number') {
            searchParams[key] = this.searchFilters[key]
          } else if (this.searchFilters[key] instanceof Object) {
            if (this.searchFilters[key].id) {
              searchParams[key] = this.searchFilters[key].id
            } else if (this.searchFilters[key].value) {
              searchParams[key] = this.searchFilters[key].value
            }
          }
        })

        const response = await this.catchError({
          promise: tippServices.bulkUpdate(searchParams, 'status', status, this.cancelToken.token),
          instance: this
        })

        if (response.status === 403) {
          this.errorMsg = 'error.bulkUpdate.403'
        }

        this.loading = false

        this.selectedItems = []
        this.searchOptions.page = 1
        this.fetchTipps()
      },
      async _updateSelectedItems (status) {
        const ids = this.selectedItems.map(({ id }) => id)

        var body = {
          status: status,
          items: ids
        }

        const response = await this.catchError({
          promise: tippServices.bulkUpdateStatus(body, this.cancelToken.token),
          instance: this
        })

        if (response.status === 403) {
          this.errorMsg = 'error.bulkUpdate.403'
        }

        this.selectedItems = []
        this.searchOptions.page = 1
        this.fetchTipps()
      },
      showAddNewTitlePopup (titleType) {
        this.addTitleType = titleType
        this.successMessage = false
        this.addTitlePopupVisible = 1
      },
      showKbartImportPopup () {
        this.successMessage = false
        this.kbartImportPopupVisible = true
      },
      editTitle (tipp) {
        this.successMessage = this.$i18n.t('success.update', [this.$i18n.tc('component.tipp.label'), (tipp.name || tipp.title?.name)])
        this.fetchTipps(this.searchOptions)
      },
      addNewTitle (tipp) {
        this.successMessage = this.$i18n.t('success.add', [this.$i18n.tc('component.tipp.label'), (tipp.name || tipp.title?.name)])
        this.newTipps.push(tipp)
        this.$emit('update', this.newTipps)
      },
      addTippChangeEvent (tipp) {
        this.newTipps.push(tipp)
      },
      addKbartFile (options) {
        this.$emit('kbart', options)
      },
      resultPaginate (options) {
        this.successMessage = false

        if (!!options.sortBy) {
          this.searchOptions.sortBy = options.sortBy
        }

        if (!!options.itemsPerPage) {
          this.searchOptions.itemsPerPage = options.itemsPerPage
        }

        if (!!this.ttl || !!this.pkg) {
          this.fetchTipps()
        }
      },
      resultNewPaginate () {
        this.successMessage = false
      },
      toggleFilters () {
        this.expandFilters = !this.expandFilters
      },
      async fetchTipps () {
        if (this.pkg || this.ttl) {
          this.selectedItems = []
          const reqId = this.pkg || this.ttl
          const searchService = this.pkg ? packageServices : titleServices
          const searchParams = {}

          Object.keys(this.searchFilters).forEach(key => {
            if (!this.searchFilters[key]) {

            } else if (typeof this.searchFilters[key] === 'string' || typeof this.searchFilters[key] === 'number') {
              searchParams[key] = this.searchFilters[key]
            } else if (typeof this.searchFilters[key] === 'object') {
              if (this.searchFilters[key].id) {
                searchParams[key] = this.searchFilters[key].id
              } else if (this.searchFilters[key].value) {
                searchParams[key] = this.searchFilters[key].value
              }
            }
          })

          this.loading = true

          const result = await this.catchError({
            promise: searchService.getTipps(reqId, {
              ...(searchParams || {}),
              _sort: (this.linkSearchParameterValues[this.searchOptions.sortBy[0]['key']] || this.searchOptions.sortBy[0]['key']),
              _order: (this.searchOptions.sortBy[0]['order']),
              offset: ((this.searchOptions?.page || this.searchOptions.page) - 1) * this.searchOptions.itemsPerPage,
              limit: this.searchOptions.itemsPerPage
            }, this.cancelToken.token),
            instance: this
          })

          if (result?.status === 200) {
            this.items = result.data?.data?.map(tipp => (
                {
                  ...tipp,
                  coverageStatements: tipp._embedded.coverageStatements,
                  statusLocal: this.$i18n.t('component.general.status.' + tipp.status.name + '.label'),
                  dateFirstInPrint: tipp.dateFirstInPrint && this.buildDateString(tipp.dateFirstInPrint),
                  dateFirstOnline: tipp.dateFirstOnline && this.buildDateString(tipp.dateFirstOnline),
                  accessStartDate: tipp.accessStartDate && this.buildDateString(tipp.accessStartDate),
                  accessEndDate: tipp.accessEndDate && this.buildDateString(tipp.accessEndDate),
                  variantNames: tipp._embedded.variantNames.map(variantName => ({
                    ...variantName,
                    isDeletable: !!this.updateUrl
                  })),
                  lastUpdated: this.buildDateString(tipp.lastUpdated),
                  updateUrl: tipp._links.update.href,
                  deleteUrl: tipp._links.delete.href,
                  titleType: tipp.title?.type ? (this.$i18n.tc('component.title.type.' + tipp.title.type)) : (tipp.publicationType ? this.$i18n.tc('component.title.type.' + tipp.publicationType.name) : undefined),
                  connectedTitleId: tipp.title?.id,
                  ids: tipp._embedded.ids.map(({ id, value, namespace }) => ({
                    id,
                    value,
                    namespace: namespace.value,
                    nslabel: (namespace.name || namespace.value),
                    isDeletable: !!tipp._links.delete.href
                  })),
                  subjects: tipp._embedded.subjects.map(subject => ({
                    ...subject,
                    isDeletable: !!this.updateUrl
                  })),
                  prices: tipp._embedded.prices,
                  popup: {
                    value: (this.ttl ? tipp.pkg.name : (tipp.name || tipp.title?.name || this.$i18n.t('component.tipp.label') + ' ' + tipp.id)),
                    label: 'tipp',
                    type: 'GokbAddTitlePopup'
                  },
                  hostPlatformName: tipp.hostPlatform?.name,
                }
              )
            )
            this.itemCount = result?.data?._pagination?.total

            this.$emit('update', this.itemCount)
          }

          this.loading = false
        }
      }
    }
  }
</script>
