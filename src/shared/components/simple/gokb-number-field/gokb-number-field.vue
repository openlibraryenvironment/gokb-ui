<script>
  import GokbTextField from '@/shared/components/base/gokb-text-field'

  export default {
    name: 'GokbNumberField',
    extends: GokbTextField,
    emits: ['update:model-value', 'click:append'],
    props: {
      rules: {
        type: Array,
        required: false,
        default (props) {
          return [v => ((/^[\d]+$/.test(v)) || (!props.required && (!v || v.length === 0))) || props.localError]
        }
      },
      type: {
        type: String,
        default: 'number'
      }
    },
    computed: {
      localError () {
        return this.$i18n.t('validation.numberFormat')
      }
    }
  }
</script>
