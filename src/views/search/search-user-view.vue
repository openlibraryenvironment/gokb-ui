<script>
  import BaseSearch from './base-search-view'
  import { ADD_USER_ROUTE } from '@/router/route-names'

  export default {
    name: 'SearchUser',
    extends: BaseSearch,
    data () {
      return {}
    },
    async created () {
      this.title = 'Benutzer'
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

      this.searchInputFields = [
        [
          {
            type: 'GokbUsernameField',
            name: 'name',
            properties: {
              hideIcon: true,
              rules: []
            }
          },
          {
            type: 'GokbCuratoryGroupField',
            name: 'curatory',
            properties: {
              label: 'Gruppen',
              multiple: true,
            }
          }
        ],
        [
          {
            type: 'GokbRoleField',
            name: 'role',
            properties: {
              label: 'Rollen',
              multiple: true,
            }
          },
          {
            type: 'GokbStateField',
            name: 'status',
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
      this.searchServicesUrl = 'rest/users'
      // this.searchServiceIncludes = 'id,name,provider,nominalPlatform,_links'
    },
  }
</script>
