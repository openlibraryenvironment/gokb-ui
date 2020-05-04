<script>
  import BaseSearch from './base-search-view'
  import { ADD_USER_ROUTE } from '@/router/route-names'
  import userServices from '@/shared/services/user-services'

  export default {
    name: 'SearchUser',
    extends: BaseSearch,
    data () {
      return {}
    },
    computed: {
      isDeactivateSelectedDisabled () {
        return this.selectedItems.length === 0
      }
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
          disabled: 'isDeactivateSelectedDisabled',
          action: '_confirmDeactivateSelectedItems',
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
        return data.map(({ id, username, email, _links: { update: { href: updateUrl } } }) => ({
          id,
          username,
          email,
          updateUrl
        }))
      },
      _confirmDeactivateSelectedItems () {
        this.actionToConfirm = '_deactivateSelectedItems'
        this.messageToConfirm = 'Wollen Sie die ausgewählten Benutzer wirklich deaktivieren?'
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      async _deactivateSelectedItems () {
        await Promise.all(this.selectedItems.map(({ updateUrl }) =>
          this.catchError({
            promise: userServices.deactivateUser(updateUrl, this.cancelToken.token),
            instance: this
          })
        ))
        this.resultPaginate(this.resultOptions.page)
      },
    }
  }
</script>
