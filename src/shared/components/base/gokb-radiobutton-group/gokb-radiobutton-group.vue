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
      value: {
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
          return this.value
        },
        set (localValue) {
          this.$emit('input', localValue)
        }
      },
    },
  }
</script>

<style scoped>
</style>
