<script>
  import GokbTextField from '@/shared/components/base/gokb-text-field'

  export default {
    name: 'GokbPasswordField',
    extends: GokbTextField,
    props: {
      label: {
        type: String,
        required: false,
        default: 'Kennwort',
      },
      type: {
        type: String,
        required: false,
        default: 'password',
      },
      prependIcon: {
        type: String,
        required: false,
        default: 'mdi-lock',
      },
      autocomplete: {
        type: String,
        required: false,
        default: 'current-password',
      },
      rules: {
        type: Array,
        required: false,
        default (props) {
          return [v => (v?.length > 0 || !props.required) || props.localError]
        }
      }
    },
    computed: {
      localError () {
        return this.$i18n.t('component.user.error.missing.password')
      }
    }
  }
</script>
