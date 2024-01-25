<script>
  import GokbSearchField from '@/shared/components/base/gokb-search-field'

  export default {
    name: 'GokbSearchIdentifierField',
    extends: GokbSearchField,
    props: {
      label: {
        type: String,
        required: false,
        default: 'Identifier'
      },
      itemText: {
        type: String,
        required: false,
        default: 'value'
      },
    },
    created () {
      this.searchServicesResourceUrl = `rest/identifiers`
    },
    methods: {
      async query (value) {
        // console.log('query', this.modelValue, this.localValue, this.search, value)
        const result = await this.catchError({
          promise: this.searchServices.search({
            targetType: this.$attrs.entity,
            name: this.modelValue,
            _include: [this.itemValue, this.itemText],
          }, this.cancelToken.token),
          instance: this
        })
        this.items = result?.data?.data
      }
    }
  }
</script>
