<script>
import TextFieldComponent from '@/shared/components/base/TextFieldComponent'

export default {
  extends: TextFieldComponent,
  name: 'EmailFieldComponent',
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
  },
}
</script>

<style scoped>
</style>
