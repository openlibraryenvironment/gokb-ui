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
      }
    },
    computed: {
      rules () {
        return [
          value => (!value || /^[\d]+$/.test(value)) || this.$i18n.t('validation.numberFormat')
        ]
      }
    }
  }
</script>
