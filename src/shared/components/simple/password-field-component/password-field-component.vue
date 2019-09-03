<script>
  import TextFieldComponent from '@/shared/components/base/text-field-component'

  export default {
    name: 'PasswordFieldComponent',
    extends: TextFieldComponent,
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
      required: {
        type: Boolean,
        required: false,
        default: true,
      },
      prependIcon: {
        type: String,
        required: false,
        default: 'lock',
      },
      browserAutocomplete: {
        type: String,
        required: false,
        default: 'password',
      },
      rules: {
        type: Array,
        required: false,
        default: () => [
          value => value || 'Bitte erfassen Sie ein Kennwort.'
        ]
      },
    },
  }
</script>

<style scoped>
</style>
