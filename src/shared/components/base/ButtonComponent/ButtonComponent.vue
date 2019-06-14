<template>
  <v-btn :flat="flat" :color="colorValue" :type="type">
    <slot></slot>
  </v-btn>
</template>

<script>
export default {
  name: 'ButtonComponent',
  props: {
    default: {
      type: Boolean,
      required: false,
      default: false,
    },
    color: {
      type: String,
      required: false,
    },
    flat: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    colorValue () {
      return this.color || (this.default && 'info') || undefined
    },
    type () {
      return (this.default && 'submit') || undefined
    }
  },
}
</script>

<style scoped>
</style>
