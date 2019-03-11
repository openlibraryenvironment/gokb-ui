<script>
import BaseSearch from './BaseSearch'

export default {
  name: 'SearchUser',
  extends: BaseSearch,
  data () {
    return {
    }
  },
  created () {
    this.title = 'Benutzer'
    this.componentType = 'User'
    this.searchInputFields = [
      [
        {
          type: 'v-text-field',
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
          properties: {
            label: 'Status',
          }
        }
      ]
    ]
    this.resultHeaders = [
      {
        text: 'Benutzername',
        align: 'left',
        sortable: false,
        value: 'name?'
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
