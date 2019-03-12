<script>
import SearchInputField from '@/shared/components/SearchInputField'

export default {
  extends: SearchInputField,
  data () {
    return {
    }
  },
  created () {
    this.label = 'Publisher'
    this.queryParameters = {
      baseClass: 'org.gokb.cred.Org',
    }
  },
}
</script>
