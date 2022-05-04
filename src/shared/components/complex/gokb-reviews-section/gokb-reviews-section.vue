<template>
  <gokb-section
    :expandable="expandable"
    :filters="showEditActions"
    :sub-title="title"
    :errors="!!apiErrors"
    :show-actions="showEditActions"
    :items-total="totalNumberOfReviews"
  >
    <template #buttons>
      <v-switch
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
        :init-item="$t('component.review.status.Open.label')"
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
    </template>
    <gokb-confirmation-popup
      v-model="confirmationPopUpVisible"
      :message="messageToConfirm"
      @confirmed="executeAction(actionToConfirm, parameterToConfirm)"
    />
    <gokb-table
      :items="reviews"
      :headers="localizedReviewHeaders"
      :editable="showEditActions"
      :total-number-of-items="totalNumberOfReviews"
      :options.sync="reviewsOptions"
      :actions="showEditActions"
      :show-loading="loading"
      @selected-items="selectedItems = $event"
      @paginate="retrieveReviews"
      @edit="handlePopupChange"
      @close-review="closeReview"
    />
  </gokb-section>
</template>

<script>
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import GokbAddReviewPopup from '@/shared/popups/gokb-add-review-popup'
  import reviewServices from '@/shared/services/review-services'
  import BaseComponent from '@/shared/components/base-component'
  import account from '@/shared/models/account-model'

  const ROWS_PER_PAGE = 10

  export default {
    name: 'GokbReviewsSection',
    components: {
      GokbConfirmationPopup,
      GokbAddReviewPopup
    },
    extends: BaseComponent,
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
        loading: false,
        selectedItems: [],
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        fetchTitleReviews: false,
        messageToConfirm: undefined,
        reviewsOptions: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
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
        return !this.selectedItems.length
      },
      reviewStates () {
        return [
          { text: this.$i18n.t('component.review.status.Open.label'), value: 'Open' },
          { text: this.$i18n.t('component.review.status.Closed.label'), value: 'Closed' },
          { text: this.$i18n.t('component.review.status.Deleted.label'), value: 'Deleted' }
        ]
      },
      bulkCloseLabel () {
        return this.$i18n.t('btn.bulkCloseReview', [(this.allPagesSelected ? this.totalNumberOfReviews : this.selectedItems.length)])
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
          const popup = { value: this.reviewComponent ? stdDescLabel : (component.name || type + ' ' + component.id), label: 'review', type: 'GokbAddReviewPopup' }
          const link = { value: component.name, route: componentRoutes[entry?.componentToReview?.type?.toLowerCase()], id: 'componentId' }
          const groupsList = entry.allocatedGroups.map(ag => ag.name)
          const isClosable = !!(status?.name === 'Open' && updateUrl)
          return { id, name, status, dateCreated, statusLabel, stdDescLabel, groupsList, component, popup, type, stdDesc, link, componentId, request, description, updateUrl, deleteUrl, isClosable }
        })
      },
      totalNumberOfReviews () {
        return this.rawReviews?.data?._pagination?.total || 0
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
            text: this.$i18n.tc('component.review.stdDesc.label'),
            align: 'left',
            sortable: false,
            width: '100%',
            value: 'popup'
          },
          {
            text: this.$i18n.t('component.general.status.label'),
            align: 'left',
            sortable: false,
            width: '10%',
            value: 'statusLabel'
          },
          {
            text: this.$i18n.t('component.general.dateCreated'),
            align: 'right',
            sortable: false,
            width: '10%',
            value: 'dateCreated'
          }
        ]
        const pkgTitlesConfig = [
          {
            text: this.$i18n.tc('component.review.stdDesc.label'),
            align: 'left',
            sortable: false,
            width: '100%',
            value: 'popup'
          },
          {
            text: this.$i18n.tc('component.curatoryGroup.label', 2),
            align: 'left',
            sortable: false,
            value: 'groupsList'
          },
          {
            text: this.$i18n.t('component.general.status.label'),
            align: 'left',
            sortable: false,
            width: '10%',
            value: 'statusLabel'
          },
          {
            text: this.$i18n.t('component.general.dateCreated'),
            align: 'right',
            sortable: false,
            width: '10%',
            value: 'dateCreated'
          }
        ]
        const defaultConfig = [
          {
            text: this.$i18n.t('component.review.componentToReview.label'),
            align: 'left',
            sortable: false,
            value: 'popup'
          },
          {
            text: this.$i18n.t('component.title.type.label'),
            align: 'left',
            sortable: false,
            width: '10%',
            value: 'type'
          },
          {
            text: this.$i18n.tc('component.review.stdDesc.label'),
            align: 'left',
            sortable: false,
            width: '20%',
            value: 'stdDescLabel'
          },
          {
            text: this.$i18n.t('component.general.status.label'),
            align: 'left',
            sortable: false,
            width: '10%',
            value: 'statusLabel'
          },
          {
            text: this.$i18n.t('component.general.dateCreated'),
            align: 'right',
            sortable: false,
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
      'selectedItems.length' (length) {
        if (length >= 10) {
          this.enableBulkCheck = true
        } else {
          this.enableBulkCheck = false
        }
        this.allPagesSelected = false
      },
      fetchTitleReviews () {
        this.retrieveReviews()
      }
    },
    methods: {
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      async retrieveReviews () {
        this.selectedItems = []
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
          offset: this.reviewsOptions.page ? (this.reviewsOptions.page - 1) * this.reviewsOptions.itemsPerPage : 0,
          limit: this.reviewsOptions.itemsPerPage
        }
        this.rawReviews = await this.catchError({
          promise: reviewServices.get({ parameters }, this.cancelToken.token),
          instance: this
        })

        if (this.rawReviews?.data) {
          this.$emit('update', this.rawReviews.data.data.length)
        }

        this.loading = false
      },
      async closeReview (item) {
        this.allPagesSelected = false
        this.selectedItems = []

        const response = await this.catchError({
          promise: reviewServices.closeReview(item.id, this.cancelToken.token),
          instance: this
        })

        if (response.status === 403) {
          this.errorMsg = 'error.update.403'
        }

        this.reviewsOptions.page = 1
        this.retrieveReviews()
        this.successMessage = this.$i18n.tc('component.review.edit.success.closed')
        this.$emit('update', true)
      },
      showAddReviewPopup () {
        this.addReviewPopupVisible = 1
      },
      confirmBulkClose () {
        if (this.allPagesSelected) {
          this.actionToConfirm = '_executeBulkAction'
          this.messageToConfirm = { text: 'popups.confirm.close.list', vars: [this.totalNumberOfReviews, this.$i18n.tc('component.review.label', this.selectedItems.length)] }
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
          promise: reviewServices.bulkUpdate(searchParams, field, value, this.cancelToken.token),
          instance: this
        })

        if (response.status < 400) {
          this.successMessage = this.$i18n.tc('component.review.edit.success.closed', response.data.report.data, { count: response.data.report.data })
        } else if (response.status === 403) {
          this.errorMsg = 'error.bulkUpdate.403'
        }

        this.loading = false

        this.reviewsOptions.page = 1
        this.retrieveReviews()
        this.$emit('update', true)
      },
      async _closeSelectedItems () {
        if (this.allPagesSelected) {
          this.allPagesSelected = false
        } else {
          this.loading = true
          await Promise.all(this.selectedItems.map(({ id }) =>
            this.catchError({
              promise: reviewServices.closeReview(id, this.cancelToken.token),
              instance: this
            })
          ))

          this.successMessage = this.$i18n.tc('component.review.edit.success.closed', this.selectedItems.length, { count: this.selectedItems.length })
          this.reviewsOptions.page = 1
          this.loading = false

          this.retrieveReviews()
          this.$emit('update', true)
        }
      },
      handlePopupChange (type) {
        this.successMessage = this.$i18n.t('component.review.edit.success.' + type)
        this.retrieveReviews()
        this.$emit('update', true)
      }
    }
  }
</script>
