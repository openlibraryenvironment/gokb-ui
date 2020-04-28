<script>
  import GokbSelectField from '@/shared/components/base/gokb-select-field'

  export default {
    name: 'GokbStateField',
    extends: GokbSelectField,
    props: {
      label: {
        type: String,
        required: false,
        default: 'Status',
      }
    },
    created () {
      this.selectResourceUrl = 'rest/refdata/categories/KBComponent.Status'
    }
  }
</script>
