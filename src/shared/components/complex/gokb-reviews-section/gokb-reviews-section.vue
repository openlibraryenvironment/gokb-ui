<template>
  <gokb-section
    v-model="expanded"
    :expandable="expandable"
    :filters="showEditActions"
    :sub-title="title"
    :errors="!!apiErrors"
    :show-actions="showBulkActions"
    :items-total="totalNumberOfItems"
  >
    <template #buttons>
      <gokb-checkbox-field
        v-if="isPackageComponent"
        v-model="fetchTitleReviews"
        class="pt-8 pr-6"
        :label="$t('component.review.titleReviews.label')"
      />
      <gokb-checkbox-field
        v-if="!!group && isAdmin"
        v-model="fetchEscalatedOnly"
        class="pt-8 pr-6"
        :label="$t('component.review.escalatedOnly.label')"
      />
      <gokb-state-field
        v-model="searchFilters.stdDesc"
        class="mr-4 mt-4"
        message-path="component.review.stdDesc"
        url="refdata/categories/ReviewRequest.StdDesc"
        :label="$t('component.review.stdDesc.label')"
      />
      <gokb-state-field
        v-model="searchFilters.status"
        class="mr-4 mt-4"
        width="200px"
        init-item="Open"
        message-path="component.review.status"
        url="refdata/categories/ReviewRequest.Status"
        :label="$t('component.general.status.label')"
        return-object
      />
      <v-btn
        icon
        :title="$t('btn.refresh')"
        @click="retrieveReviews"
      >
        <v-icon color="primary">
          mdi-refresh
        </v-icon>
      </v-btn>
      <gokb-add-review-popup
        v-if="addReviewPopupVisible"
        v-model="addReviewPopupVisible"
        :component="reviewComponent"
        @edit="handlePopupChange"
      />
      <gokb-add-review-popup
        v-if="addExternalReviewPopupVisible"
        v-model="addExternalReviewPopupVisible"
        :component="reviewComponent"
        editorial-request
        @edit="handlePopupChange"
      />
      <gokb-button
        v-if="!!reviewComponent && !externalRequestEnabled"
        class="mr-4"
        icon-id="mdi-plus"
        color="primary"
        @click.prevent="showAddReviewPopup"
      >
        {{ $t('btn.add') }}
      </gokb-button>

      <v-menu v-else-if="!!reviewComponent">
        <template v-slot:activator="{ props }">
          <gokb-button
            icon-id="mdi-swap-vertical"
            color="primary"
            :disabled="disabled"
            v-bind="props"
          >
            {{ $t('btn.add') }}
          </gokb-button>
        </template>
        <v-list>
          <v-list-item
            :value="1"
          >
            <v-list-item-title @click="showAddReviewPopup">
              <span>{{ $t('component.review.stdDesc.Manual Request.label') }}</span>
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            :value="2"
          >
            <v-list-item-title @click="showAddExternalReviewPopup">
              <span>{{ $t('component.review.stdDesc.External Editorial Request.label') }}</span>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <gokb-button
        v-if="isPackageComponent && totalNumberOfItems > 0"
        :loading="exportIsLoading"
        class="mr-4"
        color="primary"
        @click="exportReviewRequests"
      >
        {{ $t('btn.export') }}
      </gokb-button>

    </template>
    <template #actions v-if="showBulkActions">
      <span
        style="min-width:82px"
      >
        <div
          v-if="selectedItems.length >= 10"
          style="text-align:center"
        >
          <div class="ml-2 mr-6">{{ $t('default.all') }}</div>
          <v-checkbox
            id="bulkCheck"
            v-model="allPagesSelected"
            class="mx-6"
          />
        </div>
      </span>
      <gokb-button
        class="mr-4"
        icon-id="mdi-check"
        :disabled="bulkEditDisabled"
        color="primary"
        @click="confirmBulkClose"
      >
        {{ bulkCloseLabel }}
      </gokb-button>
    </template>
    <gokb-confirmation-popup
      v-model="confirmationPopUpVisible"
      :message="messageToConfirm"
      @confirmed="executeAction(actionToConfirm, parameterToConfirm)"
    />
    <span v-if="errorMsg">
      <v-alert
        type="error"
        dismissible
      >
        {{ localErrorMessage }}
      </v-alert>
    </span>
    <span v-if="successMessage">
      <v-alert
        type="success"
        dismissible
      >
        {{ successMessage }}
      </v-alert>
    </span>
    <gokb-table
      ref="rtable"
      :items="reviews"
      :headers="localizedReviewHeaders"
      :editable="showEditActions"
      :total-number-of-items="totalNumberOfItems"
      :selected-items="selectedItems"
      :options.sync="reviewsOptions"
      :actions="showEditActions"
      :show-loading="loading"
      :hide-select="!showEditActions"
      item-selectable="isClosable"
      @selected-items="selectedItems = $event"
      @paginate="resultPaginate"
      @edit="handlePopupChange"
      @close-review="closeReview"
    />
  </gokb-section>
</template>

<script>
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import GokbReviewPopup from '@/shared/popups/gokb-review-popup'
  import GokbAddReviewPopup from '@/shared/popups/gokb-add-review-popup'
  import reviewServices from '@/shared/services/review-services'
  import profileServices from '@/shared/services/profile-services'
  import BaseComponent from '@/shared/components/base-component'
  import account from '@/shared/models/account-model'
  import exportServices from "@/shared/services/export-services";

  const ROWS_PER_PAGE = 10

  export default {
    name: 'GokbReviewsSection',
    components: {
      GokbConfirmationPopup,
      GokbAddReviewPopup,
      GokbReviewPopup
    },
    extends: BaseComponent,
    emits: [
      'update'
    ],
    props: {
      user: {
        type: Boolean,
        required: false,
        default: false
      },
      group: {
        type: Object,
        required: false,
        default: undefined
      },
      reviewComponent: {
        type: Object,
        required: false,
        default: undefined
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false
      },
      expandable: {
        type: Boolean,
        required: false,
        default: true
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
      hideSelect: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data () {
      return {
        rawReviews: undefined,
        confirmationPopUpVisible: false,
        addReviewPopupVisible: undefined,
        addExternalReviewPopupVisible: undefined,
        allPagesSelected: false,
        enableBulkCheck: false,
        successMessage: undefined,
        errorMsg: undefined,
        expanded: true,
        loading: false,
        selectedItems: [],
        selectedItemsTotal: 0,
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        fetchTitleReviews: false,
        fetchEscalatedOnly: false,
        totalNumberOfItems: 0,
        messageToConfirm: undefined,
        reviewBaseUrl: `${window.location.origin}${import.meta.env.VITE_PUBLIC_PATH}review/`,
        reviewsOptions: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE,
          mustSort: true,
          sortBy: [{ key:'dateCreated', order: 'asc' }],
          desc: false
        },
        reviewsRaisedBy: undefined,
        searchFilters: {
          status: 'Open',
          stdDesc: undefined
        },
        exportIsLoading: false,
        externalRequestEnabled: false
      }
    },
    computed: {
      isDeleteSelectedDisabled () {
        return this.selectedItemsTotal === 0
      },
      reviewStates () {
        return [
          { text: this.$i18n.t('component.review.status.Open.label'), value: 'Open' },
          { text: this.$i18n.t('component.review.status.Closed.label'), value: 'Closed' },
          { text: this.$i18n.t('component.review.status.Deleted.label'), value: 'Deleted' }
        ]
      },
      bulkCloseLabel () {
        return this.$i18n.tc('btn.bulkCloseReview', (this.allPagesSelected ? this.totalNumberOfItems : this.selectedItemsTotal), [(this.allPagesSelected ? this.totalNumberOfItems : this.selectedItemsTotal)])
      },
      reviews () {
        const componentRoutes = {
          package: '/package',
          org: '/provider',
          title: '/title',
          journal: '/title',
          book: '/title',
          database: '/title'
        }
        const reviews = this.rawReviews?.data?.data
        return reviews?.map(entry => {
          const id = entry?.id
          const component = entry?.componentToReview
          const componentId = entry?.componentToReview.id
          const type = entry?.componentToReview?.type ? this.$i18n.tc('component.' + entry?.componentToReview?.type.toLowerCase() + '.label') : undefined
          const dateCreated = new Date(entry?.dateCreated).toLocaleString('sv')
          const lastUpdated = new Date(entry?.lastUpdated).toLocaleString('sv')
          const request = entry?.reviewRequest
          const description = entry?.descriptionOfCause
          const status = entry?.status
          const statusLabel = entry?.status && this.$i18n.t('component.review.status.' + entry?.status.name + '.label')
          const stdDesc = entry?.stdDesc
          const stdDescLabel = entry?.stdDesc ? this.$i18n.t('component.review.stdDesc.' + entry?.stdDesc.name + '.label') : this.$i18n.t('component.review.stdDesc.none.label')
          const updateUrl = entry?._links.update.href
          const deleteUrl = entry?._links.delete.href
          const popup = { value: this.reviewComponent ? stdDescLabel : (component.name || type + ' ' + component.id), label: 'review', type: 'GokbReviewPopup' }
          const link = { value: component.name, route: componentRoutes[entry?.componentToReview?.type?.toLowerCase()], id: 'componentId' }
          const groupsList = entry.allocatedGroups.map(ag => ag.name).join(', ')
          const isClosable = !!(status?.name === 'Open' && updateUrl)
          return { id, status, dateCreated, lastUpdated, statusLabel, stdDescLabel, groupsList, component, popup, type, stdDesc, link, componentId, request, description, updateUrl, deleteUrl, isClosable }
        })
      },
      isContrib () {
        return account.loggedIn() && account.hasRole('ROLE_CONTRIBUTOR')
      },
      isAdmin () {
        return account.loggedIn() && account.hasRole('ROLE_ADMIN')
      },
      showBulkActions () {
        return this.selectedItemsTotal > 0 || this.allPagesSelected
      },
      showEditActions () {
        return !!this.reviews && !this.hideSelect && (this.reviews?.filter(item => (item.updateUrl)).length > 0)
      },
      bulkEditDisabled () {
        return !this.reviews || this.selectedItems.length === 0 || this.selectedItems.some(item => (item.updateUrl === null))
      },
      localErrorMessage () {
        return !!this.errorMsg ? this.$i18n.t(this.errorMsg, [this.$i18n.tc('component.review.label', 2)]) : undefined
      },
      isPackageComponent () {
        return this.reviewComponent?.type === 'package'
      },
      localizedReviewHeaders () {
        const compConfig = [
          {
            title: this.$i18n.tc('component.review.stdDesc.label'),
            align: 'start',
            sortable: false,
            nowrap: true,
            width: '100%',
            key: 'popup'
          },
          {
            title: this.$i18n.t('component.general.status.label'),
            align: 'end',
            sortable: false,
            width: '10%',
            key: 'statusLabel'
          },
          {
            title: this.$i18n.t('component.general.dateCreated'),
            align: 'end',
            sortable: true,
            nowrap: true,
            key: 'dateCreated'
          },
          {
            title: this.$i18n.t('component.general.lastUpdated'),
            align: 'end',
            sortable: true,
            nowrap: true,
            key: 'lastUpdated'
          }
        ]
        const pkgTitlesConfig = [
          {
            title: this.$i18n.tc('component.review.stdDesc.label'),
            align: 'start',
            sortable: false,
            width: '100%',
            key: 'popup'
          },
          {
            title: this.$i18n.tc('component.curatoryGroup.label', 2),
            align: 'start',
            sortable: false,
            key: 'groupsList'
          },
          {
            title: this.$i18n.t('component.general.status.label'),
            align: 'start',
            sortable: false,
            width: '10%',
            key: 'statusLabel'
          },
          {
            title: this.$i18n.t('component.general.dateCreated'),
            align: 'end',
            sortable: true,
            nowrap: true,
            key: 'dateCreated'
          },
          {
            title: this.$i18n.t('component.general.lastUpdated'),
            align: 'end',
            sortable: true,
            nowrap: true,
            key: 'lastUpdated'
          }
        ]
        const defaultConfig = [
          {
            title: this.$i18n.t('component.review.componentToReview.label'),
            align: 'start',
            sortable: false,
            width: '100%',
            key: 'popup'
          },
          {
            title: this.$i18n.t('component.review.type.label'),
            align: 'start',
            sortable: false,
            key: 'type'
          },
          {
            title: this.$i18n.tc('component.review.stdDesc.label'),
            align: 'start',
            sortable: false,
            width: '20%',
            nowrap: true,
            key: 'stdDescLabel'
          },
          {
            title: this.$i18n.t('component.general.status.label'),
            align: 'start',
            sortable: false,
            key: 'statusLabel'
          },
          {
            title: this.$i18n.t('component.general.dateCreated'),
            align: 'end',
            sortable: true,
            nowrap: true,
            value: 'dateCreated'
          },
          {
            title: this.$i18n.t('component.general.lastUpdated'),
            align: 'end',
            sortable: true,
            nowrap: true,
            key: 'lastUpdated'
          }
        ]

        return this.reviewComponent ? (this.fetchTitleReviews ? pkgTitlesConfig : compConfig) : defaultConfig
      },
      title () {
        return this.showTitle ? (this.group ? this.$i18n.tc('component.review.label', 2) + ' (' + this.group.name + ')' : this.$i18n.tc('component.review.label', 2)) : undefined
      }
    },
    watch: {
      searchFilters: {
        handler (val) {
          this.reviewsOptions.page = 1
          this.retrieveReviews()
        },
        deep: true
      },
      group: {
        handler (grp) {
          this.retrieveReviews()
        },
        deep: true
      },
      selectedItems: {
        handler (items) {
          if (items.length >= 10) {
            this.enableBulkCheck = true
          } else {
            this.enableBulkCheck = false
          }
          this.allPagesSelected = false
          this.selectedItemsTotal = items.length
        },
        deep: true
      },
      fetchTitleReviews () {
        this.retrieveReviews()
      },
      fetchEscalatedOnly () {
        this.retrieveReviews()
      }
    },
    async mounted() {
      this.checkForEditorialReviewOption()
    },
    methods: {
      async exportReviewRequests () {
        this.exportIsLoading = true

        const parameters = {
          _sort: this.reviewsOptions.sortBy[0].key,
          _order: this.reviewsOptions.sortBy[0].order || 'asc',
          offset: 0,
          limit: 500,
          componentToReview: this.reviewComponent.id,
          status: this.searchFilters.status,
          stdDesc: this.searchFilters.stdDesc,
          _embed: 'componentToReview,allocatedGroups',
        }

        if (this.fetchTitleReviews) {
          parameters.titlereviews = true
        }

        if (this.fetchEscalatedOnly) {
          parameters.escalatedOnly = true
        }

        let result = await this.catchError({
          promise: reviewServices.search({ parameters }, this.cancelToken.token),
          instance: this
        })

        let csvContent = {}
        if (result?.data?.data?.length > 0) {
            csvContent = this.prepareCSVExport(result.data.data)
        }

        const csvHeader = [{
          text: this.$i18n.t('component.label', 1),
          value: 'component'
        },
          {
            text: this.$i18n.t('component.title.ids.label', 1),
            value: 'title_id'
          },
          {
            text: 'Print-ISXN',
            value: 'pissn'
          },
          {
            text: 'E-ISXN',
            value: 'eissn'
          },
          {
            text: this.$i18n.t('component.review.stdDesc.label'),
            value: 'category'
          },
          /*{
            text: 'Bezeichnung',
            value: 'type'
          },*/
          {
            text: 'Link',
            value: 'link'
          },
          {
            text: this.$i18n.t('component.curatoryGroup.label'),
            value: 'curator'
          },
          {
            text: this.$i18n.t('default.date'),
            value: 'date'
          },
          {
            text: this.$i18n.t('component.review.status.label'),
            value: 'state'
          }
        ]

        let fileName = 'GOKB-RRs_'.concat(this.reviewComponent.name).concat('_' + new Date().toLocaleString('sv')).concat('.csv')

        exportServices.toTsv(
          csvHeader,
          csvContent,
          {'filename' : fileName}
        )

        this.exportIsLoading = false
      },
      prepareCSVExport (rrs) {

        let csvData = []

        for (let i = 0; i < rrs.length; i++) {
          let rr = rrs[i]
          let csvRow = {}

          csvRow.component = rr.componentToReview.name
          csvRow.title_id = rr._embedded.componentToReview.importId
          csvRow.pissn = rr._embedded.componentToReview._embedded.ids.filter(a => (a.namespace.value === 'issn' || a.namespace.value === 'pisbn'))[0]?.value
          csvRow.eissn = rr._embedded.componentToReview._embedded.ids.filter(a => (a.namespace.value === 'eissn' || a.namespace.value === 'isbn'))[0]?.value
          //csvRow.type = this.$i18n.t('component.review.stdDesc.' + rr.stdDesc.name + '.info')
          csvRow.category = rr.stdDesc?.name ? this.$i18n.t('component.review.stdDesc.' + rr.stdDesc.name + '.label') : this.$i18n.t('component.review.stdDesc.none.label')
          csvRow.link = `${this.reviewBaseUrl}${rr.id}`
          csvRow.curator = rr.allocatedGroups[0]?.name
          csvRow.date = new Date(rr.dateCreated).toLocaleString('sv')
          csvRow.state = this.$i18n.t('component.review.status.' + rr.status.name + '.label')

          csvData.push(csvRow)
        }

        return csvData
      },
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      resultPaginate (options) {
        this.successMessage = false

        if (options.sortBy) {
          this.reviewsOptions.sortBy = options.sortBy
        }

        if (!!options.itemsPerPage) {
          this.reviewsOptions.itemsPerPage = options.itemsPerPage
        }

        this.retrieveReviews()
      },
      async retrieveReviews () {
        this.selectedItems.length = 0
        this.selectedItemsTotal = 0
        this.$refs.rtable.clearSelection()
        this.loading = true

        const searchParams = {}

        Object.keys(this.searchFilters).forEach(key => {
          if (typeof this.searchFilters[key] === 'string' || typeof this.searchFilters[key] === 'number') {
            searchParams[key] = this.searchFilters[key]
          } else if (this.searchFilters[key] instanceof Object) {
            if (this.searchFilters[key].id) {
              searchParams[key] = this.searchFilters[key].id
            } else if (this.searchFilters[key].value) {
              searchParams[key] = this.searchFilters[key].value
            }
          }
        })

        if (this.group) {
          searchParams.allocatedGroups = this.group.id
        }

        if (this.reviewComponent) {
          searchParams.componentToReview = this.reviewComponent.id
        }

        if (this.fetchTitleReviews) {
          searchParams.titlereviews = true
        }

        if (this.fetchEscalatedOnly) {
          searchParams.escalatedOnly = true
        }

        const parameters = {
          ...(searchParams || {}),
          _sort: this.reviewsOptions.sortBy[0].key,
          _order: this.reviewsOptions.sortBy[0].order || 'asc',
          offset: this.reviewsOptions.page ? (this.reviewsOptions.page - 1) * this.reviewsOptions.itemsPerPage : 0,
          limit: this.reviewsOptions.itemsPerPage
        }
        this.rawReviews = await this.catchError({
          promise: reviewServices.search({ parameters }, this.cancelToken.token),
          instance: this
        })

        if (this.rawReviews?.data) {
          this.totalNumberOfItems = this.rawReviews?.data?._pagination?.total
        }

        this.loading = false
      },
      async closeReview (item) {
        this.allPagesSelected = false
        this.selectedItems = []

        const response = await this.catchError({
          promise: reviewServices.close(item.id, this.cancelToken.token),
          instance: this
        })

        if (response.status === 403) {
          this.errorMsg = 'error.update.403'
        }

        this.reviewsOptions.page = 1
        this.retrieveReviews()
        this.successMessage = this.$i18n.tc('component.review.edit.success.closed')
        this.$emit('update', this.totalNumberOfItems)
      },
      showAddReviewPopup () {
        this.addReviewPopupVisible = true
      },
      showAddExternalReviewPopup () {
        this.addExternalReviewPopupVisible = true
      },
      confirmBulkClose () {
        if (this.allPagesSelected) {
          this.actionToConfirm = '_executeBulkAction'
          this.messageToConfirm = { text: 'popups.confirm.close.list', vars: [this.totalNumberOfItems, this.$i18n.tc('component.review.label', this.selectedItems.length)] }
          this.parameterToConfirm = { field: 'status', value: 'Closed' }
          this.confirmationPopUpVisible = true
        } else {
          this.actionToConfirm = '_closeSelectedItems'
          this.messageToConfirm = { text: 'popups.confirm.close.list', vars: [this.selectedItems.length, this.$i18n.tc('component.review.label', this.selectedItems.length)] }
          this.parameterToConfirm = undefined
          this.confirmationPopUpVisible = true
        }
      },
      async _executeBulkAction ({ field, value }) {
        const searchParams = {}
        var missingContext = false

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

        if (this.reviewComponent) {
          searchParams.componentToReview = this.reviewComponent.id

          if (this.fetchTitleReviews) {
            searchParams.titlereviews = true
          }
        }
        else if (this.group) {
          searchParams.allocatedGroups = this.group
        }
        else {
          missingContext = true
        }

        if (!missingContext) {
          const response = await this.catchError({
            promise: reviewServices.bulkUpdate(searchParams, field, value, this.cancelToken.token),
            instance: this
          })

          if (response.status < 400) {
            this.successMessage = this.$i18n.tc('component.review.edit.success.closedBulk', response.data.report.total, { count: response.data.report.total })
          } else if (response.status === 403) {
            this.errorMsg = 'error.bulkUpdate.403'
          }
        }
        else {
          this.errorMsg = 'error.bulkUpdate.403'
        }

        this.reviewsOptions.page = 1
        this.retrieveReviews()
        this.$emit('update', this.totalNumberOfItems)
        this.loading = false
      },
      async _closeSelectedItems () {
        if (this.allPagesSelected) {
          this.allPagesSelected = false
        } else {
          this.loading = true
          await Promise.all(this.selectedItems.map(({ id }) =>
            this.catchError({
              promise: reviewServices.close(id, this.cancelToken.token),
              instance: this
            })
          ))

          this.successMessage = this.$i18n.tc('component.review.edit.success.closedBulk', this.selectedItems.length, { count: this.selectedItems.length })
          this.reviewsOptions.page = 1
          this.loading = false
          await this.retrieveReviews()
          this.$emit('update', this.totalNumberOfItems)
        }
      },
      async handlePopupChange (type) {
        this.successMessage = this.$i18n.t('component.review.edit.success.' + type)
        await this.retrieveReviews()
        this.$emit('update', this.totalNumberOfItems)
      },
      async checkForEditorialReviewOption() {
        const options_response = await this.catchError({
          promise: reviewServices.fetchEditorialGroups(this.cancelToken.token),
          instance: this
        })

        const profile_response = await profileServices.get(this.cancelToken.token)

        if (options_response.status === 200 && profile_response.status === 200) {
          let user_groups = profile_response.data.data.curatoryGroups
          let all_editorial_groups = options_response.data.external

          Object.values(options_response.data.typed).forEach (val => {
            if (!all_editorial_groups.some(item => (item === val))) {
              all_editorial_groups.push(val)
            }
          })

          for (const idx in all_editorial_groups) {
            if (user_groups.some(ug => (ug.id === all_editorial_groups[idx].id)) && (this.reviewComponent?.type === 'Journal' || this.reviewComponent?.type === 'Database')) {
              this.externalRequestEnabled = true
            }
          }
        }
      }
    }
  }
</script>
