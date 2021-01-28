<script>
  import GokbSearchField from '@/shared/components/base/gokb-search-field'

  export default {
    name: 'GokbSearchPublisherField',
    extends: GokbSearchField,
    props: {
      label: {
        type: String,
        required: false,
        default: 'Publisher'
      }
    },
    created () {
      this.searchServicesResourceUrl = 'rest/publisher'
      this.searchParams = { limit: 20 }
    },
  }
</script>
