<template>
  <v-select
    v-model="localSelectedItem"
    :items="items"
    :label="label"
    :placeholder="placeholder"
    item-text="name"
    item-value="id"
    clearable
    return-object
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
        type: [Object, Number, Array, Boolean],
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
      multiple: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data () {
      return {
        items: []
      }
    },
    computed: {
      localSelectedItem: {
        get () {
          return this.value
        },
        set (value) {
          this.$emit('input', value)
        }
      },
    },
    async mounted () {
      if (this.entityName) {
        const entityService = genericEntityServices(this.entityName)
        const parameters = { _select: 'id, name', _sort: 'name', _order: 'asc' }
        const result = await this.catchError({
          promise: entityService.get({ parameters }, this.cancelToken.token),
          instance: this
        })
        this.items = this.transform(result)
      }
    },
    methods: {
      transform (result) {
        const { data: { data: values } } = result
        return values
      }
    }
  }
</script>
