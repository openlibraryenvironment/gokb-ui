<template>
  <v-radio-group
    row
    v-bind="$props"
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
