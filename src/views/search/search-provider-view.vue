<script>
  import BaseSearch from './base-search-view'
  import GokbIdentifierField from '@/shared/components/simple/gokb-search-identifier-field'
  import { EDIT_PROVIDER_ROUTE } from '@/router/route-paths'

  export default {
    name: 'SearchProvider',
    components: { GokbIdentifierField },
    extends: BaseSearch,
    data () {
      return {
        searchFilters: {
          qsName: undefined,
          identifierValue: undefined,
          titleNamespace: undefined,
          curatoryGroupIds: undefined,
          status: 'Current',
          roles: undefined
        }
      }
    },
    computed: {
      title () {
        return this.$i18n.tc('component.provider.label', 2)
      },
      isDeleteSelectedDisabled () {
        return this.isReadonly || !this.selectedItems.length || this.selectedItems.some(item => (!item.deleteUrl))
      },
      isRetiredSelectedDisabled () {
        return this.isReadonly || !this.selectedItems.length || this.selectedItems.some(item => (!item.updateUrl))
      },
      showSelect () {
        return this.isUserAdmin
      },
      resultActionButtons () {
        if (this.isUserAdmin) {
          return [
            {
              label: this.$i18n.t('btn.export'),
              disabled: 'isSearchExportDisabled',
              public: true,
              action: 'exportSearchResults',
              loading: this.exportLoading
            },
            {
              icon: 'mdi-close',
              label: this.$i18n.t('btn.retire'),
              disabled: 'isRetiredSelectedDisabled',
              action: '_confirmArchiveSelectedItems',
            },
            {
              icon: 'mdi-delete',
              label: this.$i18n.t('btn.delete'),
              disabled: 'isDeleteSelectedDisabled',
              action: '_confirmDeleteSelectedItems',
            },
          ]
        } else {
          return [
            {
              label: this.$i18n.t('btn.export'),
              disabled: 'isSearchExportDisabled',
              public: true,
              action: 'exportSearchResults',
              loading: this.exportLoading
            },
          ]
        }
      },
      searchInputFields () {
        return [
          [
            {
              type: 'GokbTextField',
              name: 'qsName',
              value: 'qsName',
              properties: {
                label: this.$i18n.t('component.general.name'),
              }
            },
            {
              type: 'GokbIdentifierFilterField',
              name: 'ids',
              value: 'identifierValue',
              properties: {
                label: this.$i18n.tc('component.identifier.label'),
                targetType: 'Org'
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
              md: 2,
              properties: {
                initItem: 'Current',
                messagePath: 'component.general.status',
                label: this.$i18n.tc('component.general.status.label')
              }
            },
            {
              type: 'GokbStateField',
              name: 'roles',
              value: 'roles',
              md: 2,
              properties: {
                messagePath: 'component.provider.role',
                url: 'refdata/categories/Org.Role',
                label: this.$i18n.tc('component.provider.role.label')
              }
            },
            {
              type: 'GokbNamespaceField',
              name: 'titleNamespace',
              value: 'titleNamespaceId',
              md: 2,
              properties: {
                label: this.$i18n.t('component.provider.titleNamespace.label'),
                returnObject: false
              }
            },
          ],
        ]
      },
      resultHeaders () {
        return [
          {
            title: this.$i18n.t('component.general.name'),
            align: 'start',
            sortable: true,
            value: 'link'
          },
          {
            title: this.$i18n.tc('component.platform.label', 2),
            align: 'end',
            sortable: false,
            value: 'platforms'
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
          platforms,
          _links
        }) => ({
          id,
          link: {
            value: name,
            route: EDIT_PROVIDER_ROUTE,
            id: 'id'
          },
          platforms: platforms ? platforms.map(plt => ( plt.name )).join(', ') : undefined,
          status: status.value,
          deleteUrl: _links?.delete?.href || undefined,
          updateUrl: _links?.update?.href || undefined
        }))
      },
      _confirmArchiveSelectedItems () {
        this.actionToConfirm = '_archiveSelectedItems'
        this.messageToConfirm = {
          text: 'popups.confirm.retire.list',
          vars: [this.selectedItems.length, this.$i18n.tc('component.provider.label', this.selectedItems.length)]
        }
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      _confirmDeleteSelectedItems () {
        this.actionToConfirm = '_deleteSelectedItems'
        this.messageToConfirm = {
          text: 'popups.confirm.delete.list',
          vars: [this.selectedItems.length, this.$i18n.tc('component.provider.label', this.selectedItems.length)]
        }
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      }
    }
  }
</script>
