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
      if (!this.items) {
        this.items = [
          {
            id: 'D',
            name: this.$i18n.t('component.tipp.embargo.unit.day')
          },
          {
            id: 'M',
            name: this.$i18n.t('component.tipp.embargo.unit.month')
          },
          {
            id: 'Y',
            name: this.$i18n.t('component.tipp.embargo.unit.year')
          }
        ]
      }
    }
  }
</script>
