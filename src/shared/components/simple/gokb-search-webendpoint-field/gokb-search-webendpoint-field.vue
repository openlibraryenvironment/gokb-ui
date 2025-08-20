<script>
import GokbSelectField from '@/shared/components/base/gokb-select-field'

export default {
  name: 'GokbSearchWebendpointField',
  extends: GokbSelectField,
  props: {
    label: {
      type: String,
      required: false,
      default: 'Endpoint Configs',
    }
  },
  created () {
    this.entityName = 'webHookEndpoint'
  }

}
</script>
