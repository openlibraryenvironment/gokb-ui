<script>
  import GokbSearchField from '@/shared/components/base/gokb-search-field'

  export default {
    name: 'GokbSearchEntityField',
    extends: GokbSearchField,
    props: {
      label: {
        type: String,
        required: false,
        default: ''
      }
    },
    created () {
      this.searchServicesResourceUrl = 'rest/entities'
    },
  }
</script>
