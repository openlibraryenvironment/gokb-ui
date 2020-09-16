<script>
  import GokbSearchField from '@/shared/components/base/gokb-search-field'

  export default {
    name: 'GokbTitleField',
    extends: GokbSearchField,
    props: {
      label: {
        type: String,
        required: false,
        default: 'Titel'
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
        return (this.typeFilter ? { type: this.typeFilter } : {})
      }
    },
    created () {
      this.searchServicesResourceUrl = 'rest/titles'
    }
  }
</script>
