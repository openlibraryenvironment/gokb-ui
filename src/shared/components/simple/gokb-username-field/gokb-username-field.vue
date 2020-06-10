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
        default: 'person',
      },
      autocomplete: {
        type: String,
        required: false,
        default: 'username',
      },
      rules: {
        type: Array,
        required: false,
        default: () => [
          value => !!value || 'Bitte erfassen Sie einen Benutzernamen.'
        ]
      },
    },
  }
</script>
