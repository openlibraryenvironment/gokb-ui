<script>
  import GokbSelectField from '@/shared/components/base/gokb-select-field'
  import accountModel from '@/shared/models/account-model'

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
        return values.filter(item => (accountModel.hasRole('ROLE_SUPERUSER') || (item.authority !== 'ROLE_SUPERUSER' && item.authority != 'ROLE_ADMIN'))).map(({ id, authority }) => ({ id, name: this.$i18n.t('component.user.role.' + authority), value: authority }))
      }
    }
  }
</script>
