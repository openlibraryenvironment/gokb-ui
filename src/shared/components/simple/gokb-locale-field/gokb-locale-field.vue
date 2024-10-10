<script>
  import GokbSelectField from '@/shared/components/base/gokb-select-field'

  export default {
    name: 'GokbLocaleField',
    extends: GokbSelectField,
    emits: ['update:model-value'],
    props: {
      label: {
        type: String,
        required: false,
        default: 'Locale',
      },
      url: {
        type: String,
        required: false,
        default: 'refdata/categories/KBComponent.Language'
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
        return this.localValue?.value || this.localValue?.name
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
          return values.map(({ id, value }) => ({ id, name: value, type: 'Refdata Value' }))
        } else {
          return []
        }
      }
    }
  }
</script>
