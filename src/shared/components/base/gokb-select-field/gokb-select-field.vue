<template>
  <v-select
    v-model="localSelectedItem"
    :items="items"
    v-bind="$props"
    item-text="name"
    item-value="id"
    clearable
  />
</template>

<script>
  import BaseComponent from '@/shared/base-component'
  import genericEntityServices from '@/shared/services/generic-entity-services'

  export default {
    name: 'GokbSelectField',
    extends: BaseComponent,
    entityName: undefined,
    props: {
      value: {
        type: [Object, Number, Array],
        required: false,
        default: () => {},
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
      },
      returnObject: {
        type: Boolean,
        required: false,
        default: false
      },
      multiple: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data () {
      return {
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
      const entityService = genericEntityServices(this.entityName)
      const parameters = { _select: 'id, name', _sort: 'name', _order: 'asc' }
      const result = await this.catchError({
        promise: entityService.get({ parameters }, this.cancelToken.token),
        instance: this
      })
      this.items = this.transform(result)
    },
    methods: {
      transform (result) {
        const { data: { data: values } } = result
        return values
      }
    }
  }
</script>
