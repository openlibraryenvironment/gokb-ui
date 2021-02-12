<script>
  import BaseSearch from './base-search-view'
  import GokbIdentifierField from '@/shared/components/simple/gokb-search-identifier-field'
  import { EDIT_PROVIDER_ROUTE } from '@/router/route-paths'
  import providerServices from '@/shared/services/provider-services'

  export default {
    name: 'SearchProvider',
    components: { GokbIdentifierField },
    extends: BaseSearch,
    data () {
      return {
        searchFilters: {
          name: undefined,
          identifier: undefined,
          curatoryGroupIds: undefined
        }
      }
    },
    async created () {
      this.title = this.$i18n.tc('component.provider.label', 2)
      this.resultActionButtons = [
        {
          icon: 'clear',
          label: this.$i18n.t('btn.retire'),
          disabled: 'isNothingSelected',
          action: '_confirmArchiveSelectedItems',
        },
        {
          icon: 'delete',
          label: this.$i18n.t('btn.delete'),
          disabled: 'isNothingSelected',
          action: '_confirmDeleteSelectedItems',
        },
      ]
      this.searchInputFields = [
        [
          {
            type: 'GokbTextField',
            name: 'name',
            properties: {
              label: this.$i18n.t('component.general.name')
            }
          },
          {
            type: 'GokbTextField',
            name: 'ids',
            value: 'identifier',
            properties: {
              entity: 'Org', // means Provider ;-)
              label: this.$i18n.tc('component.identifier.label')
            }
          },
          {
            type: 'GokbCuratoryGroupField',
            name: 'curatoryGroups',
            value: 'curatoryGroupIds',
            properties: {
              label: this.$i18n.tc('component.curatoryGroup.label'),
              multiple: true,
              returnObject: false
            }
          }
        ],
        [
          {
            type: 'GokbStateField',
            name: 'status',
            value: 'status',
            properties: {
              initItem: this.$i18n.t('component.general.status.Current.label'),
              width: '100%'
            }
          }
        ],
      ]
      this.resultHeaders = [
        {
          text: this.$i18n.t('component.general.name'),
          align: 'left',
          width: '100%',
          sortable: false,
          value: 'link'
        },
      ]
      this.searchServicesUrl = 'rest/provider'
      this.searchServiceIncludes = 'id,name'
      this.linkValue = 'name'
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
          deleteUrl,
          retireUrl
        }))
      },
      _confirmArchiveSelectedItems () {
        this.actionToConfirm = '_archiveSelectedItems'
        this.messageToConfirm = this.$i18n.t('popups.confirm.retire')
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      _confirmDeleteSelectedItems () {
        this.actionToConfirm = '_deleteSelectedItems'
        this.messageToConfirm = this.$i18n.t('popups.confirm.delete')
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
