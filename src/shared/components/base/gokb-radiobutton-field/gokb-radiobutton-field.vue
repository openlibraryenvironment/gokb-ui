<template>
  <v-radio
    :disabled="disabled"
    :readonly="readonly"
    :label="label"
    :value="value"
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
      value: {
        type: String,
        required: true
      }
    },
  }
</script>
