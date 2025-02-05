<script>
  import GokbSearchField from '@/shared/components/base/gokb-search-field'

  export default {
    name: 'GokbSearchPlatformField',
    extends: GokbSearchField,
    emits: ['update:model-value', 'searched'],
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
      required: {
        type: Boolean,
        required: false,
        default: false
      },
      dense: {
        type: Boolean,
        required: false,
        default: false
      },
      onlyCurrent: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    created () {
      this.searchServicesResourceUrl = 'rest/platforms'
      this.searchParams = { max: 20, es: true }

      if (this.onlyCurrent) {
        this.searchParams.status = 'Current'
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
