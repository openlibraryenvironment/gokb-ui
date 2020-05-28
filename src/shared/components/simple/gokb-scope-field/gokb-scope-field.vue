<script>
  import GokbSelectField from '@/shared/components/base/gokb-select-field'

  export default {
    name: 'GokbScopeField',
    extends: GokbSelectField,
    props: {
      label: {
        type: String,
        required: false,
        default: 'Umfang',
      }
    },
    created () {
      // todo: should be changed to scopes
      this.entityName = 'package-scopes' // 'refdata/categories/Package.Scope'
    },
    methods: {
      transform (result) {
        const { data: { data: values } } = result || { data: { data: [] } }
        return values.map(({ id, value }) => ({ id, name: value }))
      }
    }
  }
</script>
