<script>
  import GokbSearchField from '@/shared/components/base/gokb-search-field'

  export default {
    name: 'GokbSearchOrganisationField',
    extends: GokbSearchField,
    props: {
      label: {
        type: String,
        required: false,
        default: 'Organization'
      }
    },
    created () {
      this.searchServicesResourceUrl = 'rest/organizations'
    },
  }
</script>
