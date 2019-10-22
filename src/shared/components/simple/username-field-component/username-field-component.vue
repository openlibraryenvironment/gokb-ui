<script>
  import TextFieldComponent from '@/shared/components/base/text-field-component'

  export default {
    name: 'UsernameFieldComponent',
    extends: TextFieldComponent,
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
      browserAutocomplete: {
        type: String,
        required: false,
        default: 'username',
      },
      rules: {
        type: Array,
        required: false,
        default: () => [
          value => value || 'Bitte erfassen Sie einen Benutzernamen.'
        ]
      },
    },
  }
</script>
