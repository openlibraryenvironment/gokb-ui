<template>
  <v-select
    v-model="localSelectedItem"
    :items="items"
    v-bind="$props"
    clearable
  />
</template>

<script>
  import BaseComponent from '@/shared/base-component'
  import baseServices from '@/shared/services/base-services'

  export default {
    name: 'GokbSelectField',
    extends: BaseComponent,
    props: {
      value: {
        type: Number,
        required: false,
        default: 0,
      },
      placeholder: {
        type: String,
        required: false,
        default: '',
      },
      label: {
        type: String,
        required: false,
        default: '',
      }
    },
    data () {
      return {
        selectResourceUrl: undefined,
        selectedItem: undefined,
        items: []
      }
    },
    computed: {
      localSelectedItem: {
        get () {
          return this.selectedItem
        },
        set (localSelectedItem) {
          this.$emit('input', localSelectedItem)
        }
      },
    },
    async mounted () {
      const urlParameters = baseServices.createQueryParameters({ _sort: 'value', _order: 'asc' })
      const result = await this.catchError({
        promise: baseServices.request({
          method: 'GET',
          url: `${this.selectResourceUrl}?${urlParameters}`
        }, this.cancelToken.token),
        instance: this
      })
      const { data: { _embedded: { values } } } = result
      this.items = values.map(({ id, value }) => ({ value: id, text: value }))
    }
  }
</script>
