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
        default()  {
          return ['name', 'altname', 'primaryUrl']
        }
      },
      disableIfLinked: {
        type: Boolean,
        required: false,
        default: false
      },
      provider: {
        type: Number,
        required: false,
        default: undefined
      }
    },
    created () {
      this.searchServicesResourceUrl = 'rest/platforms'
      this.searchParams = { max: 20, es: true }
    },
    watch: {
      provider (val) {
        this.searchParams['provider'] = val
        this.clear()
        this.query({ text: "" })
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
