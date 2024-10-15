<template>
  <v-radio-group
    v-model="localValue"
    inline
    :label="label"
    :disabled="disabled"
  >
    <slot />
  </v-radio-group>
</template>

<script>
  export default {
    name: 'GokbRadiobuttonGroup',
    emits: ['update:model-value'],
    props: {
      label: {
        type: String,
        required: false,
        default: undefined,
      },
      modelValue: {
        required: true,
        default: '',
        validator: function (value) {
          return value === undefined || value === null || typeof value === 'string'
        }
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false,
      },
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

<style scoped>
</style>
