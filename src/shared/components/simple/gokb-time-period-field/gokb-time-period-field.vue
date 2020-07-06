<script>
  import GokbSelectField from '@/shared/components/base/gokb-select-field'

  export default {
    name: 'GokbTimePeriodField',
    extends: GokbSelectField,
    props: {
      label: {
        type: String,
        required: false,
        default: 'Einheit',
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
          id: 'D',
          name: 'Tag(e)'
        },
        {
          id: 'M',
          name: 'Monat(e)'
        },
        {
          id: 'Y',
          name: 'Jahr(e)',
        }
      ]
    }
  }
</script>
