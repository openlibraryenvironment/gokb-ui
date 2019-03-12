<script>
import BaseSearch from './BaseSearch'
import { all } from '@/shared/models/status'
import PublisherInputField from '@/shared/components/PublisherInputField'
import ajaxServices from '@/shared/services/ajax-services'

export default {
  name: 'SearchTitle',
  extends: BaseSearch,
  components: { PublisherInputField },
  data () {
    return {
    }
  },
  async created () {
    const allTypes = await ajaxServices.lookup({
      baseClass: 'org.gokb.cred.RefdataValue',
      filter1: 'TitleInstance.Medium',
      q: '',
    })

    this.title = 'Titel'
    this.component = 'g:1titles'
    this.searchInputFields = [
      [
        {
          type: 'v-text-field',
          name: 'qp_name',
          properties: {
            label: 'Name/Titel'
          }
        },
        {
          type: 'v-text-field',
          name: 'qp_identifier',
          properties: {
            label: 'Identifier'
          }
        }
      ],
      [
        {
          type: 'publisher-input-field',
          name: 'qp_pub',
        },
        {
          type: 'v-select',
          name: 'qp_medium',
          properties: {
            label: 'Typ',
            items: allTypes.values.map(({ id: value, text }) => ({ value, text })),
          }
        }
      ],
      [
        {
          type: 'v-select',
          name: 'qp_status',
          properties: {
            label: 'Status',
            items: all
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
