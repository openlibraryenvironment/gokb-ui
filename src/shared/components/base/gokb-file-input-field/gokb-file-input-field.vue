<template>
  <v-file-input
    ref="input"
    v-model="localSelectedFile"
    :label="label"
    prepend-icon="mdi-file-delimited"
    :truncate-length="truncateLength"
    :disabled="disabled"
    accept=".txt,.tsv,.csv"
    show-size
  />
</template>

<script>
  export default {
    name: 'GokbFileInputField',
    emits: ['update:model-value'],
    props: {
      label: {
        type: String,
        required: false,
        default: 'Datei',
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false,
      },
      modelValue: {
        type: [File, Array],
        required: false,
        default: null,
      },
      truncateLength: {
        type: Number,
        required: false,
        default: 22
      }
    },
    computed: {
      localSelectedFile: {
        get () {
          return this.modelValue
        },
        set (value) {
          this.$emit('update:model-value', value)
        }
      }
    }
  }
</script>

<style scoped>
</style>
