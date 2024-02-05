<template>
  <v-btn
    :color="colorValue"
    :variant="text ? 'text' : undefined"
    :type="type"
    :class="text || 'invert-text'"
    :disabled="disabled"
    :to="to"
    @click="$emit('click', $event)"
  >
    <v-progress-circular
      v-if="loading"
      size="24"
      indeterminate
    />
    <v-icon
      v-else-if="iconId"
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
      title: {
        type: String,
        required: false,
        default: undefined
      },
      loading: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    computed: {
      colorValue () {
        return this.color || (!this.default && 'secondary') || 'primary'
      },
      type () {
        return (this.default && 'submit') || undefined
      }
    },
  }
</script>

<style scoped>
</style>
