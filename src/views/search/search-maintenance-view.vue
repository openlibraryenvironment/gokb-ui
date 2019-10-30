<script>
  import BaseSearch from './base-search-view'
  // import ajaxServices from '@/shared/services/ajax-services'

  export default {
    name: 'SearchMaintenance',
    extends: BaseSearch,
    data () {
      return {}
    },
    async created () {
      this.title = 'Pflege'
      this.component = '?'
      this.resultActionButtons = [
        {
          icon: 'fast_forward',
          label: 'Überspringen',
          action: undefined,
        }
      ]
      this.resultHeaders = [
        {
          text: 'Titel/Name',
          align: 'left',
          sortable: false,
          value: 'title'
        },
        {
          text: 'Typ',
          align: 'left',
          sortable: false,
          value: 'type'
        },
        {
          text: 'Fällig',
          align: 'left',
          sortable: false,
          value: 'dueDate'
        },
      ]

      // const allCuratorGroups = await ajaxServices.lookup({
      //   baseClass: 'org.gokb.cred.CuratoryGroup',
      //   q: ''
      // })

      // const allUsers = await ajaxServices.lookup({
      //   baseClass: 'org.gokb.cred.User',
      //   q: ''
      // })

      this.searchInputFields = [
        [
          {
            type: 'GokbTextField',
            properties: {
              label: 'Name/Titel'
            }
          },
          {
            type: 'GokbSelectField',
            properties: {
              placeholder: 'Ersteller',
              multiple: true,
              // items: allUsers.values.map(({ id: value, text }) => ({ value, text })),
            }
          }
        ],
        [
          {
            type: 'GokbSelectField',
            properties: {
              placeholder: 'Kuratoren',
              multiple: true,
              // items: allCuratorGroups.values.map(({ id: value, text }) => ({ value, text })),
            }
          },
          {
            type: 'GokbTextField',
            properties: {
              label: 'Fällig Am'
            }
          }
        ]
      ]
    },
  }
</script>

<style scoped>

</style>
