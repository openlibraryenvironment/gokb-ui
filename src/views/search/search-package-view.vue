<script>
  import BaseSearch from './base-search-view'
  // import ajaxServices from '@/shared/services/ajax-services'

  export default {
    name: 'SearchPackage',
    extends: BaseSearch,
    data () {
      return {}
    },
    async created () {
      this.title = 'Pakete'
      this.component = 'g:1packages'
      this.resultActionButtons = [
        {
          icon: 'import_export',
          label: 'Export',
          route: undefined,
        },
        {
          icon: 'clear',
          label: 'Archivieren',
          action: undefined,
        },
        {
          icon: 'delete',
          label: 'Löschen',
          action: undefined,
        }
      ]

      // const allCuratorGroups = await ajaxServices.lookup({
      //   baseClass: 'org.gokb.cred.CuratoryGroup',
      //   q: ''
      // })
      // const allStates = await ajaxServices.lookup({
      //   baseClass: 'org.gokb.cred.RefdataValue',
      //   filter1: 'KBComponent.Status',
      //   q: ''
      // })

      this.searchInputFields = [
        [
          {
            type: 'GokbTextField',
            name: 'qp_name',
            properties: {
              label: 'Name',
            }
          },
          {
            type: 'GokbSelectField',
            name: 'qp_curgroup',
            properties: {
              placeholder: 'Kuratoren',
              multiple: true,
              // items: allCuratorGroups.values.map(({ id: value, text }) => ({ value, text })),
            }
          }
        ],
        [
          {
            type: 'GokbSearchProviderField',
            name: 'qp_provider',
          },
          {
            type: 'GokbTextField',
            name: 'qp_identifier',
            properties: {
              label: 'Identifier'
            }
          }
        ],
        [
          {
            type: 'GokbSelectField',
            name: 'qp_status',
            properties: {
              placeholder: 'Status',
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
          value: 'Name'
        },
        {
          text: 'Provider',
          align: 'left',
          sortable: false,
          value: 'Provider'
        },
        {
          text: 'Plattform',
          align: 'left',
          sortable: false,
          value: 'Nominal Platform'
        },
      ]
    },
  }
</script>
