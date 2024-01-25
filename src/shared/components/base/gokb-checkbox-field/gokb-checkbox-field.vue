<template>
  <v-checkbox
    v-model="localValue"
    :label="label"
    :disabled="disabled"
    :readonly="readonly"
  />
</template>

<script>
  export default {
    name: 'GokbCheckboxField',
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
    },
    computed: {
      localValue: {
        get () {
          return this.modelValue
        },
        set (localValue) {
          this.$emit('update:modelValue', localValue)
        }
      },
    },
  }
</script>
