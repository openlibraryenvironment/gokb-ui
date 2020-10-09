<script>
  import BaseSearch from './base-search-view'
  import { EDIT_TITLE_ROUTE } from '@/router/route-paths'

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
        }
      }
    },
    computed: {
      isDeleteSelectedDisabled () {
        return !this.selectedItems.length
      }
    },
    async created () {
      this.title = this.$i18n.tc('component.title.label', 2)
      this.resultActionButtons = [
        {
          icon: 'clear',
          label: this.$i18n.t('btn.retire'),
          disabled: 'isDeleteSelectedDisabled',
          action: '_confirmRetireSelectedItems'
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
          }
        ],
        [
          {
            type: 'GokbSearchPublisherField',
            name: 'publisher',
            value: 'publisherId'
          },
          {
            type: 'GokbSelectField',
            name: 'type',
            value: 'type',
            properties: {
              label: this.$i18n.t('component.title.type.label'),
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
            type: 'GokbStateField',
            name: 'status',
            value: 'status',
            properties: {
              messagePath: 'component.general.status'
            }
          }
        ]
      ]
      this.resultHeaders = [
        {
          text: this.$i18n.t('component.general.name'),
          align: 'left',
          sortable: false,
          value: 'link'
        },
        {
          text: this.$i18n.t('component.title.type.label'),
          align: 'left',
          sortable: false,
          value: 'type'
        },
        {
          text: this.$i18n.t('component.title.publishStart'),
          algin: 'left',
          sortable: false,
          value: 'startDate'
        }
      ]
      this.searchServicesUrl = 'rest/titles'
      this.searchServiceIncludes = 'id,name,_links,publishedFrom,dateFirstInPrint,dateFiirstOnline'
      this.searchServiceEmbeds = 'ids'
    },
    methods: {
      _transformForTable (data) {
        return data.map(({
          id,
          name,
          type,
          publishedFrom,
          dateFirstInPrint,
          dateFirstOnline,
          _links: { delete: { href: deleteUrl }, retire: { href: retireUrl } }
        }) => ({
          id,
          type: this.$i18n.tc('component.title.type.' + type),
          startDate: (dateFirstInPrint || (dateFirstOnline || publishedFrom))?.substr(0, 4),
          link: { value: name, route: EDIT_TITLE_ROUTE, id: 'id' },
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
            promise: this.searchServices.retire(retireUrl, this.cancelToken.token),
            instance: this
          })
        ))
        this.resultPaginate(this.resultOptions.page)
      },
    }
  }
</script>
