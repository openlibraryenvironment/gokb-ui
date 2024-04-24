<script>
  import GokbTextField from '@/shared/components/base/gokb-text-field'
  import genericServices from '@/shared/services/generic-entity-services'
  import { createCancelToken } from '@/shared/services/http'

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
        default: undefined
      }
    },
    watch: {
      localValue (lv) {
        this.validate()
      }
    },
    methods: {
      async validate () {
        const validResult = await genericServices('rest/entities').checkUrl(this.localValue, createCancelToken.token)

        if (validResult.data?.result === 'ERROR') {
          if (!this.localErrorMessages || this.localErrorMessages.length === 0) {
            this.localErrorMessages = [this.$i18n.t('validation.urlForm')]
            this.$emit('valid', false)
          }
        }
        else {
          if (!!this.localErrorMessages) {
           this.localErrorMessages = undefined
          }

          this.$emit('valid', true)
        }
      }
    }
  }
</script>
