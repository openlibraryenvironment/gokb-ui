<script>
  import GokbSelectField from '@/shared/components/base/gokb-select-field'

  export default {
    name: 'GokbActiveField',
    extends: GokbSelectField,
    emits: ['update:model-value'],
    props: {
      label: {
        type: String,
        required: false,
        default: 'Status',
      },
      returnObject: {
        type: Boolean,
        required: false,
        default: false,
      }
    },
    watch: {
      '$i18n.locale' (l) {
        this.localizedItems = [{ id: 'true', name: this.$i18n.t('component.user.enabled.active.label') }, { id: 'false', name: this.$i18n.t('component.user.enabled.inactive.label') }]
      }
    },
    mounted () {
      this.localizedItems = [{ id: 'true', name: this.$i18n.t('component.user.enabled.active.label') }, { id: 'false', name: this.$i18n.t('component.user.enabled.inactive.label') }]
    }
  }
</script>
