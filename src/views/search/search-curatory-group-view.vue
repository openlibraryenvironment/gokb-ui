<script>

import BaseSearch from "./base-search-view.vue";
import account from '@/shared/models/account-model';

export default {
  name: 'SearchCuratoryGroup',
  extends: BaseSearch,
  data() {
    return {
      searchFilters: {
        curatoryGroupName: undefined,
        eMail: undefined,
        organizationType: undefined,
        type: undefined,
        status: undefined,
      }
    }
  },
  computed: {
    showSelect() {
      return this.isAdmin
    },
    title () {
      // return this.$i18n.tc('component.user.label', 2)
      return "Kuratorengruppen"
    },
    isAdmin () {
      return account?.loggedIn() && account?.hasRole('ROLE_ADMIN')
    },
    isReadonly () {
      return !this.isAdmin
    },
    searchInputFields() {
      return [
        [
          {
            type: 'GokbTextField',
            name: 'curatoryGroupName',
            value: 'curatoryGroupName',
            properties: {
              hideIcon: true,
              label: 'Kuratorengruppe'
            }
          },
          {
            type: 'GokbTextField',
            name: 'eMail',
            value: 'eMail',
            properties: {
              hideIcon: true,
              label: 'E-Mail'
            }
          }
        ],
        [
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
          title: 'Name',
          align: 'start',
          sortable: true,
          value: 'name'
        },
        {
          title: 'E-Mail',
          align: 'start',
          sortable: true,
          value: 'mail'
        },
        {
          title: 'Organisationstyp',
          align: 'start',
          sortable: false,
          value: 'organization'
        },
        {
          title: 'Typ',
          align: 'start',
          sortable: false,
          value: 'type'
        },
        {
          title: 'Status',
          align: 'start',
          sortable: false,
          value: 'status'
        }
      ]
    },

  }, // end computed
  watch: {
    isAdmin (val) {
      if (val) {
        this.accessible = true
      } else {
        this.accessible = false
      }
    }
  }, // end watch
  created () {
    this.searchServicesUrl = 'rest/curatoryGroups'
    // this.searchServiceIncludes = 'id,username'
    // this.linkSearchParameterValues = {
    //  link: 'username'
    // }

    if (!this.isAdmin) {
      this.accessible = false
    }
  },
  methods: {
    _transformForTable (data) {
      console.log("++++: ", data)
      return data.map((item) => ({
        id: item.id,
        name: item.name,
        mail: item.email,
        organization: item.organizationType.name,
        type: item.type?.name,
        status: item.status?.name,
        //lastUpdated: !!item.lastUpdated ? new Date(item.lastUpdated).toLocaleString('sv').substring(0, 10) : undefined,
        //dateCreated: !!item.dateCreated ? new Date(item.dateCreated).toLocaleString('sv').substring(0, 10) : undefined,
        updateUrl: item._links?.update?.href || undefined
      }))
    }
  }

}



</script>
