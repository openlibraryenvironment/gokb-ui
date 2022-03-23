<template>
  <div>
    <gokb-section
      expandable
      :hide-default="!expanded"
      :filters="filterAlign"
      :show-actions="isEditable"
      :sub-title="title"
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
        :default-title-namespace="defaultTitleNamespace"
        @kbart="addKbartFile"
      />
      <gokb-add-title-popup
        v-if="addTitlePopupVisible"
        v-model="addTitlePopupVisible"
        :title-type="addTitleType"
        :pkg="pkg"
        :parent-platform="platform"
        @add="addNewTitle"
        @edit="addTippChangeEvent"
      />
      <template
        v-if="isEditable"
        #buttons
      >
        <gokb-button
          class="mr-4"
          color="primary"
          @click="showKbartImportPopup"
        >
          KBART Import
        </gokb-button>
        <v-menu
          offset-y
          open-on-hover
        >
          <template #activator="{ on }">
            <v-btn
              class="mr-4 invert--text"
              color="primary"
              v-on="on"
            >
              <v-icon>mdi-plus</v-icon>
              {{ $t('btn.add') }}
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <template v-for="type in packageTypes">
              <v-list-item
                :key="type.text"
                @click="showAddNewTitlePopup(type)"
              >
                <v-list-item-title>
                  {{ type.text }}
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-menu>
        <v-btn
          icon
          :title="$t('btn.refresh')"
          style="margin-top:-4px"
          @click="fetchTipps"
        >
          <v-icon>
            mdi-refresh
          </v-icon>
        </v-btn>
      </template>
      <gokb-confirmation-popup
        v-model="confirmationPopUpVisible"
        :message="messageToConfirm"
        @confirmed="executeAction(actionToConfirm, parameterToConfirm)"
      />
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
              class="mx-4"
            />
          </div>
        </span>

        <v-menu
          v-if="isEditable"
          offset-y
          open-on-hover
        >
          <template #activator="{ on }">
            <v-btn
              :disabled="selectedItems.length == 0"
              class="mr-4"
              color="primary"
              v-on="on"
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
                <v-list-item-icon>
                  <v-icon
                    :color="status.id === 'Deleted' ? 'red' : ''"
                    v-text="status.icon"
                  />
                </v-list-item-icon>
                <v-list-item-title>
                  <span :style="{ color: status.id === 'Deleted' ? 'red' : '' }">{{ status.text }}</span>
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-menu>
      </template>
      <template #search>
        <gokb-title-field
          v-if="pkg"
          v-model="searchFilters.title"
          class="ms-4"
          :label="$tc('component.title.name.label')"
        />
        <gokb-title-ids-field
          v-if="pkg"
          v-model="searchFilters.title"
          class="ms-4"
          :label="$tc('component.title.ids.label')"
        />
        <gokb-search-package-field
          v-else
          v-model="searchFilters.pkg"
          class="ms-4"
          :label="$tc('component.package.label')"
        />
        <gokb-state-field
          v-model="searchFilters.status"
          width="150px"
          class="ms-4"
          :init-item="$t('component.general.status.Current.label')"
          message-path="component.general.status"
          :label="$t('component.general.status.label')"
          return-object
        />
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
        :options.sync="options"
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
        hide-select
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
    props: {
      disabled: {
        type: Boolean,
        required: false,
        default: false
      },
      pkg: {
        type: Number,
        required: false,
        default: undefined
      },
      ttl: {
        type: Number,
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
      defaultTitleNamespace: {
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
      }
    },
    data () {
      return {
        options: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE,
          sortBy: ['popup'],
          desc: [false]
        },
        newOptions: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
        },
        selectedItems: [],
        selectedNewItems: [],
        bulkSelect: false,
        searchFilters: {
          status: undefined,
          title: undefined,
          pkg: undefined
        },
        newTipps: [],
        successMessage: undefined,
        items: [],
        addTitleType: undefined,
        kbartImportPopupVisible: false,
        confirmationPopUpVisible: false,
        addTitlePopupVisible: undefined,
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
          { text: (this.ttl ? this.$i18n.tc('component.package.label') : this.$i18n.tc('component.title.label')), align: 'left', value: 'popup', sortable: false },
          { text: this.$i18n.tc('component.general.status.label'), align: 'left', value: 'statusLocal', sortable: false, width: '10%' },
          { text: this.$i18n.tc('component.title.type.label'), align: 'left', value: 'titleType', sortable: false, width: '10%' },
          { text: this.$i18n.tc('component.platform.label'), align: 'left', value: 'hostPlatformName', sortable: false, width: '20%' }
        ]
      },
      newTableHeaders () {
        return [
          { text: this.$i18n.tc('component.title.label'), align: 'left', value: 'popup', sortable: false },
          { text: this.$i18n.tc('component.general.status.label'), align: 'left', value: 'statusLocal', sortable: false, width: '10%' },
          { text: this.$i18n.tc('component.title.type.label'), align: 'left', value: 'titleType', sortable: false, width: '10%' },
          { text: this.$i18n.tc('component.platform.label'), align: 'left', value: 'hostPlatformName', sortable: false, width: '20%' }
        ]
      },
      packageTypes () {
        return [
          { id: 'Book', text: this.$i18n.tc('component.title.type.Book') },
          { id: 'Database', text: this.$i18n.tc('component.title.type.Database') },
          { id: 'Journal', text: this.$i18n.tc('component.title.type.Journal') },
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
      title () {
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
          this.fetchTipps(this.options)
        }
      },
      searchFilters: {
        handler (val) {
          this.options.page = 1
          this.fetchTipps(this.options)
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
    async created () {
      if (this.ttl) {
        this.fetchTipps(this.options)
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
        this.options.page = 1
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
        this.options.page = 1
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
        this.fetchTipps(this.options)
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

        if (this.ttl || this.pkg) {
          this.fetchTipps(this.options)
        }
      },
      resultNewPaginate (page) {
        this.successMessage = false
      },
      async fetchTipps (options) {
        if (this.pkg || this.ttl) {
          this.selectedItems = []
          const reqId = this.pkg || this.ttl
          const searchService = this.pkg ? packageServices : titleServices
          const searchParams = {}

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

          this.loading = true

          const result = await this.catchError({
            promise: searchService.getTipps(reqId, {
              ...(searchParams || {}),
              offset: ((options?.page || this.options.page) - 1) * this.options.itemsPerPage,
              limit: this.options.itemsPerPage
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
                  variantNames: tipp._embedded.variantNames.map(variantName => ({ ...variantName, isDeletable: !!this.updateUrl })),
                  updateUrl: tipp._links.update.href,
                  deleteUrl: tipp._links.delete.href,
                  titleType: this.title?.type ? this.$i18n.tc('component.title.type.' + tipp.title.type) : (tipp.publicationType ? this.$i18n.tc('component.title.type.' + tipp.publicationType.name) : undefined),
                  connectedTitleId: tipp.title?.id,
                  ids: tipp._embedded.ids.map(({ id, value, namespace }) => ({ id, value, namespace: namespace.value, nslabel: (namespace.name || namespace.value), isDeletable: !!tipp._links.delete.href })),
                  prices: tipp._embedded.prices,
                  popup: { value: (this.ttl ? tipp.pkg.name : (tipp.name || tipp.title?.name || this.$i18n.t('component.tipp.label') + ' ' + tipp.id)), label: 'tipp', type: 'GokbAddTitlePopup' },
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
