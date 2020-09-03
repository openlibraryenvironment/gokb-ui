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
      value: {
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
          return this.value
        },
        set (localValue) {
          this.$emit('input', localValue)
        }
      },
    },
  }
</script>
