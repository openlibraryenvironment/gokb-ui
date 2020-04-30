<script>
  import GokbSelectField from '@/shared/components/base/gokb-select-field'

  export default {
    name: 'GokbRoleField',
    extends: GokbSelectField,
    props: {
      label: {
        type: String,
        required: false,
        default: 'Rolle',
      }
    },
    created () {
      this.entityName = 'roles'
    },
    methods: {
      transform (result) {
        const { data: { data: values } } = result
        return values.map(({ id, authority }) => ({ id, name: authority }))
      }
    }
  }
</script>
