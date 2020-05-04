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
            type: 'GokbActiveField',
            name: 'enabled',
          }
        ]
      ]
      this.resultHeaders = [
        {
          text: 'Benutzername',
          align: 'left',
          sortable: false,
          value: 'username'
        },
        {
          text: 'E-Mail',
          align: 'left',
          sortable: false,
          value: 'email'
        },
      ]
      this.searchServicesUrl = 'rest/users'
      this.searchServiceIncludes = 'id,username,email'
    },
    methods: {
      _transformForTable (data) {
        return data.map(({ id, username, email }) => ({
          id,
          username,
          email
        }))
      },
    }
  }
</script>
