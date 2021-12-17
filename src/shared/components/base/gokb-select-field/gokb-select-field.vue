<template>
  <gokb-text-field
    v-if="readonly"
    v-model="localName"
    :label="label"
    :dense="dense"
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
    :rules="rules"
    :no-data-text="$t('search.results.empty')"
    :style="{ maxWidth: width }"
    :clearable="clearable && !required"
    :return-object="returnObject"
    :dense="dense"
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
    searchParams: {},
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
      width: {
        type: String,
        required: false,
        default: '250px'
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
      required: {
        type: Boolean,
        required: false,
        default: false
      },
      initItem: {
        type: [Object, String, Number],
        required: false,
        default: undefined
      },
      dense: {
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
      localValue: {
        get () {
          return this.value
        },
        set (value) {
          // console.log('select field', value)
          this.$emit('input', value)
        }
      },
      localName () {
        return this.localValue?.name || undefined
      },
      rules () {
        return [value => (!!this.required && !!value) || !this.required || this.$i18n.t('validation.missingSelection')]
      }
    },
    async mounted () {
      this.fetch()
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
          } else if (typeof this.initItem === 'number') {
            selected = this.items.filter(item => (item.id === this.initItem))
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
          }
        }
      },
      async fetch () {
        if (this.entityName) {
          const entityService = genericEntityServices(this.entityName)
          const parameters = { _sort: 'name', _order: 'asc', ...this.searchParams }
          const response = await this.catchError({
            promise: entityService.get({ parameters }, this.cancelToken.token),
            instance: this
          })

          if (response) {
            this.items = this.transform(response)
          }

          if (this.initItem) {
            this.setInit()
          }
        } else if (this.$attrs.items) {
          this.items = this.$attrs.items
        }
      },
    }
  }
</script>
