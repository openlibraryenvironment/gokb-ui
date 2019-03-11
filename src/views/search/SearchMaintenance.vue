<script>
import BaseSearch from './BaseSearch'

export default {
  name: 'SearchMaintenance',
  extends: BaseSearch,
  data () {
    return {
    }
  },
  created () {
    this.title = 'Pflege'
    this.componentType = '?'
    this.searchInputFields = [
      [
        {
          type: 'v-text-field',
          properties: {
            label: 'Name/Titel'
          }
        },
        {
          type: 'v-select',
          properties: {
            label: 'Ersteller',
            multiple: true,
          }
        }
      ],
      [
        {
          type: 'v-select',
          properties: {
            label: 'Kuratoren',
            multiple: true,
          }
        },
        {
          type: 'v-text-field',
          properties: {
            label: 'Fällig Am'
          }
        }
      ]
    ]
  },
}
</script>

<style scoped>

</style>
