<script>
  import GokbSearchField from '@/shared/components/base/gokb-search-field'

  export default {
    name: 'GokbSearchPlatformField',
    extends: GokbSearchField,
    props: {
      label: {
        type: String,
        required: false,
        default: ''
      },
      queryFields: {
        type: Array,
        required: false,
        default() {
          return []
        }
      },
      disableIfLinked: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    created () {
      this.searchServicesResourceUrl = 'rest/platforms'
      this.searchParams = { max: 20, es: true }
      if (this.queryFields.length > 0 && this.queryFields[0].length > 0){
        this.searchParams["qfields"] = this.queryFields.join("&")
      }
    },
    methods: {
      transform (result) {
        const { data: { data } } = result
        return data?.map(item => ({ ...item, disabled: (this.disableIfLinked && !!item.provider ? true : false), disabledMessage: (this.disableIfLinked && !!item.provider ? 'component.platform.conflict.alreadyLinked' : null) }))
      },
    }
  }
</script>
