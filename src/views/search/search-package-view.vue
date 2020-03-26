<script>
  import BaseSearch from './base-search-view'
  import baseServices from '@/shared/services/base-services'

  export default {
    name: 'SearchPackage',
    extends: BaseSearch,
    computed: {
      isDeleteSelectedDisabled () {
        return !this.selectedItems.length
      }
    },
    async created () {
      this.title = 'Pakete'
      this.resultActionButtons = [
        {
          icon: 'import_export',
          label: 'Export',
          route: undefined,
        },
        {
          icon: 'clear',
          label: 'Archivieren',
          disabled: 'isDeleteSelectedDisabled',
          action: '_confirmRetireSelectedItems',
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
            properties: {
              label: 'Name',
            }
          },
          {
            type: 'GokbSelectField',
            name: 'curatory',
            properties: {
              label: 'Kuratoren',
              multiple: true,
              // items: allCuratorGroups.values.map(({ id: value, text }) => ({ value, text })),
            }
          }
        ],
        [
          {
            type: 'GokbSearchProviderField',
            name: 'provider'
          },
          {
            type: 'GokbTextField',
            name: 'identifier',
            properties: {
              label: 'Identifier'
            }
          }
        ],
        [
          {
            type: 'GokbSelectField',
            properties: {
              label: 'Status',
              // items: allStates.values.map(({ id: value, text }) => ({ value, text })),
            }
          },
        ]
      ]
      this.resultHeaders = [
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        {
          text: 'Provider',
          align: 'left',
          sortable: false,
          value: 'providerName'
        },
        {
          text: 'Plattform',
          align: 'left',
          sortable: false,
          value: 'nominalPlatformName'
        },
      ]
      this.searchServicesUrl = 'rest/packages'
      this.searchServiceIncludes = 'id,name,provider,nominalPlatform,_links'
    },
    methods: {
      _transformForTable (data) {
        return data.map(({ id, name, provider, nominalPlatform, _links: { delete: deleteUrl, retire: retireUrl } }) => ({
          id,
          name,
          providerName: provider?.name,
          nominalPlatformName: nominalPlatform?.name,
          deleteUrl: deleteUrl?.href,
          retireUrl: retireUrl?.href,
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
