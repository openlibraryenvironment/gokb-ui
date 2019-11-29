<template>
  <v-textarea
    v-model="localValue"
    v-bind="$props"
    :prepend-icon-id="hideIcon ? '' : prependIcon"
    validate-on-blur
    clearable
  />
</template>

<script>
  export default {
    name: 'GokbTextareaField',
    props: {
      value: {
        required: true,
        validator: value => {
          return value === null || typeof value === 'string'
        },
        default: '',
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false,
      },
      placeholder: {
        type: String,
        required: false,
        default: '',
      },
      label: {
        type: String,
        required: false,
        default: undefined,
      },
      type: {
        type: String,
        required: false,
        default: 'text',
      },
      required: {
        type: Boolean,
        required: false,
      },
      hideIcon: {
        type: Boolean,
        required: false,
        default: false,
      },
      prependIcon: {
        type: String,
        required: false,
        default: undefined,
      },
      autocomplete: {
        type: String,
        required: false,
        default: undefined,
      },
      rules: {
        type: Array,
        required: false,
        default: undefined,
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
