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
      this.searchServicesResourceUrl = 'rest/identifiers'
    },
    methods: {
      async query (value) {
        const result = await this.catchError({
          promise: this.searchServices.search({
            name: this.search,
            _include: [this.itemValue, this.itemText],
          }, this.cancelToken.token),
          instance: this
        })
        this.items = this.transform(result)
      }
    }
  }
</script>
