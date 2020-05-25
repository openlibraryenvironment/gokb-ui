<script>
  import GokbSelectField from '@/shared/components/base/gokb-select-field'

  export default {
    name: 'GokbActiveField',
    extends: GokbSelectField,
    props: {
      label: {
        type: String,
        required: false,
        default: 'Status',
      },
      returnObject: {
        type: Boolean,
        required: false,
        default: false,
      }
    },
    mounted () {
      this.items = [{ id: true, name: 'Aktiv' }, { id: false, name: 'Nicht aktiv' }]
    }
  }
</script>
