<template>
  <v-text-field
    :label="label"
    v-model="localValue"
    :type="type"
    :required="required"
    :prepend-icon="prependIcon"
    :browser-autocomplete="browserAutocomplete"/>
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
    },
    browserAutocomplete: {
      type: String,
      required: false,
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
