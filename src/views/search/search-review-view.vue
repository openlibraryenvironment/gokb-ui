<script>
  import BaseSearch from './base-search-view'
  // import ajaxServices from '@/shared/services/ajax-services'

  export default {
    name: 'SearchReview',
    extends: BaseSearch,
    data () {
      return {}
    },
    async created () {
      this.title = 'Reviews'
      this.component = 'g:reviewRequests'
      this.resultActionButtons = [
        {
          icon: 'clear',
          label: 'Schließen',
          action: undefined,
        }
      ]

      // const allUsers = await ajaxServices.lookup({
      //   baseClass: 'org.gokb.cred.User',
      //   q: ''
      // })

      this.searchInputFields = [
        [
          {
            type: 'GokbTextField',
            name: 'qp_cause',
            properties: {
              label: 'Name/Titel'
            }
          },
          {
            type: 'GokbSelectField',
            name: 'qp_raisedby',
            properties: {
              label: 'Ersteller',
              multiple: true,
            },
            // items: allUsers.values.map(({ id: value, text }) => ({ value, text })),
          }
        ],
        [
          {
            type: 'GokbSelectField',
            properties: {
              label: 'Komponente'
            }
          },
          {
            type: 'GokbSelectField',
            name: 'qp_allocatedto',
            properties: {
              label: 'Reviewer',
              multiple: true,
            },
            // items: allUsers.values.map(({ id: value, text }) => ({ value, text })),
          }
        ],
        [
          {
            type: 'GokbSelectField',
            name: '',
            properties: {
              label: 'Kuratoren',
            },
          },
          {
            type: 'GokbCheckboxField',
            properties: {
              label: 'Abgeschlossene Anzeigen'
            }
          }
        ]
      ]
      this.resultHeaders = [
        {
          text: 'Titel/Name',
          align: 'left',
          sortable: false,
          value: 'Titel/Name'
        },
        {
          text: 'Typ',
          align: 'left',
          sortable: false,
          value: 'Typ'
        },
        {
          text: 'Ersteller',
          align: 'left',
          sortable: false,
          value: 'Raised By'
        },
        {
          text: 'Reviewer',
          align: 'left',
          sortable: false,
          value: 'Allocated To'
        },
      ]
    },
    // https://gokbt.gbv.de/gokb/ajaxSupport/lookup?format=json&q=&baseClass=org.gokb.cred.RefdataValue&filter1=ReviewRequest.Status&addEmpty=Y&_=1552396318578
  }
</script>

<style scoped>

</style>
