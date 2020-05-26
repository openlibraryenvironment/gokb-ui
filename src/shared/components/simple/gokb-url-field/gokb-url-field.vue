<script>
  import GokbTextField from '@/shared/components/base/gokb-text-field'

  export default {
    name: 'GokbUrlField',
    extends: GokbTextField,
    props: {
      type: {
        type: String,
        required: false,
        default: 'url'
      },
      label: {
        type: String,
        required: false,
        default: 'URL'
      }
    },
  }
</script>
