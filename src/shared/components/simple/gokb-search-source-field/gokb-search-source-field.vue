<script>
  import GokbSearchField from '@/shared/components/base/gokb-search-field'

  export default {
    name: 'GokbSearchSourceField',
    extends: GokbSearchField,
    created () {
      this.label = 'Quelle'
      this.searchServicesResourceUrl = 'rest/sources'
    },
  }
</script>
