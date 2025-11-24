<script>
  import BaseSearch from './base-search-view'
  import { EDIT_USER_ROUTE } from '@/router/route-paths'
  import account from '@/shared/models/account-model'
  import userServices from '@/shared/services/user-services'

  export default {
    name: 'SearchUser',
    extends: BaseSearch,
    data () {
      return {
        searchFilters: {
          username: undefined,
          curatoryGroupIds: [],
          roleIds: [],
          status: undefined,
        }
      }
    },
    computed: {
      showSelect () {
        return this.isUserAdmin
      },
      searchInputFields () {
        return [
          [
            {
              type: 'GokbTextField',
              name: 'name',
              value: 'username',
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
                width: '100%',
                multiple: true
              }
            },
            {
              type: 'GokbActiveField',
              name: 'status',
              value: 'status'
            }
          ]
        ]
      },
      resultHeaders () {
        return [
          {
            title: this.$i18n.t('component.user.username'),
            align: 'start',
            sortable: false,
            value: 'link'
          },
          {
            title: this.$i18n.t('component.user.enabled.label'),
            align: 'start',
            sortable: false,
            value: 'enabled'
          },
          {
            title: this.$i18n.t('component.user.role.contributor'),
            align: 'start',
            sortable: false,
            value: 'contributor'
          },
          {
            title: this.$i18n.t('component.user.role.editor'),
            align: 'start',
            sortable: false,
            value: 'editor'
          },
          {
            title: this.$i18n.t('component.user.role.API'),
            align: 'start',
            sortable: false,
            value: 'api'
          },
          {
            title: this.$i18n.t('component.user.role.admin'),
            align: 'start',
            sortable: false,
            value: 'admin'
          },
          {
            title: this.$i18n.t('component.general.dateCreated'),
            align: 'end',
            sortable: true,
            value: 'dateCreated'
          }
        ]
      },
      resultActionButtons () {
        return [
          {
            icon: 'mdi-close-circle',
            label: this.$i18n.t('btn.deactivate'),
            disabled: 'isNothingSelected',
            action: '_confirmDeactivateSelectedItems'
          }
        ]
      },
      title () {
        return this.$i18n.tc('component.user.label', 2)
      },
      isAdmin () {
        return account?.loggedIn() && account?.hasRole('ROLE_ADMIN')
      },
      isReadonly () {
        return !this.isAdmin
      },
      showSelect () {
        return this.isAdmin
      }
    },
    watch: {
      isAdmin (val) {
        if (val) {
          this.accessible = true
        } else {
          this.accessible = false
        }
      }
    },
    created () {
      this.searchServicesUrl = 'rest/users'
      this.searchServiceIncludes = 'id,username'
      this.linkSearchParameterValues = {
        link: 'username'
      }

      if (!this.isAdmin) {
        this.accessible = false
      }
    },
    methods: {
      _transformForTable (data) {
        return data.map((item) => ({
          id: item.id,
          link: { value: item.username, route: EDIT_USER_ROUTE, id: 'id' },
          enabled: this.$i18n.t('component.user.enabled.' + (item.status ? 'active' : 'inactive') + '.label'),
          contributor: item.roles.filter(role => role.authority === 'ROLE_CONTRIBUTOR').length > 0 ? this.$i18n.t('default.true') : this.$i18n.t('default.false'),
          editor: item.roles.filter(role => role.authority === 'ROLE_EDITOR').length > 0 ? this.$i18n.t('default.true') : this.$i18n.t('default.false'),
          admin: item.roles.filter(role => role.authority === 'ROLE_ADMIN').length > 0 ? this.$i18n.t('default.true') : this.$i18n.t('default.false'),
          api: item.roles.filter(role => role.authority === 'ROLE_API').length > 0 ? this.$i18n.t('default.true') : this.$i18n.t('default.false'),
          lastUpdated: !!item.lastUpdated ? new Date(item.lastUpdated).toLocaleString('sv').substring(0, 10) : undefined,
          dateCreated: !!item.dateCreated ? new Date(item.dateCreated).toLocaleString('sv').substring(0, 10) : undefined,
          updateUrl: item._links?.update?.href || undefined
        }))
      },
      _confirmDeactivateSelectedItems () {
        this.actionToConfirm = '_deactivateSelectedItems'
        this.messageToConfirm = {
          text: this.$i18n.t('popups.confirm.deactivate.generic'),
          vars: []
        }
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
