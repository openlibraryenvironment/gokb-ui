<script>
  import GokbSearchField from '@/shared/components/base/gokb-search-field'

  export default {
    name: 'GokbSearchSourceField',
    extends: GokbSearchField,
    computed: {
      label () {
        return this.$i18n.t('component.general.source')
      }
    },
    created () {
      this.searchServicesResourceUrl = 'rest/sources'
    },
  }
</script>
