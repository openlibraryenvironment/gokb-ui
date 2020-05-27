<script>
  import GokbSearchField from '@/shared/components/base/gokb-search-field'

  export default {
    name: 'GokbSearchIdentifierField',
    extends: GokbSearchField,
    created () {
      this.label = 'Identifier'
      this.searchServicesResourceUrl = 'rest/identifiers'
    },
    methods: {
      transform (result) {
        const { data: { data } } = result
        return data.map(value => ({ value: value.id, text: value.value }))
      }
    }
  }
</script>
