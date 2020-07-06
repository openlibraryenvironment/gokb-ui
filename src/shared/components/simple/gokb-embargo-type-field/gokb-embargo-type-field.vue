<script>
  import GokbSelectField from '@/shared/components/base/gokb-select-field'

  export default {
    name: 'GokbEmbargoTypeField',
    extends: GokbSelectField,
    props: {
      label: {
        type: String,
        required: false,
        default: 'Typ',
      },
      returnObject: {
        type: Boolean,
        required: false,
        default: false
      },
    },
    created () {
      this.items = [
        {
          id: 'R',
          name: 'Rolling'
        },
        {
          id: 'P',
          name: 'Static'
        }
      ]
    }
  }
</script>
