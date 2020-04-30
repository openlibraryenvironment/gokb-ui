<script>
  import GokbSelectField from '@/shared/components/base/gokb-select-field'

  export default {
    name: 'GokbCuratoryGroupField',
    extends: GokbSelectField,
    props: {
      label: {
        type: String,
        required: false,
        default: 'Kuratoren',
      }
    },
    created () {
      this.entityName = 'curatoryGroups'
    }
  }
</script>
