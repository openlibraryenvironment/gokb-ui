<script>
  import GokbSearchField from '@/shared/components/base/gokb-search-field'

  export default {
    name: 'GokbSearchSourceField',
    extends: GokbSearchField,
    computed: {
      label () {
        return this.$i18n.tc('component.source.label')
      }
    },
    created () {
      this.searchServicesResourceUrl = 'rest/sources'
    },
  }
</script>
