<template>
  <gokb-section
    v-model="expanded"
    :expandable="expandable"
    :filters="showEditActions"
    :sub-title="title"
    :errors="!!apiErrors"
    :show-actions="showEditActions"
    :items-total="totalNumberOfItems"
  >
    <template #buttons>
      <v-switch
        v-if="!!reviewComponent"
        v-model="fetchTitleReviews"
        class="pt-4 pr-6"
        :label="$tc('component.title.label', 2)"
      />
      <gokb-state-field
        v-model="searchFilters.stdDesc"
        class="mr-4 mt-4"
        message-path="component.review.stdDesc"
        url="refdata/categories/ReviewRequest.StdDesc"
        :label="$t('component.review.type.label')"
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
        style="margin-top:-4px"
        @click="retrieveReviews"
      >
        <v-icon>
          mdi-refresh
        </v-icon>
      </v-btn>
      <gokb-add-review-popup
        v-if="addReviewPopupVisible"
        v-model="addReviewPopupVisible"
        :component="reviewComponent"
        @edit="handlePopupChange"
      />
      <gokb-button
        v-if="!!reviewComponent"
        class="mr-4"
        icon-id="mdi-plus"
        color="primary"
        @click="showAddReviewPopup"
      >
        {{ $t('btn.add') }}
      </gokb-button>
    </template>
    <template #actions>
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
      :options.sync="reviewsOptions"
      :actions="showEditActions"
      :show-loading="loading"
      :hide-select="!showEditActions"
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
  import BaseComponent from '@/shared/components/base-component'
  import account from '@/shared/models/account-model'

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
      }
    },
    data () {
      return {
        rawReviews: undefined,
        confirmationPopUpVisible: false,
        addReviewPopupVisible: undefined,
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
        totalNumberOfItems: 0,
        messageToConfirm: undefined,
        reviewsOptions: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE,
          mustSort: true,
          sortBy: [{ key:'dateCreated', order: 'asc' }],
          desc: false
        },
        reviewsRaisedBy: undefined,
        searchFilters: {
          status: undefined,
          stdDesc: undefined
        }
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
          const groupsList = entry.allocatedGroups.map(ag => ag.name)
          const isClosable = !!(status?.name === 'Open' && updateUrl)
          return { id, status, dateCreated, statusLabel, stdDescLabel, groupsList, component, popup, type, stdDesc, link, componentId, request, description, updateUrl, deleteUrl, isClosable }
        })
      },
      isContrib () {
        return account.loggedIn() && account.hasRole('ROLE_CONTRIBUTOR')
      },
      showEditActions () {
        return this.reviews && (this.reviews?.filter(item => (item.updateUrl)).length > 0)
      },
      bulkEditDisabled () {
        return !this.reviews || this.selectedItems.length === 0 || this.selectedItems.some(item => (item.updateUrl === null))
      },
      localErrorMessage () {
        return this.errorMsg ? this.$i18n.t(this.errorMsg, [this.$i18n.tc('component.review.label', 2)]) : undefined
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
            width: '20%',
            key: 'dateCreated'
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
            width: '15%',
            key: 'dateCreated'
          }
        ]
        const defaultConfig = [
          {
            title: this.$i18n.t('component.review.componentToReview.label'),
            align: 'start',
            sortable: false,
            key: 'popup'
          },
          {
            title: this.$i18n.t('component.title.type.label'),
            align: 'start',
            sortable: false,
            width: '10%',
            key: 'type'
          },
          {
            title: this.$i18n.tc('component.review.stdDesc.label'),
            align: 'start',
            sortable: false,
            width: '20%',
            key: 'stdDescLabel'
          },
          {
            title: this.$i18n.t('component.general.status.label'),
            align: 'start',
            sortable: false,
            width: '40px',
            key: 'statusLabel'
          },
          {
            title: this.$i18n.t('component.general.dateCreated'),
            align: 'end',
            sortable: true,
            width: '15%',
            value: 'dateCreated'
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
      }
    },
    methods: {
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      resultPaginate (options) {
        this.successMessage = false

        if (options.sortBy) {
          this.resultOptions.sortBy = options.sortBy
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

        if (this.group) {
          searchParams.allocatedGroups = this.group.id
        }

        if (this.reviewComponent) {
          searchParams.componentToReview = this.reviewComponent.id
        }

        if (this.fetchTitleReviews) {
          searchParams.titlereviews = true
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
        this.addReviewPopupVisible = 1
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
      }
    }
  }
</script>
