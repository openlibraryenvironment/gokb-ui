<script>
import TextFieldComponent from '@/shared/components/base/TextFieldComponent'

export default {
  extends: TextFieldComponent,
  name: 'PasswordFieldComponent',
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
  },
}
</script>

<style scoped>
</style>
