<template>
  <v-radio
    :disabled="disabled"
    :label="label"
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
    },
  }
</script>
