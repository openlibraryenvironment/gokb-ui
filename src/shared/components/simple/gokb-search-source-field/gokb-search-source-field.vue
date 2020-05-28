<script>
  import GokbSearchField from '@/shared/components/base/gokb-search-field'

  export default {
    name: 'GokbSearchSourceField',
    extends: GokbSearchField,
    props: {
      label: {
        type: String,
        required: false,
        default: 'Quelle'
      }
    },
    created () {
      this.searchServicesResourceUrl = 'rest/sources'
    },
  }
</script>
