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
      }
    },
    created () {
      this.entityName = this.url
    },
    methods: {
      transform (result) {
        const { data: { _embedded: { values } } } = result
        return values.map(({ id, value }) => ({ id, name: value }))
      }
    }
  }
</script>
