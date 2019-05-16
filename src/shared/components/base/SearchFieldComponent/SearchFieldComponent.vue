<template>
  <v-autocomplete
    :loading="loading"
    :items="items"
    :search-input.sync="search"
    v-model="localValue"
    hide-no-data
    hide-details
    no-filter
    clearable
    :label="label"
    :rules="rules"
    :placeholder="placeholder"></v-autocomplete>
</template>

<script>
import BaseComponent from '@/shared/components/BaseComponent'
import ajaxServices from '@/shared/services/ajax-services'

export default {
  name: 'SearchFieldComponent',
  extends: BaseComponent,
  data () {
    return {
      label: undefined,
      placeholder: undefined,
      rules: undefined,
      queryParameters: undefined,

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
  methods: {
    async query (value) {
      this.loading = true
      const items = await this.catchError(ajaxServices.lookup({
        ...this.queryParameters,
        q: value,
      }, this.cancelToken.token), this, this.handleError)
      this.items = items.values.map(value => ({ value: value.id, text: value.text }))
      this.loading = false
    },
  }
}
</script>
