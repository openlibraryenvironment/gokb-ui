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
      },
      rules: {
        type: Array,
        required: false,
        default () {
          return [v => ((!this.required && !v) || /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/.test(v)) || this.$i18n.t('component.tipp.url.error')]
        }
      }
    }
  }
</script>
