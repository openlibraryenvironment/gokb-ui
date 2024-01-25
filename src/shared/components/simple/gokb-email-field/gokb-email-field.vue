<script>
  import GokbTextField from '@/shared/components/base/gokb-text-field'

  export default {
    name: 'GokbEmailField',
    extends: GokbTextField,
    props: {
      label: {
        type: String,
        required: false,
        default: 'E-Mail',
      },
      type: {
        type: String,
        required: false,
        default: 'email',
      },
      required: {
        type: Boolean,
        required: false,
        default: false,
      },
      prependIcon: {
        type: String,
        required: false,
        default: 'mdi-email',
      },
      autocomplete: {
        type: String,
        required: false,
        default: 'email',
      },
      rules: {
        type: Array,
        required: false,
        default (props) {
          return [v => (((!props.required && (!v || v.length === 0))) || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v)) || props.localError]
        }
      }
    },
    computed: {
      localError () {
        return this.$i18n.t('validation.missingEmail')
      }
    }
  }
</script>
