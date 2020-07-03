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
    :item-text="itemText"
    :item-value="itemValue"
    :return-object="returnObject"
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
    :item-text="itemText"
    :item-value="itemValue"
    :return-object="returnObject"
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
        required: true,
        validator: function (value) {
          return value === undefined || typeof value === 'string' || typeof value === 'number' || typeof value === 'object'
        }
      },
      allowNewValues: {
        type: Boolean,
        required: false,
        default: false
      },
      itemText: {
        type: String,
        required: false,
        default: 'name'
      },
      itemValue: {
        type: String,
        required: false,
        default: 'id'
      },
      returnObject: {
        type: Boolean,
        required: false,
        default: false
      },
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
          return this.returnObject ? this.value : this.value?.[this.itemValue]
        },
        set (localValue) {
          // console.log('set', this.label, localValue, this.items)
          this.$emit('input', localValue)
        }
      },
    },
    watch: {
      search (value) {
        // console.log('search', this.value, this.localValue, this.search, value)
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
            [this.itemText]: value,
            _include: [this.itemValue, this.itemText],
          }, this.cancelToken.token),
          instance: this
        })
        this.items = result?.data?.data
      }
    }
  }
</script>
