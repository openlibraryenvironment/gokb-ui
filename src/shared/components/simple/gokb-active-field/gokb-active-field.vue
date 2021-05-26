<script>
  import GokbSelectField from '@/shared/components/base/gokb-select-field'

  export default {
    name: 'GokbActiveField',
    extends: GokbSelectField,
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
        this.items = [{ id: true, name: this.$i18n.t('component.user.enabled.active.label') }, { id: false, name: this.$i18n.t('component.user.enabled.inactive.label') }]
      }
    },
    mounted () {
      this.items = [{ id: true, name: this.$i18n.t('component.user.enabled.active.label') }, { id: false, name: this.$i18n.t('component.user.enabled.inactive.label') }]
    },
    created () {
      this.entityName = 'active'
    },
    methods: {
      transform (result) {
        const { data: { data: values } } = result
        return values.map(({ id, status }) => ({ id, name: this.$i18n.t('component.user.enabled.active.' + status) }))
      }
    }
  }
</script>
