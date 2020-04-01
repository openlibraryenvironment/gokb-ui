<script>
  import GokbSelectField from '@/shared/components/base/gokb-select-field'

  export default {
    name: 'GokbStateField',
    extends: GokbSelectField,
    created () {
      this.label = 'Status'
      this.selectResourceUrl = 'rest/refdata/categories/KBComponent.Status'
    }
  }
</script>
