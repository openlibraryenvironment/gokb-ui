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
          label: undefined,
          identifier: undefined,
          curatoryGroupIds: undefined
        }
      }
    },
    computed: {
      title () {
        return this.$i18n.tc('component.provider.label', 2)
      },
      isDeleteSelectedDisabled () {
        return this.isReadonly || !this.selectedItems.length || this.selectedItems.filter(item => (item.deleteUrl === false)).length > 0
      },
      isRetiredSelectedDisabled () {
        return this.isReadonly || !this.selectedItems.length || this.selectedItems.filter(item => (item.retireUrl === false)).length > 0
      },
      resultActionButtons () {
        return [
          {
            icon: 'clear',
            label: this.$i18n.t('btn.retire'),
            disabled: 'isRetiredSelectedDisabled',
            action: '_confirmArchiveSelectedItems',
          },
          {
            icon: 'delete',
            label: this.$i18n.t('btn.delete'),
            disabled: 'isDeleteSelectedDisabled',
            action: '_confirmDeleteSelectedItems',
          },
        ]
      },
      searchInputFields () {
        return [
          [
            {
              type: 'GokbTextField',
              name: 'label',
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
                width: '100%',
                messagePath: 'component.general.status'
              }
            }
          ],
        ]
      },
      resultHeaders () {
        return [
          {
            text: this.$i18n.t('component.general.name'),
            align: 'left',
            width: '100%',
            sortable: true,
            value: 'link'
          },
        ]
      }
    },
    async created () {
      this.searchServicesUrl = 'rest/provider'
      this.initVals = {
        status: 'setInit'
      }
      this.searchByEs = true
      this.linkSearchParameterValues = {
        link: 'name'
      }
    },
    methods: {
      _transformForTable (data) {
        return data.map(({
          id,
          name,
          status,
          _links
        }) => ({
          id,
          link: { value: name, route: EDIT_PROVIDER_ROUTE, id: 'id' },
          status: status.value,
          deleteUrl: _links?.delete?.href || undefined,
          updateUrl: _links?.update?.href || undefined
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
