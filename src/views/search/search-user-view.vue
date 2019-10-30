<script>
  import BaseSearch from './base-search-view'
  import { ADD_USER_ROUTE } from '@/router/route-names'

  // import ajaxServices from '@/shared/services/ajax-services'

  export default {
    name: 'SearchUser',
    extends: BaseSearch,
    data () {
      return {}
    },
    async created () {
      this.title = 'Benutzer'
      this.component = 'g:UserOrganisation'
      this.resultActionButtons = [
        {
          icon: 'add',
          label: 'Hinzufügen',
          route: ADD_USER_ROUTE,
        },
        {
          icon: 'cancel',
          label: 'Deaktivieren',
          action: undefined,
        }
      ]

      // const allStates = await ajaxServices.lookup({
      //   baseClass: 'org.gokb.cred.RefdataValue',
      //   filter1: 'KBComponent.Status',
      //   q: ''
      // })

      this.searchInputFields = [
        [
          {
            type: 'GokbUsernameField',
            name: 'qp_name',
            properties: {
              hideIcon: true
            }
          },
          {
            type: 'GokbSelectField',
            properties: {
              placeholder: 'Gruppen',
              multiple: true,
            }
          }
        ],
        [
          {
            type: 'GokbSelectField',
            properties: {
              placeholder: 'Rollen',
              multiple: true,
            }
          },
          {
            type: 'GokbSelectField',
            name: 'qp_status',
            properties: {
              placeholder: 'Status',
              // items: allStates?.values.map(({ id: value, text }) => ({ value, text })),
            }
          }
        ]
      ]
      this.resultHeaders = [
        {
          text: 'Benutzername',
          align: 'left',
          sortable: false,
          value: 'Name'
        },
        {
          text: 'E-Mail',
          align: 'left',
          sortable: false,
          value: 'email?'
        },
      ]
    },
  }
</script>

<style scoped>

</style>
