<script>
  import GokbSearchField from '@/shared/components/base/gokb-search-field'

  export default {
    name: 'GokbSearchProviderField',
    extends: GokbSearchField,
    props: {
      label: {
        type: String,
        required: false,
        default: 'Provider'
      }
    },
    created () {
      // this.label = 'Provider'
      this.searchServicesResourceUrl = 'rest/provider'
    },
  }
</script>
