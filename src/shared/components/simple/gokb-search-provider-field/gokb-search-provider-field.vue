<script>
  import GokbSearchField from '@/shared/components/base/gokb-search-field'

  export default {
    name: 'GokbSearchProviderField',
    extends: GokbSearchField,
    props: {
      label: {
        type: String,
        required: false,
        default: ''
      }
    },
    created () {
      this.searchServicesResourceUrl = 'rest/provider'
      this.searchParams = { max: 20, es: true }
    },
  }
</script>
