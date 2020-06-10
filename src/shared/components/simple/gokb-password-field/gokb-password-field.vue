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
      autocomplete: {
        type: String,
        required: false,
        default: 'current-password',
      },
      rules: {
        type: Array,
        required: false,
        default: () => [
          value => !!value || 'Bitte erfassen Sie ein Kennwort.'
        ]
      },
    },
  }
</script>
