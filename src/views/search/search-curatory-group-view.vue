<script>

import BaseSearch from "./base-search-view.vue";

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
      return this.isUserAdmin
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
          value: 'organiszation'
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

  }

}



</script>
