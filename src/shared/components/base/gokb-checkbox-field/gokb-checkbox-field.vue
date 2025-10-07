<template>
  <v-checkbox
    v-model="localValue"
    :label="label"
    :style="{opacity: opacity}"
    :disabled="disabled || readonly"
    :readonly="readonly"
    :density="dense ? 'compact' : 'default'"
  >
    <template #append>
      <gokb-tooltip v-if="!!gokbTooltip" classes="opacity-100" :code="gokbTooltip" />
    </template>
  </v-checkbox>
</template>

<script>
  export default {
    name: 'GokbCheckboxField',
    emits: ['update:model-value'],
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
      modelValue: {
        type: Boolean,
        required: false,
        default: false
      },
      readonly: {
        type: Boolean,
        required: false,
        default: false,
      },
      dense: {
        type: Boolean,
        required: false,
        default: false
      },
      gokbTooltip: {
        type: String,
        required: false,
        default: undefined
      },
      opacity: {
        type: Number,
        required: false,
        default: 0.87
      }
    },
    computed: {
      localValue: {
        get () {
          return this.modelValue
        },
        set (localValue) {
          this.$emit('update:model-value', localValue)
        }
      },
    },
  }
</script>
<style>
  .v-selection-control--disabled.v-checkbox-btn {
    color: rgba(var(--v-theme-primary));
  }
</style>
