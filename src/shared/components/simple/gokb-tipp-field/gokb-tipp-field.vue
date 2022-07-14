<script>
  import GokbSearchField from '@/shared/components/base/gokb-search-field'

  export default {
    name: 'GokbTippField',
    extends: GokbSearchField,
    props: {
      label: {
        type: String,
        required: false,
        default: 'Pakettitel'
      },
      pkgFilter: {
        type: Number,
        required: false,
        default: undefined
      }
    },
    computed: {
      searchParams () {
        return { pkg: this.pkgFilter, max: 20 }
      }
    },
    created () {
      this.searchServicesResourceUrl = 'rest/tipps'
    }
  }
</script>
