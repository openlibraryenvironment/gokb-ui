<script>
  import BaseSearch from './base-search-view'
  // import ajaxServices from '@/shared/services/ajax-services'

  export default {
    name: 'SearchTitle',
    extends: BaseSearch,
    data () {
      return {}
    },
    async created () {
      // const allTypes = await ajaxServices.lookup({
      //   baseClass: 'org.gokb.cred.RefdataValue',
      //   filter1: 'TitleInstance.Medium',
      //   q: '',
      // })
      // const allStates = await ajaxServices.lookup({
      //   baseClass: 'org.gokb.cred.RefdataValue',
      //   filter1: 'KBComponent.Status',
      //   q: ''
      // })

      this.title = 'Titel'
      this.component = 'g:1titles'
      this.resultActionButtons = [
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

      this.searchInputFields = [
        [
          {
            type: 'GokbTextField',
            name: 'qp_name',
            properties: {
              label: 'Name/Titel'
            }
          },
          {
            type: 'GokbSelectField',
            name: 'qp_identifier',
            properties: {
              placeholder: 'Identifier'
            }
          }
        ],
        [
          {
            type: 'GokbSearchPublisherField',
            name: 'qp_pub',
          },
          {
            type: 'GokbSelectField',
            name: 'qp_medium',
            properties: {
              placeholder: 'Typ',
              // items: allTypes.values.map(({ id: value, text }) => ({ value, text })),
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
          }
        ]
      ]
      this.resultHeaders = [
        {
          text: 'Name/Titel',
          align: 'left',
          sortable: false,
          value: 'Name/Title'
        },
        {
          text: 'Typ',
          align: 'left',
          sortable: false,
          value: 'Type'
        },
        {
          text: 'Veröffentlicht von',
          align: 'right',
          sortable: false,
          value: ''
        },
        {
          text: 'Veröffentlicht bis',
          align: 'right',
          sortable: false,
          value: ''
        },
      ]
    },
  }
</script>

<style scoped>

</style>
