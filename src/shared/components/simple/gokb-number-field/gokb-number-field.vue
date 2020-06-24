<script>
  import GokbTextField from '@/shared/components/base/gokb-text-field'

  export default {
    name: 'GokbNumberField',
    extends: GokbTextField,
    props: {
      type: {
        type: String,
        required: false,
        default: 'number'
      },
      value: {
        type: Number,
        required: true,
        default: 0,
      },

    },
  }
</script>
