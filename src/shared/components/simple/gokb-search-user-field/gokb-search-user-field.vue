<script>
  import GokbSearchField from '@/shared/components/base/gokb-search-field'

  export default {
    name: 'GokbSearchSourceField',
    extends: GokbSearchField,
    props: {
      label: {
        type: String,
        required: false,
        default: 'Benutzer'
      },
      itemText: {
        type: String,
        required: false,
        default: 'username'
      },

    },
    created () {
      this.searchServicesResourceUrl = 'rest/users'
    },
  }
</script>
