<template>
  <v-btn
    :color="colorValue"
    :text="text"
    :type="type"
    :disabled="disabled"
    :to="to"
    @click="$emit('click', $event)"
  >
    <v-icon
      v-if="iconId"
      left
    >
      {{ iconId }}
    </v-icon>
    <slot />
  </v-btn>
</template>

<script>
  export default {
    name: 'GokbButton',
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
      iconId: {
        type: String,
        required: false,
        default: undefined,
      },
      to: {
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
        return this.color || (this.default && 'accent') || 'primary'
      },
      type () {
        return (this.default && 'submit') || undefined
      }
    },
  }
</script>

<style scoped>
</style>
