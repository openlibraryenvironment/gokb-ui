<script>
  import BaseSearch from './base-search-view'
  import { EDIT_USER_ROUTE, ADD_USER_ROUTE } from '@/router/route-paths'
  import userServices from '@/shared/services/user-services'

  export default {
    name: 'SearchUser',
    extends: BaseSearch,
    data () {
      return {
        searchFilters: {
          name: undefined,
          curatoryGroupIds: [],
          roleIds: [],
          status: undefined,
        }
      }
    },
    created () {
      this.title = this.$i18n.tc('component.user.label', 2)
      this.resultActionButtons = [
        {
          icon: 'add',
          label: this.$i18n.t('btn.add'),
          route: ADD_USER_ROUTE,
        },
        {
          icon: 'cancel',
          label: this.$i18n.t('btn.deactivate'),
          disabled: 'isNothingSelected',
          action: '_confirmDeactivateSelectedItems',
        }
      ]

      this.searchInputFields = [
        [
          {
            type: 'GokbTextField',
            name: 'name',
            properties: {
              hideIcon: true,
              label: this.$i18n.t('component.user.username')
            }
          },
          {
            type: 'GokbCuratoryGroupField',
            name: 'curatoryGroupId',
            value: 'curatoryGroupIds',
            properties: {
              label: this.$i18n.tc('component.curatoryGroup.label', 2),
              multiple: true,
            }
          }
        ],
        [
          {
            type: 'GokbRoleField',
            name: 'roleId',
            value: 'roleIds',
            properties: {
              label: this.$i18n.tc('component.user.role.label', 2),
              multiple: true
            }
          },
          {
            type: 'GokbActiveField',
            name: 'status',
            value: 'status',
          }
        ]
      ]
      this.resultHeaders = [
        {
          text: this.$i18n.t('component.user.username'),
          align: 'left',
          sortable: false,
          value: 'link'
        },
        {
          text: 'Enabled',
          align: 'left',
          sortable: false,
          value: 'enabled'
        },
        {
          text: 'Contributor',
          align: 'left',
          sortable: false,
          value: 'contributor'
        },
        {
          text: 'Editor',
          align: 'left',
          sortable: false,
          value: 'editor'
        },
        {
          text: 'Admin',
          align: 'left',
          sortable: false,
          value: 'admin'
        }
      ]
      this.searchServicesUrl = 'rest/users'
      this.searchServiceIncludes = 'id,username'
      this.linkValue = 'username'
    },
    methods: {
      _transformForTable (data) {
        return data.map(({ id, username, roles, enabled, _links: { update: { href: updateUrl } } }) => ({
          id,
          link: { value: username, route: EDIT_USER_ROUTE, id: 'id' },
          enabled: this.$i18n.t('default.' + enabled),
          contributor: roles.filter(role => role.authority === 'ROLE_CONTRIBUTOR').length > 0 ? this.$i18n.t('default.true') : this.$i18n.t('default.false'),
          editor: roles.filter(role => role.authority === 'ROLE_EDITOR').length > 0 ? this.$i18n.t('default.true') : this.$i18n.t('default.false'),
          admin: roles.filter(role => role.authority === 'ROLE_ADMIN').length > 0 ? this.$i18n.t('default.true') : this.$i18n.t('default.false'),
          updateUrl
        }))
      },
      _confirmDeactivateSelectedItems () {
        this.actionToConfirm = '_deactivateSelectedItems'
        this.messageToConfirm = this.$i18n.t('confirm.deactivate.generic')
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
