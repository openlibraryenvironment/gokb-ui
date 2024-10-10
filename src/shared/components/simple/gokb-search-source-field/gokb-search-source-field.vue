<script>
  import GokbSearchField from '@/shared/components/base/gokb-search-field'

  export default {
    name: 'GokbSearchSourceField',
    extends: GokbSearchField,
    emits: ['update:model-value', 'searched'],
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
