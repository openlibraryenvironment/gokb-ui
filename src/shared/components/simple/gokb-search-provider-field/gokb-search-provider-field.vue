<script>
  import GokbSearchField from '@/shared/components/base/gokb-search-field'

  export default {
    name: 'GokbSearchProviderField',
    extends: GokbSearchField,
    created () {
      this.label = 'Provider'
      this.searchServicesResourceUrl = 'rest/provider'
    },
  }
</script>
