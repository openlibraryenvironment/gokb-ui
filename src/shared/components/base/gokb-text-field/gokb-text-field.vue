<template>
  <v-text-field
    ref="textField"
    v-model="localValue"
    :disabled="disabled"
    :autocomplete="autocomplete"
    :label="label"
    :prepend-icon="hideIcon ? '' : prependIcon"
    :required="required"
    :rules="rules"
    :type="type"
    :placeholder="placeholder"
    :append-icon="appendIcon"
    validate-on-blur
    clearable
    @click:append="$emit('click:append', $event)"
  />
</template>

<script>
  export default {
    name: 'GokbTextField',
    props: {
      value: {
        type: String,
        required: true,
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
      appendIcon: {
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
    methods: {
      validate () {
        this.$refs.textField.validate(true)
      }
    }
  }
</script>

<style scoped>
</style>
