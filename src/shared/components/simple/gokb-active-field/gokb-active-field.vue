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
      }
    },
    mounted () {
      this.items = [{ id: true, name: 'Aktiv' }, { id: false, name: 'Nicht aktiv' }]
    }
  }
</script>
