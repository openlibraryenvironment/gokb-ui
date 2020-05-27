<script>
  import GokbSearchField from '@/shared/components/base/gokb-search-field'

  export default {
    name: 'GokbSearchIdentifierField',
    extends: GokbSearchField,
    created () {
      this.label = 'Identifier'
      this.searchServicesResourceUrl = 'rest/identifiers'
    },
  }
</script>
