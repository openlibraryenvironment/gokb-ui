<template>
  <v-text-field
    ref="textField"
    v-model="localValue"
    :disabled="disabled || readonly"
    :readonly="readonly || disabled"
    :autocomplete="autocomplete"
    :full-width="fw"
    :label="label"
    :prepend-icon="hideIcon ? '' : prependIcon"
    :required="required"
    :rules="rules"
    :type="type"
    :error="!!apiErrors"
    :error-messages="apiErrorMessages"
    maxlength="255"
    :placeholder="placeholder"
    :append-icon="appendIcon"
    :validate-on-blur="validateOnBlur"
    :clearable="!readonly && !disabled"
    :dense="dense"
    @click:append="$emit('click:append', $event)"
    @click:prepend="iconAction"
    :class="[ (disabled ? 'v-input--is-disabled' : '') ]"
  >
    <template #label>
      {{ label }}
      <span
        v-if="required"
        style="color:red"
      >
        *
      </span>
    </template>
  </v-text-field>
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
      validateOnBlur: {
        type: Boolean,
        required: false,
        default: false,
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
        },
      },
      isValid () {
        return this.$refs.textField.valid
      },
      apiErrorMessages () {
        return this.apiErrors?.length > 0 ? this.apiErrors.map(e => (e.messageCode ? this.$i18n.t(e.messageCode) : (e.matches ? this.$i18n.t('validation.valueNotUnique') : e.message))) : undefined
      }
    },
    methods: {
      validate () {
        return this.$refs.textField.validate()
      },
      iconAction () {
        if (this.type == 'email' && this.value && this.validate()) {
          window.location.href = 'mailto:' + this.value
        }
      }
    }
  }
</script>

<style scoped>
</style>
