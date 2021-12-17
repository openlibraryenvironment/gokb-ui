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
      typeFilter: {
        type: String,
        required: false,
        default: undefined
      }
    },
    computed: {
      searchParams () {
        return (this.typeFilter ? { type: this.typeFilter, es: 'true', max: 20 } : { es: 'true', max: 20 })
      }
    },
    created () {
      this.searchServicesResourceUrl = 'rest/titles'
    }
  }
</script>
