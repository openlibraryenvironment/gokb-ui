<script>
  import GokbSelectField from '@/shared/components/base/gokb-select-field'

  export default {
    name: 'GokbNamespaceField',
    extends: GokbSelectField,
    emits: ['update:model-value'],
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
<<<<<<< HEAD
        default: false
=======
        default: undefined
>>>>>>> develop
      }
    },
    computed: {
      localName () {
        return this.localValue?.name || this.localValue?.value
      },
    },
    watch: {
      modelValue: {
        handler (val) {
          if (!!val && !val.name) {
            this.itemTitle = 'value'
          }
          else {
            this.itemTitle = 'name'
          }
        },
        deep: true
      }
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
<<<<<<< HEAD
        return values.filter(ns =>(this.excludeIsxn ? ns.family !== 'isxn' : !!ns.value)).map(ns => ({ id: ns.id, pattern: ns.pattern, name: (ns.name || ns.value), value: ns.value })).sort(({ value: first }, { value: second }) => (first > second) ? 1 : (second > first) ? -1 : 0)
=======
        return values?.map(ns => ({
          id: ns.id,
          pattern: ns.pattern,
          name: (ns.name || ns.value),
          value: ns.value
        })).sort(({ value: first }, { value: second }) => (first > second) ? 1 : (second > first) ? -1 : 0) || []
>>>>>>> develop
      }
    }
  }
</script>
