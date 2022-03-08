<script>
  import GokbTextField from '@/shared/components/base/gokb-text-field'

  export default {
    name: 'GokbUsernameField',
    extends: GokbTextField,
    props: {
      label: {
        type: String,
        required: false,
        default: 'Benutzername',
      },
      required: {
        type: Boolean,
        required: false,
        default: true,
      },
      prependIcon: {
        type: String,
        required: false,
        default: 'mdi-account',
      },
      autocomplete: {
        type: String,
        required: false,
        default: 'username',
      },
      rules: {
        type: Array,
        required: false,
        default () {
          return [
            value => !!value || this.$i18n.t('component.user.error.missing.username')
          ]
        }
      }
    },
  }
</script>
