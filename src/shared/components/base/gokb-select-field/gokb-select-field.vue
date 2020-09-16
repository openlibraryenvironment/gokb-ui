<template>
  <gokb-text-field
    v-if="readonly"
    v-model="localLabel"
    :label="label"
    disabled
  />
  <v-select
    v-else
    v-model="localValue"
    :items="items"
    :label="label"
    :placeholder="placeholder"
    item-text="name"
    item-value="id"
    min-width="250"
    clearable
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
      readonly: {
        type: Boolean,
        required: false,
        default: false
      },
    },
    data () {
      return {
        items: []
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
      },
      localLabel () {
        return this.value?.name
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
      } else if (this.$attrs.items) {
        this.items = this.$attrs.items
      }
    },
    methods: {
      transform (result) {
        const { data: { data } } = result
        return data
      }
    }
  }
</script>
