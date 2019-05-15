<script>
import BaseSearch from './BaseSearchView'
import ajaxServices from '@/shared/services/ajax-services'

export default {
  name: 'SearchMaintenance',
  extends: BaseSearch,
  data () {
    return {
    }
  },
  async created () {
    this.title = 'Pflege'
    this.component = '?'
    const allCuratorGroups = await ajaxServices.lookup({
      baseClass: 'org.gokb.cred.CuratoryGroup',
      q: ''
    })

    const allUsers = await ajaxServices.lookup({
      baseClass: 'org.gokb.cred.User',
      q: ''
    })

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
            items: allUsers.values.map(({ id: value, text }) => ({ value, text })),
          }
        }
      ],
      [
        {
          type: 'v-select',
          properties: {
            label: 'Kuratoren',
            multiple: true,
            items: allCuratorGroups.values.map(({ id: value, text }) => ({ value, text })),
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
