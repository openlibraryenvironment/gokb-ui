<script>
  import GokbSearchField from '@/shared/components/base/gokb-search-field'

  export default {
    name: 'GokbEntityField',
    extends: GokbSearchField,
    props: {
      label: {
        type: String,
        required: false,
        default: 'Komponente'
      },
      allowNewValues: {
        type: Boolean,
        required: false,
        default: false
      },
      typeFilter: {
        type: String,
        required: false,
        default: undefined
      }
    },
    computed: {
      searchParams () {
        return (this.typeFilter ? { componentType: this.typeFilter } : {})
      }
    },
    created () {
      this.searchServicesResourceUrl = 'rest/entities'
    }
  }
</script>
