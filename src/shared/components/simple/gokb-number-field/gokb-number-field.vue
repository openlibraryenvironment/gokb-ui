<script>
  import GokbTextField from '@/shared/components/base/gokb-text-field'

  export default {
    name: 'GokbNumberField',
    extends: GokbTextField,
    props: {
      value: {
        type: [Number, String],
        required: false,
        default: undefined
      },
      dense: {
        type: Boolean,
        required: false,
        default: false
      },
      rules: {
        type: Array,
        required: false,
        default () {
          return [v => ((/^[\d]+$/.test(v)) || (!this.required && (!v || v.length === 0))) || this.$i18n.t('validation.numberFormat')]
        }
      }
    }
  }
</script>
