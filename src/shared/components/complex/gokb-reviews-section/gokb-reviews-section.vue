<template>
  <gokb-section
    :expandable="expandable"
    filters
    :sub-title="title"
    :items-total="totalNumberOfReviews"
  >
    <template #buttons>
      <gokb-add-review-popup
        v-if="addReviewPopupVisible"
        v-model="addReviewPopupVisible"
        :component="reviewComponent"
        @added="retrieveReviews"
      />
      <span v-if="errorMsg">
        <v-alert
          type="error"
          dismissible
        >
          {{ localErrorMessage }}
        </v-alert>
      </span>
      <gokb-button
        v-if="enableBulkCheck && searchFilters.status.value === 'Open'"
        class="mr-4"
        icon-id="delete"
        color="primary"
        @click="confirmBulkClose"
      >
        {{ bulkCloseLabel }}
      </gokb-button>
      <v-spacer />
      <gokb-button
        v-if="!!reviewComponent"
        class="mr-4"
        icon-id="add"
        color="primary"
        @click="showAddReviewPopup"
      >
        {{ $t('btn.add') }}
      </gokb-button>
      <gokb-button
        :disabled="selectedItems.length == 0"
        icon-id="delete"
        color="primary"
        @click="confirmCloseSelectedItems"
      >
        {{ $t('btn.close') }}
      </gokb-button>
      <v-btn
        icon
        :title="$t('btn.refresh')"
        @click="retrieveReviews"
      >
        <v-icon>
          mdi-refresh
        </v-icon>
      </v-btn>
    </template>
    <template #search>
      <gokb-state-field
        v-model="searchFilters.stdDesc"
        class="mr-4"
        message-path="component.review.stdDesc"
        url="refdata/categories/ReviewRequest.StdDesc"
        :label="$t('component.review.type')"
      />
      <gokb-state-field
        v-model="searchFilters.status"
        class="mr-4"
        width="200px"
        :init-item="$t('component.review.status.Open.label')"
        message-path="component.review.status"
        url="refdata/categories/ReviewRequest.Status"
        :label="$t('component.general.status.label')"
        return-object
      />
    </template>
    <gokb-confirmation-popup
      v-model="confirmationPopUpVisible"
      :message="messageToConfirm"
      @confirmed="executeAction(actionToConfirm, parameterToConfirm)"
    />
    <gokb-table
      :items="reviews"
      :headers="reviewHeaders"
      :editable="!!group"
      :total-number-of-items="totalNumberOfReviews"
      :options.sync="reviewsOptions"
      @selected-items="selectedItems = $event"
      @paginate="retrieveReviews"
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
      }
    },
    data () {
      return {
        rawReviews: undefined,
        confirmationPopUpVisible: false,
        addReviewPopupVisible: undefined,
        allPagesSelected: false,
        enableBulkCheck: false,
        errorMsg: undefined,
        selectedItems: [],
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
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
      reviewHeaders () {
        return [
          { text: this.$i18n.t('component.review.componentToReview'), align: 'left', value: 'popup', sortable: false },
          { text: this.$i18n.t('component.general.status.label'), align: 'left', value: 'statusLabel', sortable: false, width: '10%' },
          { text: this.$i18n.tc('component.review.stdDesc.label'), align: 'left', value: 'stdDescLabel', sortable: false, width: '20%' },
          { text: this.$i18n.t('component.review.type'), align: 'left', value: 'type', sortable: false, width: '10%' },
          { text: this.$i18n.t('component.general.dateCreated'), align: 'left', value: 'dateCreated', sortable: false },
        ]
      },
      bulkCloseLabel () {
        return this.$i18n.t('btn.bulkSetStatus', [this.totalNumberOfReviews, this.$i18n.t('component.review.status.Closed.label')])
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
          const stdDescLabel = entry?.stdDesc && this.$i18n.t('component.review.stdDesc.' + entry?.stdDesc.name + '.label')
          const updateUrl = entry?._links.update.href
          const deleteUrl = entry?._links.delete.href
          const popup = { value: (component.name || type + ' ' + component.id), label: 'review', type: 'GokbAddReviewPopup' }
          const link = { value: component.name, route: componentRoutes[entry?.componentToReview?.type?.toLowerCase()], id: 'componentId' }
          return { id, name, status, dateCreated, statusLabel, stdDescLabel, component, popup, type, stdDesc, link, componentId, request, description, updateUrl, deleteUrl }
        })
      },
      totalNumberOfReviews () {
        return this.rawReviews?.data?._pagination?.total || 0
      },
      isContrib () {
        return this.loggedIn && account.hasRole('ROLE_CONTRIBUTOR')
      },
      localErrorMessage () {
        return this.errorMsg ? this.$i18n.t(this.errorMsg, [this.$i18n.tc('component.review.label', 2)]) : undefined
      },
      localizedReviewHeaders () {
        return [
          {
            text: this.$i18n.t('component.review.componentToReview'),
            align: 'left',
            sortable: false,
            value: 'popup'
          },
          {
            text: this.$i18n.t('component.title.type.label'),
            align: 'left',
            sortable: false,
            value: 'type'
          },
          {
            text: this.$i18n.tc('component.review.stdDesc.label'),
            align: 'left',
            sortable: false,
            value: 'stdDesc.name'
          },
          {
            text: this.$i18n.t('component.general.status'),
            align: 'left',
            sortable: false,
            value: 'status.name'
          },
          {
            text: this.$i18n.t('component.general.dateCreated'),
            align: 'left',
            sortable: false,
            value: 'dateCreated'
          },
        ]
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
          this.allPagesSelected = false
          this.enableBulkCheck = false
        }
      }
    },
    methods: {
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      async retrieveReviews () {
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
      },
      confirmCloseSelectedItems () {
        this.actionToConfirm = '_closeSelectedItems'
        this.messageToConfirm = { text: 'popups.confirm.close.list', vars: [this.selectedItems.length, this.$i18n.tc('component.review.label', this.selectedItems.length)] }
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      showAddReviewPopup () {
        this.addReviewPopupVisible = 1
      },
      confirmBulkClose () {
        this.actionToConfirm = '_executeBulkAction'
        this.messageToConfirm = { text: 'popups.confirm.close.list', vars: [this.totalNumberOfReviews, this.$i18n.tc('component.review.label', this.selectedItems.length)] }
        this.parameterToConfirm = { field: 'status', value: 'Closed' }
        this.confirmationPopUpVisible = true
      },
      async _executeBulkAction ({ field, value }) {
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

        const response = await this.catchError({
          promise: reviewServices.bulkUpdate(searchParams, field, value, this.cancelToken.token),
          instance: this
        })

        if (response.status === 403) {
          this.errorMsg = 'error.bulkUpdate.403'
        }

        this.selectedItems = []
        this.reviewsOptions.page = 1
        this.retrieveReviews()
      },
      async _closeSelectedItems () {
        if (this.allPagesSelected) {
          this.allPagesSelected = false
        } else {
          await Promise.all(this.selectedItems.map(({ id }) =>
            this.catchError({
              promise: reviewServices.closeReview(id, this.cancelToken.token),
              instance: this
            })
          ))

          this.selectedItems = []
          this.reviewsOptions.page = 1
          this.retrieveReviews()
        }
      },
    }
  }
</script>
