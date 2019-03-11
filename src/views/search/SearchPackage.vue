<script>
import BaseSearch from './BaseSearch'

export default {
  name: 'SearchPackage',
  extends: BaseSearch,
  data () {
    return {
    }
  },
  created () {
    this.title = 'Pakete'
    this.componentType = 'Package'
    this.searchInputFields = [
      [
        {
          type: 'v-text-field',
          properties: {
            label: 'Name'
          }
        },
        {
          type: 'v-select',
          properties: {
            label: 'Kuratoren',
            multiple: true,
          }
        }
      ],
      [
        {
          type: 'v-select',
          properties: {
            label: 'Provider',
            multiple: true,
          }
        },
        {
          type: 'v-text-field',
          properties: {
            label: 'Identifier'
          }
        }
      ],
      [
        {
          type: 'v-select',
          properties: {
            label: 'Status'
          }
        },
      ]
    ]
    this.resultHeaders = [
      {
        text: 'Name',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      {
        text: 'Provider',
        align: 'left',
        sortable: false,
        value: 'provider'
      },
      {
        text: 'Plattform',
        align: 'left',
        sortable: false,
        value: 'platform?'
      },
    ]
  },
}
</script>

<style scoped>
</style>
