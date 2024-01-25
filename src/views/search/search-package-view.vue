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
          subjectValue: undefined,
          contentType: undefined,
          qsName: undefined,
          status: 'Current',
          listStatus: undefined,
          editStatus: undefined,
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
        return this.isReadonly || !this.selectedItems.length || this.selectedItems.some(item => (!item.deleteUrl))
      },
      isRetiredSelectedDisabled () {
        return this.isReadonly || !this.selectedItems.length || this.selectedItems.some(item => (!item.updateUrl))
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
              items: this.selectedItems
            }
          },
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
            disabled: 'isDeleteSelectedDisabled',
            action: '_confirmRetireSelectedItems',
          },
          {
            icon: 'mdi-delete',
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
                targetType: 'Package'
              }
            },
            {
              type: 'GokbSubjectFilterField',
              name: 'subject',
              value: 'subjectValue',
              properties: {
                label: this.$i18n.tc('component.subject.label')
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
                label: this.$i18n.tc('component.platform.label')
              }
            }
          ],
          [
            {
              type: 'GokbStateField',
              name: 'status',
              md: 2,
              value: 'status',
              properties: {
                initItem: 'Current',
                width: '100%',
                messagePath: 'component.general.status',
                label: this.$i18n.tc('component.general.status.label')
              }
            },
            {
              type: 'GokbStateField',
              name: 'contentType',
              md: 2,
              value: 'contentType',
              properties: {
                label: this.$i18n.t('component.package.contentType.label'),
                width: '100%',
                url: 'refdata/categories/Package.ContentType',
                messagePath: 'component.package.contentType'
              }
            },
            {
              type: 'GokbStateField',
              name: 'listStatus',
              md: 2,
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
              md: 2,
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
            width: '80px',
            value: 'count'
          },
          {
            text: this.$i18n.tc('component.curatoryGroup.label'),
            align: 'center',
            sortable: false,
            value: 'curatoryGroups'
          },
          {
            text: this.$i18n.tc('component.general.lastUpdated'),
            align: 'start',
            sortable: true,
            width: '120px',
            value: 'lastUpdated'
          },
          {
            text: this.$i18n.tc('component.general.dateCreated'),
            align: 'start',
            sortable: true,
            width: '120px',
            value: 'dateCreated'
          }
        ]
      },
      exportHeaders () {
        return [
          {
            text: 'ID',
            value: 'id'
          },
          {
            text: this.$i18n.t('component.general.name'),
            value: 'name'
          },
          {
            text: this.$i18n.tc('component.provider.label'),
            value: 'providerName'
          },
          {
            text: this.$i18n.tc('component.platform.label'),
            value: 'nominalPlatformName'
          },
          {
            text: this.$i18n.tc('component.package.contentType.label'),
            value: 'contentType'
          },
          {
            text: this.$i18n.tc('component.package.count'),
            value: 'tippCount'
          },
          {
            text: this.$i18n.tc('component.curatoryGroup.label'),
            value: 'curatoryGroups'
          },
          {
            text: this.$i18n.t('component.general.status.label'),
            value: 'status'
          },
          {
            text: this.$i18n.t('component.general.lastUpdated'),
            value: 'lastUpdated'
          },
          {
            text: this.$i18n.t('component.general.dateCreated'),
            value: 'dateCreated'
          }
        ]
      }
    },
    async created () {
      this.searchServicesUrl = 'rest/packages'
      this.searchByEs = true
      this.initVals = {
        status: 'setInit',
        global: ['Global', 'Consortium', 'Regional', 'Other']
      }
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
          dateCreated,
          uuid,
          status,
          contentType,
          nominalPlatform,
          tippCount,
          _tippCount,
          _embedded,
          _links
        }) => ({
          id,
          uuid,
          link: { value: name, route: EDIT_PACKAGE_ROUTE, id: 'id' },
          linkTwo: provider ? { value: provider.name, route: EDIT_PROVIDER_ROUTE, id: 'providerId' } : undefined,
          providerId: provider?.id || undefined,
          lastUpdated: lastUpdated ? new Date(lastUpdated).toLocaleString('sv').substring(0, 10) : undefined,
          dateCreated: dateCreated ? new Date(dateCreated).toLocaleString('sv').substring(0, 10) : undefined,
          nominalPlatform: nominalPlatform?.name,
          contentType: contentType ? this.$i18n.t('component.package.contentType.' + contentType.name + '.label') : '',
          count: _tippCount || tippCount || 0,
          curatoryGroups: _embedded.curatoryGroups.map(cg => cg.name),
          status: status.value,
          deleteUrl: _links?.delete?.href || undefined,
          updateUrl: _links?.update?.href || undefined
        }))
      },
      _transformForExport (data) {
        return data.map(({
          name,
          providerName,
          lastUpdatedDisplay,
          dateCreated,
          uuid,
          status,
          contentType,
          nominalPlatformName,
          curatoryGroups,
          titleCount,
        }) => ({
          id: uuid,
          name,
          providerName,
          lastUpdated: lastUpdatedDisplay ? new Date(lastUpdatedDisplay).toLocaleString('sv').substring(0, 10) : undefined,
          dateCreated: dateCreated ? new Date(dateCreated).toLocaleString('sv').substring(0, 10) : undefined,
          nominalPlatformName,
          contentType,
          tippCount: titleCount.toString(),
          curatoryGroups: curatoryGroups.join(','),
          status
        }))
      },
      _confirmDeleteSelectedItems () {
        this.actionToConfirm = '_deleteSelectedItems'
        this.messageToConfirm = {
          text: 'popups.confirm.delete.list',
          vars: [this.selectedItems.length, this.$i18n.tc('component.package.label', this.selectedItems.length)]
        }
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      _confirmRetireSelectedItems () {
        this.actionToConfirm = '_retireSelectedItems'
        this.messageToConfirm = {
          text: 'popups.confirm.retire.list',
          vars: [this.selectedItems.length, this.$i18n.tc('component.package.label', this.selectedItems.length)]
        }
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      }
    }
  }
</script>
