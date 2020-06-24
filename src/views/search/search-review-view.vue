<script>
  import BaseSearch from './base-search-view'
  import reviewServices from '@/shared/services/review-services'

  export default {
    name: 'SearchReview',
    extends: BaseSearch,
    created () {
      this.title = 'Reviews'
      this.component = 'g:reviewRequests'
      this.resultActionButtons = [
        {
          icon: 'clear',
          label: 'Schließen',
          disabled: 'isNothingSelected',
          action: '_confirmCloseSelectedItems',
        }
      ]

      this.searchInputFields = [
        [
          {
            type: 'GokbTextField',
            name: 'name',
            properties: {
              label: 'Name/Titel'
            }
          },
          {
            type: 'GokbSearchUserField',
            name: 'raisedby',
            properties: {
              label: 'Ersteller',
              multiple: true,
            },
          }
        ],
        [
          {
            type: 'GokbSelectField',
            properties: {
              label: 'Komponente'
            }
          },
          {
            type: 'GokbSearchUserField',
            name: 'allocatedto',
            properties: {
              label: 'Reviewer',
              multiple: true,
            },
          }
        ],
        [
          {
            type: 'GokbCuratoryGroupField',
            name: 'curatoryGroupId',
            properties: {
              returnObject: false
            }
          },
          {
            type: 'GokbCheckboxField',
            properties: {
              label: 'Abgeschlossene Anzeigen'
            }
          }
        ]
      ]
      this.resultHeaders = [
        {
          text: 'Titel/Name',
          align: 'left',
          sortable: false,
          value: 'link'
        },
        // {
        //   text: 'Typ',
        //   align: 'left',
        //   sortable: false,
        //   value: 'Typ'
        // },
        {
          text: 'Ersteller',
          align: 'left',
          sortable: false,
          value: 'raisedBy'
        },
        {
          text: 'Reviewer',
          align: 'left',
          sortable: false,
          value: 'allocatedTo'
        },
      ]
      this.searchServicesUrl = 'rest/reviews'
      // this.searchServiceIncludes = 'id,'
    },
    methods: {
      _transformForTable (data) {
        return data.map(({ id, reviewRequest, raisedBy, allocatedTo, _links: { update: { href: updateUrl } } }) => ({
          id,
          link: { value: reviewRequest, /* route: EDIT_USER_ROUTE , */ id: 'id' },
          raisedBy: raisedBy?.name,
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
