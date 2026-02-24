<script>
import GokbSelectField from '@/shared/components/base/gokb-select-field'

export default {
  name: 'GokbWebendpointField',
  extends: GokbSelectField,
  props: {
    label: {
      type: String,
      required: false,
      default: 'Endpoint Configs',
    },
    filterByProtocol: {
      type: String,
      required: false
    }
  },
  created () {
    this.entityName = 'web-endpoint'
    if (this.filterByProtocol) {
      this.searchParams = { method:this.filterByProtocol }
    }

  }

}
</script>
