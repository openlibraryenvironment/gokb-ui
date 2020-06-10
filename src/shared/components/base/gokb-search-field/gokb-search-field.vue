<template>
  <v-combobox
    v-if="allowNewValues"
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
  <v-autocomplete
    v-else
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
  import BaseComponent from '@/shared/components/base-component'
  import searchServices from '@/shared/services/search-services'

  export default {
    name: 'GokbSearchField',
    extends: BaseComponent,
    searchServicesResourceUrl: undefined,
    props: {
      label: {
        type: String,
        required: false,
        default: ''
      },
      value: {
        type: Number,
        required: true,
        default: NaN
      },
      allowNewValues: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data () {
      return {
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
      _include () {
        return 'id,name'
      },
      async query (value) {
        const result = await this.catchError({
          promise: this.searchServices.search({
            name: this.search,
            _include: this._include()
          }, this.cancelToken.token),
          instance: this
        })
        this.items = this.transform(result)
      },
      transform (result) {
        const { data: { data } } = result
        return data.map(({ id, name, ...rest }) => ({ value: id, text: name, ...rest }))
      }
    }
  }
</script>
