<script>
  import GokbSelectField from '@/shared/components/base/gokb-select-field'

  export default {
    name: 'GokbStateField',
    emits: ['update:model-value'],
    extends: GokbSelectField,
    props: {
      label: {
        type: String,
        required: false,
        default: undefined,
      },
      url: {
        type: String,
        required: false,
        default: 'refdata/categories/KBComponent.Status'
      },
      messagePath: {
        type: String,
        required: false,
        default: 'component.general.status'
      }
    },
    computed: {
      localName () {
        return (!!this.messagePath && !!this.localValue) ? this.$i18n.t(this.messagePath + '.' + (this.localValue?.value || this.localValue?.name) + '.label') : this.localValue?.name
      },
    },
    watch: {
      '$i18n.locale' (l) {
        this.fetch()
      }
    },
    created () {
      this.entityName = this.url
      this.stateLabel = this.url.split('/')[2]
    },
    methods: {
      updateItems () {
        this.localizedItems = this.rawItems.map(({ id, value }) => ({
          id,
          value,
          name: !!value ? this.localizeValue(value) : undefined,
          type: 'Refdata Value'
        }))
      },
      localizeValue (val) {
        return this.$i18n ? this.$i18n.t(this.messagePath + '.' + val + '.label') : undefined
      },
      transform (result) {
        if (result?.data?._embedded) {
          const { data: { _embedded: { values } } } = result
          return values
        } else {
          return []
        }
      }
    }
  }
</script>
