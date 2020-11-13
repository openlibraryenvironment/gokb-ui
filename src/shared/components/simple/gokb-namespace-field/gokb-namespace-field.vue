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
      }
    },
    created () {
      this.entityName = 'identifier-namespaces'
      this.searchParams = { targetType: this.targetType || '' }
    },
    methods: {
      transform (result) {
        const { data: { data: values } } = result
        return values.map(ns => ({ id: ns.id, name: (ns.name || ns.value), value: ns.value }))
      }
    }
  }
</script>
