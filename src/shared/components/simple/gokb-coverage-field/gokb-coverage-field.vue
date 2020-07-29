<script>
  import GokbSelectField from '@/shared/components/base/gokb-select-field'

  export default {
    name: 'GokbCoverageField',
    extends: GokbSelectField,
    props: {
      label: {
        type: String,
        required: false,
        default: 'Art',
      }
    },
    created () {
      this.entityName = 'coverage-depth'
    },
    methods: {
      transform (result) {
        const { data: { data: values } } = result || { data: { data: [] } }
        return values.map(({ id, value }) => ({ id, name: value }))
      }
    }
  }
</script>
