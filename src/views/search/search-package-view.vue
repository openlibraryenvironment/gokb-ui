<script>
  import BaseSearch from './base-search-view'
  import { EDIT_PACKAGE_ROUTE } from '@/router/route-paths'
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
          identifierValue: undefined,
          contentType: undefined,
          status: undefined,
          name: undefined,
        }
      }
    },
    computed: {
      isDeleteSelectedDisabled () {
        return !this.selectedItems.length
      },
      isExportSelectedDisabled () {
        return this.selectedItems.length !== 1
      }
    },
    async created () {
      this.title = this.$i18n.tc('component.package.label', 2)
      this.resultActionButtons = [
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
      this.searchInputFields = [
        [
          {
            type: 'GokbTextField',
            name: 'name',
            value: 'name',
            properties: {
              label: this.$i18n.t('component.general.name'),
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
            type: 'GokbSearchProviderField',
            name: 'provider',
            value: 'providerId',
            properties: {
              label: this.$i18n.tc('component.provider.label'),

            }
          },
          {
            type: 'GokbTextField',
            name: 'ids',
            value: 'identifierValue',
            properties: {
              label: this.$i18n.tc('component.identifier.label'),
            }
          }
        ],
        [
          {
            type: 'GokbStateField',
            name: 'status',
            value: 'status',
          },
          {
            type: 'GokbStateField',
            name: 'contentType',
            value: 'contentType',
            properties: {
              label: this.$i18n.t('component.package.contentType.label'),
              url: 'refdata/categories/Package.ContentType',
              messagePath: 'component.package.contentType'
            }
          },
        ]
      ]
      this.resultHeaders = [
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
          value: 'providerName'
        },
        {
          text: this.$i18n.tc('component.platform.label'),
          align: 'start',
          sortable: true,
          value: 'nominalPlatformName'
        },
        {
          text: this.$i18n.tc('component.package.contentType.label'),
          align: 'start',
          sortable: true,
          value: 'contentType.value'
        },
      ]
      this.searchServicesUrl = 'rest/packages'
      this.searchServiceIncludes = 'id,uuid,name,provider,nominalPlatform,_links'
    },
    methods: {
      _transformForTable (data) {
        return data.map(({
          id,
          name,
          provider,
          uuid,
          nominalPlatform,
          _links: { delete: { href: deleteUrl }, retire: { href: retireUrl } }
        }) => ({
          id,
          uuid,
          link: { value: name, route: EDIT_PACKAGE_ROUTE, id: 'id' },
          providerName: provider?.name,
          nominalPlatformName: nominalPlatform?.name,
          isDeletable: !!deleteUrl,
          isRetireable: !!retireUrl,
          deleteUrl: deleteUrl,
          retireUrl: retireUrl,
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
