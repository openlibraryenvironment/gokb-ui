<script>
  import GokbSelectField from '@/shared/components/base/gokb-select-field'

  export default {
    name: 'GokbNamespaceField',
    extends: GokbSelectField,
    props: {
      label: {
        type: String,
        required: false,
        default: 'Namensraum',
      },
      returnObject: {
        type: Boolean,
        required: false,
        default: true
      },
    },
    created () {
      this.entityName = 'identifier-namespaces'
    },
    methods: {
      transform (result) {
        const { data: { data: values } } = result
        return values.map(({ id, value }) => ({ id, name: value }))
      }
    }
  }
</script>
