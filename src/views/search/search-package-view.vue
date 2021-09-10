<script>
  import BaseSearch from './base-search-view'
  import { EDIT_PACKAGE_ROUTE, EDIT_PROVIDER_ROUTE } from '@/router/route-paths'
  import GokbPackageExportMenu from '@/shared/components/gokb-package-export-menu'

  export default {
    name: 'SearchPackage',
    components: { GokbPackageExportMenu },
    extends: BaseSearch,
    data () {
      return {
        searchFilters: {
          curatoryGroupIds: [],
          providerId: undefined,
          platformId: undefined,
          lastUpdated: undefined,
          identifierValue: undefined,
          contentType: undefined,
          status: undefined,
          global: ['Global', 'Consortium', 'Regional', 'Other'],
          label: undefined,
        },
        sortMappings: {
          link: 'name',
          linkTwo: 'provider'
        }
      }
    },
    computed: {
      isDeleteSelectedDisabled () {
        return this.isReadonly || !this.selectedItems.length || this.selectedItems.filter(item => (item.deleteUrl === false)).length > 0
      },
      isRetiredSelectedDisabled () {
        return this.isReadonly || !this.selectedItems.length || this.selectedItems.filter(item => (item.retireUrl === false)).length > 0
      },
      isExportSelectedDisabled () {
        return this.selectedItems.length !== 1
      },
      showSelect () {
        return true
      },
      title () {
        return this.$i18n.tc('component.package.label', 2)
      },
      resultActionButtons () {
        return [
          {
            component: GokbPackageExportMenu,
            properties: {
              disabled: this.isExportSelectedDisabled,
              items: this.selectedItems
            }
          },
          {
            icon: 'clear',
            label: this.$i18n.t('btn.retire'),
            disabled: 'isDeleteSelectedDisabled',
            action: '_confirmRetireSelectedItems',
          },
          {
            icon: 'delete',
            label: this.$i18n.t('btn.delete'),
            disabled: 'isDeleteSelectedDisabled',
            action: '_confirmDeleteSelectedItems',
          }
        ]
      },
      searchInputFields () {
        return [
          [
            {
              type: 'GokbTextField',
              name: 'label',
              properties: {
                label: this.$i18n.t('component.general.name'),
              }
            },
            {
              type: 'GokbTextField',
              name: 'ids',
              value: 'identifierValue',
              properties: {
                label: this.$i18n.tc('component.identifier.label'),
              }
            },
            {
              type: 'GokbStateField',
              name: 'contentType',
              value: 'contentType',
              properties: {
                label: this.$i18n.t('component.package.contentType.label'),
                width: '100%',
                url: 'refdata/categories/Package.ContentType',
                messagePath: 'component.package.contentType'
              }
            },
          ],
          [
            {
              type: 'GokbCuratoryGroupField',
              name: 'curatoryGroups',
              value: 'curatoryGroupIds',
              properties: {
                label: this.$i18n.tc('component.curatoryGroup.label'),
                width: '100%',
                multiple: true,
                returnObject: false
              }
            },
            {
              type: 'GokbSearchProviderField',
              name: 'provider',
              value: 'providerId',
              properties: {
                label: this.$i18n.tc('component.provider.label'),

              }
            },
            {
              type: 'GokbSearchPlatformField',
              name: 'nominalPlatform',
              value: 'platformId',
              properties: {
                label: this.$i18n.tc('component.platform.label'),

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
            },
            {
              type: 'GokbStateField',
              name: 'listStatus',
              value: 'listStatus',
              properties: {
                label: this.$i18n.t('component.package.listStatus.label'),
                width: '100%',
                url: 'refdata/categories/Package.ListStatus',
                messagePath: 'component.package.listStatus'
              }
            },
            {
              type: 'GokbStateField',
              name: 'editStatus',
              value: 'editStatus',
              properties: {
                label: this.$i18n.t('component.general.editStatus.label'),
                width: '100%',
                url: 'refdata/categories/KBComponent.EditStatus',
                messagePath: 'component.general.editStatus'
              }
            },
          ],
          [
            {
              type: 'GokbSearchMultiselectField',
              name: 'global',
              value: 'global',
              md: 8,
              properties: {
                label: this.$i18n.t('component.package.global.label'),
                options: [
                  { key: 'Global', label: this.$i18n.t('component.package.global.Global.label') },
                  { key: 'Consortium', label: this.$i18n.t('component.package.global.Consortium.label') },
                  { key: 'Regional', label: this.$i18n.t('component.package.global.Regional.label') },
                  { key: 'Local', label: this.$i18n.t('component.package.global.Local.label') },
                  { key: 'Other', label: this.$i18n.t('component.package.global.Other.label') },
                ]
              }
            }
          ]
        ]
      },
      resultHeaders () {
        return [
          {
            text: this.$i18n.t('component.general.name'),
            align: 'start',
            sortable: true,
            value: 'link'
          },
          {
            text: this.$i18n.tc('component.provider.label'),
            align: 'start',
            sortable: true,
            value: 'linkTwo'
          },
          {
            text: this.$i18n.tc('component.package.contentType.label'),
            align: 'start',
            sortable: true,
            width: '150px',
            value: 'contentType'
          },
          {
            text: this.$i18n.tc('component.package.count'),
            align: 'start',
            sortable: false,
            width: '150px',
            value: 'count'
          },
          {
            text: this.$i18n.tc('component.general.lastUpdated'),
            align: 'start',
            sortable: true,
            width: '150px',
            value: 'lastUpdated'
          }
        ]
      }
    },
    async created () {
      this.searchServicesUrl = 'rest/packages'
      this.searchByEs = true
      this.linkSearchParameterValues = {
        link: 'name',
        linkTwo: 'provider'
      }
    },
    methods: {
      _transformForTable (data) {
        return data.map(({
          id,
          name,
          provider,
          lastUpdated,
          uuid,
          contentType,
          nominalPlatform,
          tippCount,
          _tippCount,
          _links
        }) => ({
          id,
          uuid,
          link: { value: name, route: EDIT_PACKAGE_ROUTE, id: 'id' },
          linkTwo: provider ? { value: provider.name, route: EDIT_PROVIDER_ROUTE, id: 'providerId' } : undefined,
          providerId: provider?.id || undefined,
          lastUpdated: new Date(lastUpdated).toISOString().substr(0, 10),
          nominalPlatform: nominalPlatform?.name,
          contentType: contentType ? this.$i18n.t('component.package.contentType.' + contentType.name + '.label') : '',
          count: _tippCount || tippCount,
          deleteUrl: _links?.delete?.href || undefined,
          retireUrl: _links?.update?.href || undefined
        }))
      },
      _confirmDeleteSelectedItems () {
        this.actionToConfirm = '_deleteSelectedItems'
        this.messageToConfirm = { text: 'popups.confirm.delete.list', vars: [this.selectedItems.length, this.$i18n.tc('component.package.label', this.selectedItems.length)] }
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      async _deleteSelectedItems () {
        await Promise.all(this.selectedItems.map(({ deleteUrl }) => this._executeDeleteItemService(deleteUrl)))
        this.resultPaginate(this.resultOptions.page)
      },
      _confirmRetireSelectedItems () {
        this.actionToConfirm = '_retireSelectedItems'
        this.messageToConfirm = { text: 'popups.confirm.retire.list', vars: [this.selectedItems.length, this.$i18n.tc('component.package.label', this.selectedItems.length)] }
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      async _retireSelectedItems () {
        await Promise.all(this.selectedItems.map(({ retireUrl }) =>
          this.catchError({
            promise: this.searchServices.retire(retireUrl, this.cancelToken.token),
            instance: this
          })
        ))
        this.resultPaginate(this.resultOptions.page)
      },
    }
  }
</script>
