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
        default: true
      }
    },
    created () {
      this.searchServicesResourceUrl = 'rest/titles'
    },
    methods: {
      _include () {
        return 'id,name,dateCreated'
      },

    }
  }
</script>
