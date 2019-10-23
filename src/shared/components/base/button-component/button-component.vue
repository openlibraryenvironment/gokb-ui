<template>
  <v-btn
    :color="colorValue"
    :text="text"
    :type="type"
    :disabled="disabled"
  >
    <slot />
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
        default: undefined,
      },
      text: {
        type: Boolean,
        required: false,
        default: false,
      },
      disabled: {
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
