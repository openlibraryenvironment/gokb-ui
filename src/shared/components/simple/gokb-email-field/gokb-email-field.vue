<script>
  import GokbTextField from '@/shared/components/base/gokb-text-field'

  export default {
    name: 'GokbEmailField',
    extends: GokbTextField,
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
        default: false,
      },
      prependIcon: {
        type: String,
        required: false,
        default: 'email',
      },
      autocomplete: {
        type: String,
        required: false,
        default: 'email',
      }
    },
    computed: {
      rules () {
        return [((this.required && this.value !== null) || (!this.required && !this.value) || this.$i18n.t('validation.missingEmail')), (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.value) || this.$i18n.t('validation.missingEmail'))]
      }
    }
  }
</script>
