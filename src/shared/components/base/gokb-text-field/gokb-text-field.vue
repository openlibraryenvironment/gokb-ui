<template>
  <v-text-field
    ref="textField"
    v-model="localValue"
    :disabled="disabled"
    :readonly="readonly"
    :autocomplete="autocomplete"
    :full-width="fw"
    :label="label"
    :prepend-icon="hideIcon ? '' : prependIcon"
    :required="required"
    :rules="rules"
    :type="type"
    :error="!!apiErrors"
    :placeholder="placeholder"
    :append-icon="appendIcon"
    validate-on-blur
    :clearable="!readonly"
    :dense="dense"
    @click:append="$emit('click:append', $event)"
  />
</template>

<script>
  export default {
    name: 'GokbTextField',
    props: {
      value: {
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
      readonly: {
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
      fw: {
        type: Boolean,
        required: false,
        default: false
      },
      dense: {
        type: Boolean,
        required: false,
        default: false
      },
      rules: {
        type: Array,
        required: false,
        default () {
          return [v => (v?.length > 0 || !this.required) || this.$i18n.t('validation.missingValue')]
        }
      },
      apiErrors: {
        type: [Object, Array],
        required: false,
        default: undefined
      }
    },
    computed: {
      localValue: {
        get () {
          return this.value
        },
        set (localValue) {
          this.$emit('input', localValue)
        }
      }
    },
    methods: {
      validate () {
        this.$refs.textField.validate()
      }
    }
  }
</script>

<style scoped>
</style>
