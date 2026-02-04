<template>
  <v-textarea
    :key="hasUpdated"
    v-model="localValue"
    :disabled="!editable"
    rows="1"
    :prepend-icon-id="hideIcon ? '' : prependIcon"
    :required="required"
    variant="underlined"
    validate-on-blur
    auto-grow
    clearable
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
    <template #append>
      <v-icon v-if="!!appendIcon" @click="$emit('click:append', true)" style="cursor:pointer"> {{ appendIcon }}</v-icon>
      <gokb-tooltip v-if="!!gokbTooltip" classes="mt-0 opacity-100" :code="gokbTooltip" />
    </template>
  </v-textarea>
</template>

<script>
  export default {
    name: 'GokbTextareaField',
    emits: ['update:model-value', 'click:append'],
    props: {
      modelValue: {
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
        default: false,
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
      gokbTooltip: {
        type: String,
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        hasUpdated: false
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
      editable () {
        return !this.readonly && !this.disabled
      }
    },
    methods: {
      refreshRows () {
        this.hasUpdated = !this.hasUpdated
      }
    }
  }
</script>

<style scoped>
</style>
