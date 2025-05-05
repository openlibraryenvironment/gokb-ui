<template>
  <v-row no-gutters dense>
    <v-col>
      <v-checkbox
        v-model="localValue"
        :label="label"
        :disabled="disabled || readonly"
        :style="{ opacity: opacity }"
        :readonly="readonly"
        :density="dense ? 'compact' : 'default'"
      />
    </v-col>
    <v-col v-if="!!gokbTooltip" cols="1" align-self="baseline">
      <gokb-tooltip classes="mt-3" :code="gokbTooltip" />
    </v-col>
  </v-row>
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
        required: true,
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
