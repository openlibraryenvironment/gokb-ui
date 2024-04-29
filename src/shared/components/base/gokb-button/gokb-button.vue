<template>
  <v-btn
    :color="disabled ? 'disabled' : colorValue"
    :variant="!!text ? 'text' : 'elevated'"
    :disabled="disabled"
    :type="isSubmit ? 'submit' : undefined"
    :to="to"
    :target="newTab ? '_blank' : undefined"
    class="font-weight-bold"
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
    <slot default />
  </v-btn>
</template>

<script>
  export default {
    name: 'GokbButton',
    emits: ['click'],
    props: {
      isSubmit: {
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
        type: [String, Object],
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
      },
      newTab: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    computed: {
      colorValue () {
        return this.color || (!this.isSubmit && 'secondary') || 'primary'
      }
    },
  }
</script>

<style scoped>
</style>
