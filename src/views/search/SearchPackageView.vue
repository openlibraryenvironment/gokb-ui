<script>
import BaseSearch from './BaseSearchView'
import ProviderInputField from '@/shared/components/simple/SearchProviderFieldComponent'
import ajaxServices from '@/shared/services/ajax-services'

export default {
  name: 'SearchPackage',
  extends: BaseSearch,
  components: { ProviderInputField },
  data () {
    return {
    }
  },
  async created () {
    this.title = 'Pakete'
    this.component = 'g:1packages'
    const allCuratorGroups = await ajaxServices.lookup({
      baseClass: 'org.gokb.cred.CuratoryGroup',
      q: ''
    })
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
            label: 'Name',
          }
        },
        {
          type: 'v-select',
          name: 'qp_curgroup',
          properties: {
            label: 'Kuratoren',
            multiple: true,
            items: allCuratorGroups.values.map(({ id: value, text }) => ({ value, text })),
          }
        }
      ],
      [
        {
          type: 'provider-input-field',
          name: 'qp_provider',
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
          type: 'v-select',
          name: 'qp_status',
          properties: {
            label: 'Status',
            items: allStates.values.map(({ id: value, text }) => ({ value, text })),
          }
        },
      ]
    ]
    this.resultHeaders = [
      {
        text: 'Name',
        align: 'left',
        sortable: false,
        value: 'Name'
      },
      {
        text: 'Provider',
        align: 'left',
        sortable: false,
        value: 'Provider'
      },
      {
        text: 'Plattform',
        align: 'left',
        sortable: false,
        value: 'Nominal Platform'
      },
    ]
  },
}
</script>

<style scoped>
</style>
