<template>
  <v-radio-group
    v-model="localValue"
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
      modelValue: {
        required: true,
        default: '',
        validator: function (value) {
          return value === undefined || value === null || typeof value === 'string'
        }
      },
    },
    computed: {
      localValue: {
        get () {
          return this.modelValue
        },
        set (localValue) {
          this.$emit('update:modelValue', localValue)
        }
      },
    },
  }
</script>

<style scoped>
</style>
