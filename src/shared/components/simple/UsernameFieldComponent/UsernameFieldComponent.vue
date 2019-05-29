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
  },
}
</script>

<style scoped>
</style>
