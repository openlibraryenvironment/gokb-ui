<script>
  import GokbSelectField from '@/shared/components/base/gokb-select-field'

  export default {
    name: 'GokbStateField',
    extends: GokbSelectField,
    props: {
      label: {
        type: String,
        required: false,
        default: 'Status',
      },
      url: {
        type: String,
        required: false,
        default: 'refdata/categories/KBComponent.Status'
      },
      messagePath: {
        type: String,
        required: false,
        default: undefined
      },
      dense: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    computed: {
      localName () {
        return (this.messagePath && this.localValue) ? this.$i18n.t(this.messagePath + '.' + (this.localValue?.value || this.localValue?.name) + '.label') : this.localValue?.name
      },
    },
    watch: {
      '$i18n.locale' (l) {
        this.fetch()
      }
    },
    created () {
      this.entityName = this.url
    },
    methods: {
      transform (result) {
        if (result?.data?._embedded) {
          const { data: { _embedded: { values } } } = result
          return values.map(({ id, value, type }) => ({ id, name: (this.messagePath ? this.$i18n.t(this.messagePath + '.' + value + '.label') : value), value, type: 'Refdata Value' }))
        } else {
          return []
        }
      }
    }
  }
</script>
