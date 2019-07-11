<script>
import TextFieldComponent from '@/shared/components/base/TextFieldComponent'

export default {
  extends: TextFieldComponent,
  name: 'UsernameFieldComponent',
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

<style scoped>
</style>
