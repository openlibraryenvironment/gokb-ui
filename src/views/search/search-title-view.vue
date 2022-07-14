<script>
  import BaseSearch from './base-search-view'
  import { EDIT_TITLE_ROUTE, EDIT_PROVIDER_ROUTE } from '@/router/route-paths'

  export default {
    name: 'SearchTitle',
    extends: BaseSearch,
    data () {
      return {
        searchFilters: {
          name: undefined,
          identifierIds: undefined,
          publisherId: undefined,
          type: undefined,
          status: undefined,
        },
        sortMappings: {
          link: 'name',
          linkTwo: 'publisher'
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
      title () {
        return this.$i18n.tc('component.title.label', 2)
      },
      resultActionButtons () {
        return [
          {
            icon: 'mdi-close',
            label: this.$i18n.t('btn.retire'),
            disabled: 'isRetiredSelectedDisabled',
            action: '_confirmRetireSelectedItems'
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
              name: 'name',
              properties: {
                label: this.$i18n.t('component.general.name')
              }
            },
            {
              type: 'GokbTextField',
              name: 'ids',
              value: 'identifierIds',
              properties: {
                label: this.$i18n.tc('component.identifier.label')
              }
            },
            {
              type: 'GokbSelectField',
              name: 'type',
              value: 'type',
              properties: {
                label: this.$i18n.t('component.title.type.label'),
                width: '100%'
              },
              items: [
                { name: this.$i18n.tc('component.title.type.Journal'), id: 'journal' },
                { name: this.$i18n.tc('component.title.type.Book'), id: 'book' },
                { name: this.$i18n.tc('component.title.type.Database'), id: 'database' },
                { name: this.$i18n.tc('component.title.type.Other'), id: 'other' },
              ]
            }
          ],
          [
            {
              type: 'GokbSearchPublisherField',
              name: 'publisher',
              value: 'publisherId'
            },
            {
              type: 'GokbStateField',
              name: 'status',
              value: 'status',
              properties: {
                initItem: 'Current',
                width: '100%',
                messagePath: 'component.general.status'
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
            text: this.$i18n.tc('component.title.publisher.label'),
            align: 'start',
            width: '25%',
            sortable: true,
            value: 'publisher'
          },
          {
            text: this.$i18n.t('component.title.type.label'),
            align: 'start',
            width: '150px',
            sortable: false,
            value: 'type'
          },
          {
            text: this.$i18n.t('component.title.publishStart'),
            align: 'end',
            width: '150px',
            sortable: false,
            value: 'startDate'
          }
        ]
      }
    },
    async created () {
      this.searchServicesUrl = 'rest/titles'
      this.initVals = {
        status: 'setInit'
      }
      this.linkSearchParameterValues = {
        link: 'name'
      }
    },
    methods: {
      _transformForTable (data) {
        return data.map(({
          id,
          name,
          type,
          status,
          publishedFrom,
          publisher,
          dateFirstInPrint,
          dateFirstOnline,
          _embedded,
          _links
        }) => ({
          id,
          type: this.$i18n.tc('component.title.type.' + type),
          startDate: (dateFirstInPrint || (dateFirstOnline || publishedFrom))?.substr(0, 4),
          link: { value: name, route: EDIT_TITLE_ROUTE, id: 'id' },
          linkTwo: publisher ? { value: publisher.name, route: EDIT_PROVIDER_ROUTE, id: 'publisherId' } : undefined,
          publisher: _embedded.publisher.map(pub => pub.name),
          status: status?.value,
          deleteUrl: _links?.delete?.href || undefined,
          updateUrl: _links?.update?.href || undefined
        }))
      },
      _confirmDeleteSelectedItems () {
        this.actionToConfirm = '_deleteSelectedItems'
        this.messageToConfirm = { text: 'popups.confirm.delete.list', vars: [this.selectedItems.length, this.$i18n.tc('component.title.label', this.selectedItems.length)] }
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      _confirmRetireSelectedItems () {
        this.actionToConfirm = '_retireSelectedItems'
        this.messageToConfirm = { text: 'popups.confirm.retire.list', vars: [this.selectedItems.length, this.$i18n.tc('component.title.label', this.selectedItems.length)] }
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      }
    }
  }
</script>
