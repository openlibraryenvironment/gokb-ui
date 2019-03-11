<script>
import BaseSearch from './BaseSearch'

export default {
  name: 'SearchTitle',
  extends: BaseSearch,
  data () {
    return {
    }
  },
  created () {
    this.title = 'Titel'
    this.componentType = 'Title'
    this.searchInputFields = [
      [
        {
          type: 'v-text-field',
          properties: {
            label: 'Name/Titel'
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
          type: 'v-text-field',
          properties: {
            label: 'Publisher'
          }
        },
        {
          type: 'v-text-field',
          properties: {
            label: 'Typ'
          }
        }
      ],
      [
        {
          type: 'v-text-field',
          properties: {
            label: 'Status'
          }
        }
      ]
    ]
    this.resultHeaders = [
      {
        text: 'Name/Titel',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      {
        text: 'Typ',
        align: 'left',
        sortable: false,
        value: 'componentType'
      },
      {
        text: 'Veröffentlicht von',
        align: 'right',
        sortable: false,
        value: ''
      },
      {
        text: 'Veröffentlicht bis',
        align: 'right',
        sortable: false,
        value: ''
      },
    ]
  },
}
</script>

<style scoped>

</style>
