<script>
import SearchInputField from '@/shared/components/base/SearchFieldComponent'

export default {
  extends: SearchInputField,
  data () {
    return {
    }
  },
  created () {
    this.label = 'Provider'
    this.queryParameters = {
      baseClass: 'org.gokb.cred.Org',
    }
  },
}
</script>
