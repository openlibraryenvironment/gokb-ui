<script>
  import GokbSearchField from '@/shared/components/base/gokb-search-field'

  export default {
    name: 'GokbSearchPublisherField',
    extends: GokbSearchField,
    data () {
      return {}
    },
    created () {
      this.label = 'Publisher'
      this.queryParameters = {
        baseClass: 'org.gokb.cred.Org',
      }
    },
  }
</script>
