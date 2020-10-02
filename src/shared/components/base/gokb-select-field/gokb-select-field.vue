<template>
  <gokb-text-field
    v-if="readonly"
    v-model="selectedName"
    :label="label"
    disabled
  />
  <v-select
    v-else-if="items"
    v-model="localValue"
    :items="items"
    :label="label"
    :placeholder="placeholder"
    item-text="name"
    item-value="id"
    min-width="240"
    :clearable="clearable"
    :return-object="returnObject"
  />
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import genericEntityServices from '@/shared/services/generic-entity-services'

  export default {
    name: 'GokbSelectField',
    extends: BaseComponent,
    label: '',
    entityName: undefined,
    props: {
      value: {
        type: [Object, String, Number, Array, Boolean],
        required: false,
        default: () => undefined,
      },
      placeholder: {
        type: String,
        required: false,
        default: '',
      },
      label: {
        type: String,
        required: false,
        default: ''
      },
      multiple: {
        type: Boolean,
        required: false,
        default: false
      },
      returnObject: {
        type: Boolean,
        required: false,
        default: false
      },
      clearable: {
        type: Boolean,
        required: false,
        default: true
      },
      readonly: {
        type: Boolean,
        required: false,
        default: false
      },
      initItem: {
        type: [Object, String],
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        items: [],
        selectedName: undefined
      }
    },
    computed: {
      localValue: {
        get () {
          return this.value
        },
        set (value) {
          // console.log('select field', value)
          this.$emit('input', value)
        }
      }
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

        if (this.initItem) {
          this.setInit()
        }
      } else if (this.$attrs.items) {
        this.items = this.$attrs.items
      }
    },
    methods: {
      transform (result) {
        const { data: { data } } = result
        return data
      },
      setInit () {
        var selected

        if (this.initItem) {
          if (typeof this.initItem === 'string') {
            selected = this.items.filter(item => (item.name === this.initItem))
          } else if (this.initItem instanceof Object) {
            if (this.initItem.id) {
              selected = this.items.filter(item => item.id === this.initItem.id)
            }
            if (!selected && this.initItem.value) {
              selected = this.items.filter(item => (item.name === this.initItem.value || item.value === this.initItem.value))
            }
            if (!selected && this.initItem.name) {
              selected = this.items.filter(item => (item.name === this.initItem.name || item.value === this.initItem.name))
            }
          }

          if (selected?.length === 1) {
            this.localValue = selected[0]
            this.selectedName = selected[0].name
          }
        }
      }
    }
  }
</script>
