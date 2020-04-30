<template>
  <v-autocomplete
    v-model="localValue"
    :items="items"
    :label="label"
    :loading="loading"
    :placeholder="placeholder"
    :rules="rules"
    :search-input.sync="search"
    clearable
    hide-details
    hide-no-data
    no-filter
  />
</template>

<script>
  import BaseComponent from '@/shared/base-component'
  import searchServices from '@/shared/services/search-services'

  export default {
    name: 'GokbSearchField',
    extends: BaseComponent,
    searchServicesResourceUrl: undefined,
    data () {
      return {
        label: undefined,
        placeholder: undefined,
        rules: undefined,
        loading: false,
        items: [],
        search: null,
      }
    },
    computed: {
      localValue: {
        get () {
          // console.log('get', this.label, this.value)
          return this.value?.value
        },
        set (localValue) {
          // console.log('set', this.label, localValue, this.items)
          this.$emit('input', localValue)
        }
      },
    },
    watch: {
      search (value) {
        value && value !== this.value?.value && value.length > 2 && this.query(value)
      }
    },
    mounted () {
      this.searchServices = searchServices(this.searchServicesResourceUrl)
    },
    methods: {
      async query (value) {
        const result = await this.catchError({
          promise: this.searchServices.search({
            name: this.search,
          }, this.cancelToken.token),
          instance: this
        })
        const { data: { data } } = result
        this.items = data.map(value => ({ value: value.id, text: value.name }))
      },
    }
  }
</script>
