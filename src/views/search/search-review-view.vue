<script>
  import BaseSearch from './base-search-view'
  import reviewServices from '@/shared/services/review-services'

  export default {
    name: 'SearchReview',
    extends: BaseSearch,
    data () {
      return {
        searchFilters: {
          curatoryGroupIds: [],
          identifierValue: undefined,
          componentToReview: undefined,
          status: undefined,
          name: undefined,
        },
        allStates: [
          { name: this.$i18n.t(), id: 'Open' },
          { name: this.$i18n.t(), id: 'Closed' }
        ]
      }
    },
    created () {
      this.title = 'Reviews'
      this.component = 'g:reviewRequests'
      this.resultActionButtons = [
        {
          icon: 'clear',
          label: this.$i18n.t('btn.close'),
          disabled: 'isNothingSelected',
          action: '_confirmCloseSelectedItems',
        }
      ]

      this.searchInputFields = [
        [
          {
            type: 'GokbTextField',
            name: 'cause',
            properties: {
              label: this.$i18n.t('component.review.cause')
            }
          },
          {
            type: 'GokbCuratoryGroupField',
            name: 'allocatedGroups',
            value: 'curatoryGroupIds',
            properties: {
              label: this.$i18n.tc('component.curatoryGroup.label'),
              returnObject: false
            }
          }
        ],
        [
          {
            type: 'GokbSelectField',
            name: 'componentToReview',
            value: 'componentToReview',
            properties: {
              label: this.$i18n.t('component.review.componentToReview')
            }
          }
        ],
        [
          {
            type: 'GokbStateField',
            name: 'stdDesc',
            value: 'stdDesc',
            properties: {
              label: this.$i18n.tc('component.review.stdDesc.label'),
              messagePath: 'component.review.stdDesc',
              url: 'refdata/categories/ReviewRequest.StdDesc'
            }
          },
          {
            type: 'GokbStateField',
            name: 'status',
            value: 'status',
            properties: {
              label: this.$i18n.tc('component.general.status'),
              initItem: 'Open',
              messagePath: 'component.review.status',
              url: 'refdata/categories/ReviewRequest.Status'
            }
          }
        ]
      ]
      this.resultHeaders = [
        {
          text: this.$i18n.t('component.review.request'),
          align: 'left',
          sortable: false,
          value: 'popup'
        },
        {
          text: this.$i18n.t('component.review.type'),
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
      ]
      this.searchServicesUrl = 'rest/reviews'
      // this.searchServiceIncludes = 'id,'
    },
    methods: {
      _transformForTable (data) {
        const componentRoutes = {
          package: '/package',
          org: '/provider',
          title: '/title',
          journal: '/title',
          book: '/title',
          database: '/title'
        }

        return data.map(({ id, reviewRequest, dateCreated, _embedded: { allocatedGroups }, componentToReview, descriptionOfCause, status, stdDesc, _links: { update: { href: updateUrl } }, _links: { delete: { href: deleteUrl } } }) => ({
          id,
          component: componentToReview,
          componentId: componentToReview.id,
          type: this.$i18n.tc('component.' + componentToReview.type.toLowerCase() + '.label'),
          dateCreated: new Date(dateCreated).toLocaleString(this.$i18n.locale),
          allocatedGroups,
          request: reviewRequest,
          description: descriptionOfCause,
          status,
          stdDesc,
          popup: { value: (componentToReview.name || componentToReview.type + ' ' + componentToReview.id), label: 'review', type: 'GokbAddReviewPopup' },
          link: { value: componentToReview.name, route: componentRoutes[componentToReview.type.toLowerCase()], id: 'componentId' },
          updateUrl,
          deleteUrl
        }))
      },
      _confirmCloseSelectedItems () {
        this.actionToConfirm = '_closeSelectedItems'
        this.messageToConfirm = { text: 'popups.confirm.close.list', vars: [this.selectedItems.length, this.$i18n.tc('component.review.label', this.selectedItems.length)] }
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      async _closeSelectedItems () {
        await Promise.all(this.selectedItems.map(({ updateUrl }) =>
          this.catchError({
            promise: reviewServices.closeReview(updateUrl, this.cancelToken.token),
            instance: this
          })
        ))
        this.resultPaginate(this.resultOptions.page)
      },
    }
  }
</script>
