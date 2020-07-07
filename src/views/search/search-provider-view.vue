<script>
  import BaseSearch from './base-search-view'
  import GokbIdentifierField from '@/shared/components/simple/gokb-search-identifier-field'
  import { EDIT_PROVIDER_ROUTE, ADD_PROVIDER_ROUTE } from '@/router/route-paths'
  import providerServices from '@/shared/services/provider-services'

  export default {
    name: 'SearchProvider',
    components: { GokbIdentifierField },
    extends: BaseSearch,
    data () {
      return {
        name: undefined,
        identifier: undefined,
        curatoryGroupIds: undefined
      }
    },
    async created () {
      this.title = 'Provider'
      this.resultActionButtons = [
        {
          icon: 'add',
          label: 'Hinzufügen',
          route: ADD_PROVIDER_ROUTE,
        },
        {
          icon: 'clear',
          label: 'Archivieren',
          disabled: 'isNothingSelected',
          action: '_confirmArchiveSelectedItems',
        },
        {
          icon: 'delete',
          label: 'Löschen',
          disabled: 'isNothingSelected',
          action: '_confirmDeleteSelectedItems',
        },
      ]
      this.searchInputFields = [
        [
          {
            type: 'GokbTextField',
            name: 'name',
            value: this.name,
            properties: {
              label: 'Name'
            }
          },
          {
            type: 'GokbIdentifierField',
            name: 'ids',
            value: this.identifier,
          }
        ],
        [
          {
            type: 'GokbCuratoryGroupField',
            name: 'curatoryGroupId',
            value: this.curatoryGroupIds,
            properties: {
              label: 'Kuratoren',
              multiple: true,
              returnObject: false
            }
          },
        ],
      ]
      this.resultHeaders = [
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'link'
        },
      ]
      this.searchServicesUrl = 'rest/provider'
      this.searchServiceIncludes = 'id,name'
    },
    methods: {
      _transformForTable (data) {
        return data.map(({
          id,
          name,
          _links: { delete: { href: deleteUrl }, retire: { href: retireUrl } }
        }) => ({
          id,
          link: { value: name, route: EDIT_PROVIDER_ROUTE, id: 'id' },
          isDeletable: !!deleteUrl,
          isRetireable: !!retireUrl,
          deleteUrl,
          retireUrl
        }))
      },
      _confirmArchiveSelectedItems () {
        this.actionToConfirm = '_archiveSelectedItems'
        this.messageToConfirm = 'Wollen Sie die ausgewählten Elemente wirklich archivieren?'
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      _confirmDeleteSelectedItems () {
        this.actionToConfirm = '_deleteSelectedItems'
        this.messageToConfirm = 'Wollen Sie die ausgewählten Elemente wirklich löschen?'
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      async _archiveSelectedItems () {
        await Promise.all(this.selectedItems.map(({ retireUrl }) =>
          this.catchError({
            promise: providerServices.archiveProvider(retireUrl, this.cancelToken.token),
            instance: this
          })
        ))
        this.resultPaginate(this.resultOptions.page)
      },
      async _deleteSelectedItems () {
        await Promise.all(this.selectedItems.map(({ deleteUrl }) =>
          this.catchError({
            promise: providerServices.deleteProvider(deleteUrl, this.cancelToken.token),
            instance: this
          })
        ))
        this.resultPaginate(this.resultOptions.page)
      },
    }
  }
</script>
