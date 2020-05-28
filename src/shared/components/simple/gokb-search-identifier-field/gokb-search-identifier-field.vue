<script>
  import GokbSearchField from '@/shared/components/base/gokb-search-field'

  export default {
    name: 'GokbSearchIdentifierField',
    extends: GokbSearchField,
    props: {
      label: {
        type: String,
        required: false,
        default: 'Identifier'
      }
    },
    created () {
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
