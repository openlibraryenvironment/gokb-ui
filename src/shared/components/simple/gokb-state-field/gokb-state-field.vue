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
      }
    },
    created () {
      this.entityName = 'refdata/categories/KBComponent.Status'
    },
    methods: {
      transform (result) {
        const { data: { _embedded: { values } } } = result
        return values.map(({ id, value }) => ({ id, name: value }))
      }
    }
  }
</script>
