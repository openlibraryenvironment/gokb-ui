<script>
  import GokbSearchField from '@/shared/components/base/gokb-search-field'

  export default {
    name: 'GokbSearchProviderField',
    extends: GokbSearchField,
    data () {
      return {}
    },
    created () {
      this.label = 'Provider'
      this.queryParameters = {
        baseClass: 'org.gokb.cred.Org',
      }
    },
  }
</script>
