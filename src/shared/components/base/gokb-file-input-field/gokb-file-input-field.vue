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
      value: {
        type: File,
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
          return this.value
        },
        set (value) {
          this.$emit('input', value)
        }
      }
    }
  }
</script>

<style scoped>
</style>
