<script>
import BaseSearch from './BaseSearch'

export default {
  name: 'SearchReview',
  extends: BaseSearch,
  data () {
    return {
    }
  },
  created () {
    this.title = 'Reviews'
    this.componentType = 'Review'
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
            label: 'Komponente'
          }
        },
        {
          type: 'v-select',
          properties: {
            label: 'Reviewer',
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
          type: 'v-checkbox',
          properties: {
            label: 'Abgeschlossen Anzeigen'
          }
        }
      ]
    ]
  },
}
</script>

<style scoped>

</style>
