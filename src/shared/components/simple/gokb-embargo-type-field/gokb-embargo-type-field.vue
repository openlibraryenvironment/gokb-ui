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
      this.rawItems = [
        {
          id: 'R',
          name: this.$i18n.t('component.tipp.embargo.type.rolling')
        },
        {
          id: 'P',
          name: this.$i18n.t('component.tipp.embargo.type.period')
        }
      ]
    }
  }
</script>
