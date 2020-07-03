<script>
  import BaseSearch from './base-search-view'
  import { EDIT_TITLE_ROUTE } from '@/router/route-paths'
  import baseServices from '@/shared/services/base-services'

  export default {
    name: 'SearchTitle',
    extends: BaseSearch,
    data () {
      return {
        name: undefined,
        identifierIds: undefined,
        publisherId: undefined,
        type: undefined,
        status: undefined,
      }
    },
    computed: {
      isDeleteSelectedDisabled () {
        return !this.selectedItems.length
      }
    },
    async created () {
      this.title = 'Titel'
      this.resultActionButtons = [
        {
          icon: 'clear',
          label: 'Archivieren',
          disabled: 'isDeleteSelectedDisabled',
          action: '_confirmRetireSelectedItems'
        },
        {
          icon: 'delete',
          label: 'Löschen',
          disabled: 'isDeleteSelectedDisabled',
          action: '_confirmDeleteSelectedItems',
        }
      ]

      this.searchInputFields = [
        [
          {
            type: 'GokbTextField',
            name: 'name',
            value: this.name,
            properties: {
              label: 'Name/Titel'
            }
          },
          {
            type: 'GokbSearchIdentifierField',
            name: 'ids',
            value: this.identifierIds,
          }
        ],
        [
          {
            type: 'GokbSearchPublisherField',
            name: 'publisher',
            value: this.publisherId
          },
          {
            type: 'GokbSelectField',
            name: 'qp_medium',
            properties: {
              label: 'Typ',
              // items: allTypes.values.map(({ id: value, text }) => ({ value, text })),
            }
          }
        ],
        [
          {
            type: 'GokbStateField',
            name: 'status',
          }
        ]
      ]
      this.resultHeaders = [
        {
          text: 'Name/Titel',
          align: 'left',
          sortable: false,
          value: 'link'
        },
        {
          text: 'Typ',
          align: 'left',
          sortable: false,
          value: 'type'
        },
        {
          text: 'Veröffentlicht von',
          align: 'right',
          sortable: false,
          value: 'createdBy'
        },
        {
          text: 'Veröffentlicht bis',
          align: 'right',
          sortable: false,
          value: 'createdUntil'
        },
      ]
      this.searchServicesUrl = 'rest/titles'
      this.searchServiceIncludes = 'id,name,publisher,_links'
    },
    methods: {
      _transformForTable (data) {
        return data.map(({
          id,
          name,
          provider,
          nominalPlatform,
          _links: { delete: { href: deleteUrl }, retire: { href: retireUrl } }
        }) => ({
          id,
          link: { value: name, route: EDIT_TITLE_ROUTE, id: 'id' },
          providerName: provider?.name,
          nominalPlatformName: nominalPlatform?.name,
          isDeletable: !!deleteUrl,
          deleteUrl: deleteUrl,
          retireUrl: retireUrl,
        }))
      },
      _confirmDeleteSelectedItems () {
        this.actionToConfirm = '_deleteSelectedItems'
        this.messageToConfirm = 'Wollen Sie die ausgewählten Elemente wirklich löschen?'
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      async _deleteSelectedItems () {
        await Promise.all(this.selectedItems.map(({ deleteUrl }) => this._executeDeleteItemService(deleteUrl)))
        this.resultPaginate(this.resultOptions.page)
      },
      _confirmRetireSelectedItems () {
        this.actionToConfirm = '_retireSelectedItems'
        this.messageToConfirm = 'Wollen Sie die ausgewählten Elemente wirklich archivieren?'
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      async _retireSelectedItems () {
        await Promise.all(this.selectedItems.map(({ retireUrl }) =>
          this.catchError({
            promise: baseServices.request({ method: 'POST', url: retireUrl }, this.cancelToken.token),
            instance: this
          })
        ))
        this.resultPaginate(this.resultOptions.page)
      },
    }
  }
</script>
