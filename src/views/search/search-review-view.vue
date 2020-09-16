<script>
  import BaseSearch from './base-search-view'
  import reviewServices from '@/shared/services/review-services'

  export default {
    name: 'SearchReview',
    extends: BaseSearch,
    data () {
      return {
        name: undefined,
        identifier: undefined,
        curatoryGroupIds: undefined,
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
            name: 'curatoryGroups',
            properties: {
              label: this.$i18n.tc('component.curatoryGroup.label'),
              returnObject: false
            }
          }
        ],
        [
          {
            type: 'GokbSelectField',
            properties: {
              label: this.$i18n.t('component.review.componentToReview')
            }
          }
        ],
        [
          {
            type: 'GokbCheckboxField',
            name: 'status',
            properties: {
              label: this.$i18n.t('component.review.showClosed'),
              items: this.allItems
            }
          }
        ]
      ]
      this.resultHeaders = [
        {
          text: this.$i18n.t('component.review.request'),
          align: 'left',
          sortable: false,
          value: 'link'
        },
        {
          text: this.$i18n.t('component.review.type'),
          align: 'left',
          sortable: false,
          value: 'stdDesc'
        },
      ]
      this.searchServicesUrl = 'rest/reviews'
      // this.searchServiceIncludes = 'id,'
    },
    methods: {
      _transformForTable (data) {
        return data.map(({ id, reviewRequest, raisedBy, allocatedTo, stdDesc, _links: { update: { href: updateUrl } } }) => ({
          id,
          link: { value: reviewRequest, /* route: EDIT_USER_ROUTE , */ id: 'id' },
          raisedBy: raisedBy?.name,
          stdDesc: stdDesc?.value,
          allocatedTo: allocatedTo?.name,
          updateUrl
        }))
      },
      _confirmCloseSelectedItems () {
        this.actionToConfirm = '_closeSelectedItems'
        this.messageToConfirm = 'Wollen Sie die ausgewählten Reviews wirklich schließen?'
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
