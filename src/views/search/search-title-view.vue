<script>
  import BaseSearch from './base-search-view'
  import PublisherInputField from '@/shared/components/simple/search-publisher-field-component'
  // import ajaxServices from '@/shared/services/ajax-services'

  export default {
    name: 'SearchTitle',
    components: { PublisherInputField },
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
            type: 'v-text-field',
            name: 'qp_name',
            properties: {
              label: 'Name/Titel'
            }
          },
          {
            type: 'v-text-field',
            name: 'qp_identifier',
            properties: {
              label: 'Identifier'
            }
          }
        ],
        [
          {
            type: 'publisher-input-field',
            name: 'qp_pub',
          },
          {
            type: 'v-select',
            name: 'qp_medium',
            properties: {
              label: 'Typ',
              // items: allTypes.values.map(({ id: value, text }) => ({ value, text })),
            }
          }
        ],
        [
          {
            type: 'v-select',
            name: 'qp_status',
            properties: {
              label: 'Status',
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
