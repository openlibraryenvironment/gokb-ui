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
        default: 'lock',
      },
      autocomplete: {
        type: String,
        required: false,
        default: 'current-password',
      }
    },
    computed: {
      rules () {
        return [
          value => !!value || this.$i18n.t('component.user.error.missing.password')
        ]
      }
    }
  }
</script>
