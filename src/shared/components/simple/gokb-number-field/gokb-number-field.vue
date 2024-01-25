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
        default (props) {
          return [v => ((/^[\d]+$/.test(v)) || (!props.required && (!v || v.length === 0))) || props.localError]
        }
      }
    },
    computed: {
      localError () {
        return this.$i18n.t('validation.numberFormat')
      }
    }
  }
</script>
