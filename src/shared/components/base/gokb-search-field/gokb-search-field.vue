<template>
  <gokb-text-field
    v-if="readonly"
    v-model="localLabel"
    :label="label"
    readonly
  />
  <v-combobox
    v-else-if="allowNewValues"
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
      readonly: {
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
      localLabel () {
        return this.value?.[this.itemText]
      },
      localValue: {
        get () {
          // console.log('get', this.label, this.value)
          return this.returnObject ? this.value : this.value?.[this.itemValue]
        },
        set (localValue) {
          // console.log('set', this.label, localValue, this.items)
          this.$emit('input', localValue)
        }
      }
    },
    watch: {
      search (text) {
        // console.log('search', this.value, this.localValue, this.search, value)
        text && text !== this.value?.value && text.length > 2 && this.query({ text })
      }
    },
    mounted () {
      this.searchServices = searchServices(this.searchServicesResourceUrl)
      this.items = this.value ? [this.value] : []
    },
    methods: {
      async query ({ id, text }) {
        this.loading = true
        const result = await this.catchError({
          promise: this.searchServices.search({
            [this.itemText]: text,
            [this.itemValue]: id,
            _include: [this.itemValue, this.itemText],
          }, this.cancelToken.token),
          instance: this
        })
        this.loading = false
        this.items = result?.data?.data
      }
    }
  }
</script>
