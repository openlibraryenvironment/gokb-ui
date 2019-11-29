<template>
  <v-radio v-bind="$attrs" />
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

<style scoped>
</style>
