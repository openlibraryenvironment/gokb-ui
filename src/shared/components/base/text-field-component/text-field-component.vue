<template>
  <v-text-field
    v-model="localValue"
    :autocomplete="browserAutocomplete"
    :label="label"
    :prepend-icon="prependIcon"
    :required="required"
    :rules="rules"
    :type="type"
    clearable
  />
</template>

<script>
  export default {
    name: 'TextFieldComponent',
    props: {
      value: {
        type: String,
        required: true,
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
      prependIcon: {
        type: String,
        required: false,
        default: undefined,
      },
      browserAutocomplete: {
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
