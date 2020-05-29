<script>
  import GokbSearchField from '@/shared/components/base/gokb-search-field'

  export default {
    name: 'GokbSearchPlatformField',
    extends: GokbSearchField,
    props: {
      label: {
        type: String,
        required: false,
        default: 'Plattform'
      }
    },
    created () {
      this.searchServicesResourceUrl = 'rest/platform'
    },
  }
</script>
