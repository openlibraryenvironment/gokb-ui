<template>
  <v-file-input
    :label="label"
    prepend-icon=""
    show-size
    clearable
  >
  &nbsp;
  </v-file-input>
</template>

<script>
  export default {
    name: 'GokbFileInputField',
    props: {
      label: {
        type: String,
        required: false,
        default: undefined,
      },
    },
  }
</script>

<style scoped>
</style>
