<script>
  import GokbSelectField from '@/shared/components/base/gokb-select-field'

  export default {
    name: 'GokbNamespaceField',
    extends: GokbSelectField,
    searchParams: {},
    props: {
      returnObject: {
        type: Boolean,
        required: false,
        default: true
      },
      targetType: {
        type: String,
        required: false,
        default: undefined
      },
      excludeIsxn: {
        type: Boolean,
        required: false,
        default: undefined
      }
    },
    computed: {
      localName () {
        return this.localValue?.name || this.localValue?.value
      },
    },
    created () {
      this.entityName = 'identifier-namespaces'
      if (!!this.targetType) {
        this.searchParams = { targetType: this.targetType }
      }
      if (this.excludeIsxn) {
        this.searchParams.no_isxn = true
      }
    },
    methods: {
      transform (result) {
        const { data: { data: values } } = result
        return values.map(ns => ({ id: ns.id, pattern: ns.pattern, name: (ns.name || ns.value), value: ns.value })).sort(({ value: first }, { value: second }) => (first > second) ? 1 : (second > first) ? -1 : 0)
      }
    }
  }
</script>
