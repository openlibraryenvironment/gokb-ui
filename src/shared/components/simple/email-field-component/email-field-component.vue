<script>
  import TextFieldComponent from '@/shared/components/base/text-field-component'

  export default {
    name: 'EmailFieldComponent',
    extends: TextFieldComponent,
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
        default: true,
      },
      prependIcon: {
        type: String,
        required: false,
        default: 'email',
      },
      browserAutocomplete: {
        type: String,
        required: false,
        default: 'email',
      },
      rules: {
        type: Array,
        required: false,
        default: () => [
          value => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || 'Bitte erfassen Sie eine gültige E-Mail Adresse.'
        ]
      },
    },
  }
</script>

<style scoped>
</style>
