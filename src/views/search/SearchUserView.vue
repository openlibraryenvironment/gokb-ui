<script>
import BaseSearch from './BaseSearchView'
import ajaxServices from '@/shared/services/ajax-services'

export default {
  name: 'SearchUser',
  extends: BaseSearch,
  data () {
    return {
    }
  },
  async created () {
    this.title = 'Benutzer'
    this.component = 'g:UserOrganisation'

    const allStates = await ajaxServices.lookup({
      baseClass: 'org.gokb.cred.RefdataValue',
      filter1: 'KBComponent.Status',
      q: ''
    })

    this.searchInputFields = [
      [
        {
          type: 'v-text-field',
          name: 'qp_name',
          properties: {
            label: 'Benutzername'
          }
        },
        {
          type: 'v-select',
          properties: {
            label: 'Gruppen',
            multiple: true,
          }
        }
      ],
      [
        {
          type: 'v-select',
          properties: {
            label: 'Rollen',
            multiple: true,
          }
        },
        {
          type: 'v-select',
          name: 'qp_status',
          properties: {
            label: 'Status',
            items: allStates.values.map(({ id: value, text }) => ({ value, text })),
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
