<template>
  <v-radio
    :disabled="disabled"
    :readonly="readonly"
    :label="label"
    :value="modelValue"
  />
</template>

<script>
  export default {
    name: 'GokbRadioButtonField',
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
      readonly: {
        type: Boolean,
        required: false,
        default: false,
      },
      modelValue: {
        type: String,
        required: true
      }
    },
  }
</script>
