<template>
  <v-radio-group
    row
    :label="label"
  >
    <slot />
  </v-radio-group>
</template>

<script>
  export default {
    name: 'GokbRadiobuttonGroup',
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
