<template>
  <v-text-field
    ref="textField"
    v-model="localValue"
    :disabled="!editable"
    :autocomplete="autocomplete"
    :full-width="fw"
    :label="label"
    :prepend-icon="hideIcon ? '' : prependIcon"
    :required="required"
    :rules="localRules"
    :type="type"
    :error="!!apiErrors"
    :error-messages="errorMessages"
    maxlength="255"
    :placeholder="placeholder"
    :append-icon="appendIcon"
    :validate-on-blur="validateOnBlur"
    :clearable="allowClear && editable"
    :density="dense ? 'compact' : 'default'"
    :persistent-placeholder="!!placeholder"
    variant="underlined"
    @click:append="$emit('click:append', $event)"
    @click:prepend="iconAction"
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
    emits: ['update:model-value', 'click:append'],
    props: {
      modelValue: {
        required: false,
        default: ''
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
        default: false
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
      },
      apiErrors: {
        type: [Object, Array],
        required: false,
        default: undefined
      },
      allowClear: {
        type: Boolean,
        required: false,
        default: true
      }
    },
    data () {
      return {
        localErrorMessages: undefined,
        localRules: []
      }
    },
    computed: {
      localValue: {
        get () {
          return this.modelValue
        },
        set (localValue) {
          this.$emit('update:model-value', localValue)
        },
      },
      isValid () {
        return !this.localErrorMessages && (!this.apiErrors || this.apiErrors.length === 0)
      },
      apiErrorMessages () {
        return this.apiErrors?.length > 0 ? this.apiErrors.map(e => (e.messageCode ? this.$i18n.t(e.messageCode) : (e.matches ? this.$i18n.t('validation.valueNotUnique') : e.message))) : undefined
      },
      errorMessages () {
        return this.localErrorMessages || this.apiErrorMessages
      },
      editable () {
        return !this.readonly && !this.disabled
      }
    },
    watch: {
      rules (r) {
        if (r?.length > 0) {
          this.localRules = r
        }
        else {
          this.localRules = [v => (v.length > 0 || !this.required) || this.$i18n.t('validation.missingValue')]
        }
      }
    },
    methods: {
      validate () {
        return this.$refs.textField.validate()
      },
      iconAction () {
        if (this.type == 'email' && this.modelValue && this.validate()) {
          window.location.href = 'mailto:' + this.modelValue
        }
      }
    }
  }
</script>

<style lang="scss">
  @use '@/styles/settings';

  .v-field--disabled {
    pointer-events: auto !important;
    opacity: var(--v-high-emphasis-opacity);
    border-bottom: none !important;
  }

  .v-field-label {
    opacity: var(--v-high-emphasis-opacity);
    color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity)) !important;
  }

  .v-field__overlay {
    opacity: var(--v-high-emphasis-opacity);
    border-bottom: none !important;
  }

  .v-progress-linear {
    opacity: var(--v-high-emphasis-opacity);
    border-bottom: none !important;
  }

  .v-text-field .v-field--active.v-field--dirty {
    opacity: var(--v-high-emphasis-opacity);
  }

  .v-text-field .v-field--active {
    opacity: var(--v-medium-emphasis-opacity);
  }

</style>
