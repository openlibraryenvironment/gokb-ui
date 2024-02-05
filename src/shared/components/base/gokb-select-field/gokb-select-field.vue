<template>
  <div v-if="readonly">
    <gokb-text-field
      v-if="readonly"
      v-model="localName"
      :label="label"
      :dense="dense"
      disabled
    />
    <div style="color:red;" v-if="localErrorMessage.length > 0"> {{ localErrorMessage }} </div>
  </div>

  <v-select
    v-else
    ref="select"
    v-model="localValue"
    :items="localizedItems"
    :label="label"
    :placeholder="placeholder"
    item-title="name"
    item-value="id"
    :rules="selectRules"
    :no-data-text="$t('search.results.empty')"
    :style="{ maxWidth: width }"
    :clearable="clearable && !required"
    :return-object="returnObject"
    :persistent-placeholder="!!placeholder"
    variant="underlined"
    :dense="dense"
  >
    <template #label>
      {{ label }}
      <span
        v-if="required"
        style="color:red"
      >
        *
      </span>
    </template>
  </v-select>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import genericEntityServices from '@/shared/services/generic-entity-services'
  import states from '@/shared/models/states-model'

  export default {
    name: 'GokbSelectField',
    extends: BaseComponent,
    label: '',
    entityName: undefined,
    searchParams: {},
    props: {
      modelValue: {
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
      },
      apiErrors: {
        type: Array,
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        rawItems: [],
        localizedItems: [],
        stateLabel: undefined
      }
    },
    computed: {
      localValue: {
        get () {
          return this.modelValue
        },
        set (value) {
          // console.log('select field', value)
          this.$emit('update:modelValue', value)
        }
      },
      localName () {
        return this.localValue?.name || undefined
      },
      selectRules () {
        return [value => (!!this.required && !!value) || !this.required || this.$i18n.t('validation.missingSelection')]
      },
      localErrorMessage () {
        return this.apiErrors ? this.$i18n.t(this.apiErrors[0].messageCode) : []
      }
    },
    watch: {
      rawItems: {
        handler () {
          this.updateItems()
        },
        deep: true
      },
      '$i18n.locale'() {
        this.updateItems()
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
      updateItems (){
        this.localizedItems = this.rawItems
      },
      localizeValue (val) {
        return val
      },
      setInit (init) {
        var selected

        if (init) {
          if (typeof init === 'string') {
            selected = this.rawItems.filter(item => (item.name === init || item.value === init))
          } else if (typeof init === 'number') {
            selected = this.rawItems.filter(item => (item.id === init))
          } else if (init instanceof Object) {
            if (init.id) {
              selected = this.rawItems.filter(item => item.id === init.id || item.value === init.id)
            }
            if (!selected && init.value) {
              selected = this.rawItems.filter(item => (item.name === init.value || item.value === init.value))
            }
            if (!selected && init.name) {
              selected = this.rawItems.filter(item => (item.name === init.name || item.value === init.name))
            }
          }

          if (selected?.length === 1) {
            this.localValue = selected.map (item => ({ value: item.value, id: item.id, name: this.localizeValue(item.value) }))[0]
          }
        }
      },
      async fetch () {
        if (this.entityName) {
          if (!!this.stateLabel && states.hasCategory(this.stateLabel)) {
            this.rawItems = states.getCategory(this.stateLabel)
          } else {
            const entityService = genericEntityServices(this.entityName)
            const parameters = { _sort: 'name', _order: 'asc', ...this.searchParams }
            const response = await this.catchError({
              promise: entityService.get({ parameters }, this.cancelToken.token),
              instance: this
            })

            if (response) {
              this.rawItems = this.transform(response)

              if (this.stateLabel) {
                states.addCategory(this.stateLabel, this.rawItems)
              }
            }
          }

          if (this.initItem) {
            this.setInit(this.initItem)
          }
          else if (!!this.modelValue && typeof this.modelValue === 'string') {
            this.setInit(this.modelValue)
          }
        }
      }
    }
  }
</script>
