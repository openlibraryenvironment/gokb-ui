<script>
import BaseSearch from './BaseSearch'
import { all } from '@/shared/models/status'
import ProviderInputField from '@/shared/components/ProviderInputField'
import ajaxServices from '@/shared/services/ajax-services'

export default {
  name: 'SearchPackage',
  extends: BaseSearch,
  components: { ProviderInputField },
  data () {
    return {
      providerItems: undefined,
      providerIsLoading: false,
      providerSearchField: undefined,
    }
  },
  async created () {
    this.title = 'Pakete'
    this.component = 'g:1packages'
    const allCuratorGroups = await ajaxServices.lookup({
      baseClass: 'org.gokb.cred.CuratoryGroup',
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
            items: all
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
