<template>
  <v-radio
    :label="label"
    :disabled="disabled"
  />
</template>

<script>
  export default {
    name: 'RadioButtonComponent',
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

<style scoped>
</style>
