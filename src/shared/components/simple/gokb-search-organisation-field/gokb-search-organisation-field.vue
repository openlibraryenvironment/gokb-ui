<script>
  import GokbSearchField from '@/shared/components/base/gokb-search-field'

  export default {
    name: 'GokbSearchOrganisationField',
    extends: GokbSearchField,
    props: {
      label: {
        type: String,
        required: false,
        default: ''
      }
    },
    created () {
      this.searchServicesResourceUrl = 'rest/orgs'
      this.searchParams = { max: 20, es: true }
    },
  }
</script>
