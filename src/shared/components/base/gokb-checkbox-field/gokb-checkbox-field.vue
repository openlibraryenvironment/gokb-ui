<template>
  <v-checkbox
    v-model="localValue"
    :label="label"
    :disabled="disabled || readonly"
    :readonly="readonly"
    :density="dense ? 'compact' : 'default'"
  />
</template>

<script>
  export default {
    name: 'GokbCheckboxField',
    emits: ['update:model-value'],
    props: {
      label: {
        type: String,
        required: false,
        default: undefined,
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false,
      },
      modelValue: {
        type: Boolean,
        required: true,
        default: false
      },
      readonly: {
        type: Boolean,
        required: false,
        default: false,
      },
      dense: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    computed: {
      localValue: {
        get () {
          return this.modelValue
        },
        set (localValue) {
          this.$emit('update:model-value', localValue)
        }
      },
    },
  }
</script>
